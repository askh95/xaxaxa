import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import {
	Title,
	Stack,
	Loader,
	Center,
	Button,
	Group,
	Box,
	Flex,
	Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconFilter, IconTrophy } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useGetEventsQuery } from "../features/events/eventsApi";
import type { EventFilters, Event } from "../features/events/types";
import EventCard from "../components/EventCard";
import { FilterDrawer } from "../components/FilterDrawer";

const PAGE_SIZE = 10;

const formatDate = (date: Date): string => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
};

const parseUrlParams = (searchParams: URLSearchParams): EventFilters => {
	const filters: EventFilters = {};

	const timeFrame = searchParams.get("timeFrame");
	const category = searchParams.get("category");
	const discipline = searchParams.get("discipline");
	const gender = searchParams.get("gender");
	const ageGroup = searchParams.get("ageGroup");
	const location = searchParams.get("location");
	const minParticipants = searchParams.get("minParticipants");
	const maxParticipants = searchParams.get("maxParticipants");
	const startDate = searchParams.get("startDate");
	const endDate = searchParams.get("endDate");

	if (timeFrame) filters.timeFrame = timeFrame;
	if (category) filters.category = category;
	if (discipline) filters.discipline = discipline;
	if (gender) filters.gender = gender;
	if (ageGroup) filters.ageGroup = ageGroup;
	if (location) filters.location = location;
	if (minParticipants) filters.minParticipants = Number(minParticipants);
	if (maxParticipants) filters.maxParticipants = Number(maxParticipants);
	if (startDate) filters.startDate = startDate;
	if (endDate) filters.endDate = endDate;

	return filters;
};

const updateUrlParams = (
	filters: EventFilters,
	setSearchParams: (params: URLSearchParams) => void
) => {
	const searchParams = new URLSearchParams();

	Object.entries(filters).forEach(([key, value]) => {
		if (value !== null && value !== undefined && value !== "") {
			searchParams.set(key, String(value));
		}
	});

	setSearchParams(searchParams);
};

const HomePage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [opened, { open, close }] = useDisclosure(false);
	const [page, setPage] = useState(0);
	const [filters, setFilters] = useState<EventFilters>(() =>
		parseUrlParams(searchParams)
	);
	const [appliedFilters, setAppliedFilters] = useState<EventFilters>(() =>
		parseUrlParams(searchParams)
	);
	const [allEvents, setAllEvents] = useState<Event[]>([]);
	const [hasMore, setHasMore] = useState(true);
	const observerTarget = useRef<HTMLDivElement>(null);
	const isInitialMount = useRef(true);

	const { data, isLoading, error } = useGetEventsQuery({
		filters: appliedFilters,
		page,
		size: PAGE_SIZE,
	});

	useEffect(() => {
		if (data) {
			if (page === 0 && data.content.length === 0) {
				setHasMore(false);
				setAllEvents([]);
				return;
			}

			if (page === 0) {
				setAllEvents(data.content);
			} else {
				setAllEvents((prev) => [...prev, ...data.content]);
			}

			setHasMore(!data.last && data.content.length > 0);
		}
	}, [data, page]);

	useEffect(() => {
		if (!isInitialMount.current) {
			setPage(0);
			setAllEvents([]);
			setHasMore(true);
		}
		isInitialMount.current = false;
	}, [appliedFilters]);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (
					entries[0].isIntersecting &&
					hasMore &&
					!isLoading &&
					allEvents.length > 0
				) {
					setPage((prev) => prev + 1);
				}
			},
			{ threshold: 0.1 }
		);

		if (observerTarget.current) {
			observer.observe(observerTarget.current);
		}

		return () => {
			if (observerTarget.current) {
				observer.unobserve(observerTarget.current);
			}
		};
	}, [hasMore, isLoading, allEvents.length]);

	const applyFilters = () => {
		setAllEvents([]);
		setPage(0);
		setHasMore(true);

		const newFilters: EventFilters = {};

		if (filters.timeFrame) {
			const now = new Date();

			switch (filters.timeFrame) {
				case "current_week": {
					const weekStart = new Date(now);
					weekStart.setDate(now.getDate() - now.getDay());
					const weekEnd = new Date(now);
					weekEnd.setDate(now.getDate() + (6 - now.getDay()));
					newFilters.startDate = formatDate(weekStart);
					newFilters.endDate = formatDate(weekEnd);
					break;
				}
				case "next_month": {
					const monthStart = new Date(now);
					monthStart.setMonth(monthStart.getMonth() + 1);
					monthStart.setDate(1);
					const monthEnd = new Date(monthStart);
					monthEnd.setMonth(monthEnd.getMonth() + 1);
					monthEnd.setDate(0);
					newFilters.startDate = formatDate(monthStart);
					newFilters.endDate = formatDate(monthEnd);
					break;
				}
				case "quarter": {
					const quarterStart = new Date(now);
					quarterStart.setMonth(Math.floor(quarterStart.getMonth() / 3) * 3);
					quarterStart.setDate(1);
					const quarterEnd = new Date(quarterStart);
					quarterEnd.setMonth(quarterEnd.getMonth() + 3);
					quarterEnd.setDate(0);
					newFilters.startDate = formatDate(quarterStart);
					newFilters.endDate = formatDate(quarterEnd);
					break;
				}
				case "half_year": {
					const halfYearStart = new Date(now);
					halfYearStart.setMonth(Math.floor(halfYearStart.getMonth() / 6) * 6);
					halfYearStart.setDate(1);
					const halfYearEnd = new Date(halfYearStart);
					halfYearEnd.setMonth(halfYearEnd.getMonth() + 6);
					halfYearEnd.setDate(0);
					newFilters.startDate = formatDate(halfYearStart);
					newFilters.endDate = formatDate(halfYearEnd);
					break;
				}
			}
		}

		if (filters.category) newFilters.category = filters.category;
		if (filters.discipline) newFilters.discipline = filters.discipline;
		if (filters.gender) newFilters.gender = filters.gender;
		if (filters.ageGroup) newFilters.ageGroup = filters.ageGroup;
		if (filters.location) newFilters.location = filters.location;
		if (filters.minParticipants)
			newFilters.minParticipants = filters.minParticipants;
		if (filters.maxParticipants)
			newFilters.maxParticipants = filters.maxParticipants;

		if (filters.startDate) {
			newFilters.startDate = formatDate(new Date(filters.startDate));
		}
		if (filters.endDate) {
			newFilters.endDate = formatDate(new Date(filters.endDate));
		}

		updateUrlParams(newFilters, setSearchParams);
		setAppliedFilters(newFilters);
		close();

		notifications.show({
			title: "Готово!",
			message: "Фильтры применены",
			color: "green",
		});
	};

	const resetFilters = () => {
		setAllEvents([]);
		setPage(0);
		setHasMore(true);

		setFilters({});
		setAppliedFilters({});

		setSearchParams(new URLSearchParams());

		notifications.show({
			title: "Готово!",
			message: "Фильтры сброшены",
			color: "blue",
		});

		close();
	};

	if (error) {
		notifications.show({
			title: "Ошибка!",
			message: "Не удалось загрузить события",
			color: "red",
		});
	}

	return (
		<Box>
			<Box
				p="md"
				style={{
					position: "sticky",
					top: 0,
					backgroundColor: "white",
					borderBottom: "1px solid #eee",
					zIndex: 1,
				}}
			>
				<Flex justify="space-between" align="center">
					<Group>
						<IconTrophy size={30} color="blue" />
						<Title>Спортивные события</Title>
					</Group>
					<Button
						leftSection={<IconFilter size={20} />}
						variant="gradient"
						gradient={{ from: "blue", to: "cyan" }}
						onClick={open}
						size="md"
					>
						Фильтры
					</Button>
				</Flex>
			</Box>

			<Box p="md" style={{ flex: 1 }}>
				<Stack gap="md">
					{allEvents.map((event, index) => (
						<EventCard key={`${event.eventId}-${index}`} event={event} />
					))}

					{hasMore && <div ref={observerTarget} style={{ height: "20px" }} />}

					{isLoading && (
						<Center p="xl">
							<Loader size="md" />
						</Center>
					)}

					{!isLoading && !hasMore && allEvents.length > 0 && (
						<Text ta="center" c="dimmed">
							Больше событий нет
						</Text>
					)}

					{!isLoading && allEvents.length === 0 && !isInitialMount.current && (
						<Text ta="center" c="dimmed" size="lg">
							События не найдены
						</Text>
					)}
				</Stack>
			</Box>

			<FilterDrawer
				opened={opened}
				close={close}
				filters={filters}
				onFiltersChange={setFilters}
				onApply={applyFilters}
				onReset={resetFilters}
			/>
		</Box>
	);
};

export default HomePage;
