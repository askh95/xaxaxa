// src/components/FilterDrawer/FilterDrawer.tsx
import { useState, useEffect } from "react";
import {
	Drawer,
	Group,
	Button,
	Text,
	Stack,
	Select,
	NumberInput,
	TextInput,
} from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { DatePickerInput } from "@mantine/dates";
import {
	SPORTS_TYPES,
	DISCIPLINES,
	COMPETITION_TYPES,
	TIME_FRAMES,
} from "../features/events/constants";
import type { EventFilters } from "../features/events/types";
import { formatDate, getDateRangeFromPeriod } from "../features/events/utils";

interface FilterDrawerProps {
	opened: boolean;
	close: () => void;
	filters: EventFilters;
	onFiltersChange: (filters: EventFilters) => void;
	onApply: () => void;
	onReset: () => void;
}

export function FilterDrawer({
	opened,
	close,
	filters,
	onFiltersChange,
	onApply,
	onReset,
}: FilterDrawerProps) {
	const [availableDisciplines, setAvailableDisciplines] = useState<string[]>(
		[]
	);

	useEffect(() => {
		const sportType = filters.sportType as keyof typeof DISCIPLINES | undefined;
		if (sportType && DISCIPLINES[sportType]) {
			setAvailableDisciplines(DISCIPLINES[sportType] as any);
		} else {
			setAvailableDisciplines([]);
		}
	}, [filters.sportType]);

	const handleChange = (field: keyof EventFilters, value: any) => {
		if (field === "timeFrame") {
			const { startDate, endDate } = getDateRangeFromPeriod(value);
			onFiltersChange({
				...filters,
				timeFrame: value,
				startDate: startDate as any,
				endDate: endDate as any,
			});
		} else {
			onFiltersChange({
				...filters,
				[field]: value,
			});
		}
	};

	return (
		<Drawer
			opened={opened}
			onClose={close}
			title={
				<Group justify="space-between" w="100%">
					<Text fw={500}>Фильтры</Text>
					<Button
						variant="subtle"
						color="gray"
						size="sm"
						leftSection={<IconX size={16} />}
						onClick={onReset}
					>
						Сбросить
					</Button>
				</Group>
			}
			position="right"
			size="lg"
		>
			<Stack p="md" gap="md">
				<Select
					label="Период отображения"
					placeholder="Выберите период"
					data={TIME_FRAMES}
					value={filters.timeFrame}
					onChange={(value) => handleChange("timeFrame", value)}
					clearable
					searchable
				/>

				<Select
					label="Вид спорта"
					placeholder="Выберите вид спорта"
					data={SPORTS_TYPES}
					value={filters.sportType}
					onChange={(value) => {
						handleChange("sportType", value);
						handleChange("discipline", null);
					}}
					clearable
					searchable
				/>

				{availableDisciplines.length > 0 && (
					<Select
						label="Дисциплина"
						placeholder="Выберите дисциплину"
						data={availableDisciplines}
						value={filters.discipline}
						onChange={(value) => handleChange("discipline", value)}
						clearable
						searchable
					/>
				)}

				<Select
					label="Тип соревнования"
					placeholder="Выберите тип"
					data={COMPETITION_TYPES}
					value={filters.competitionType}
					onChange={(value) => handleChange("competitionType", value)}
					clearable
					searchable
				/>

				<Select
					label="Пол участников"
					placeholder="Выберите пол"
					data={[
						{ value: "male", label: "Мужской" },
						{ value: "female", label: "Женский" },
						{ value: "junior_male", label: "Юниоры" },
						{ value: "junior_female", label: "Юниорки" },
					]}
					value={filters.gender}
					onChange={(value) => handleChange("gender", value)}
					clearable
				/>

				<NumberInput
					label="Возраст"
					placeholder="Укажите возраст"
					value={filters.ageGroup ? Number(filters.ageGroup) : ""}
					onChange={(value) => handleChange("ageGroup", value?.toString())}
					min={0}
					max={100}
					clampBehavior="strict"
					allowDecimal={false}
					hideControls
				/>

				<TextInput
					label="Место проведения"
					placeholder="Введите место проведения"
					value={filters.location}
					onChange={(event) =>
						handleChange("location", event.currentTarget.value)
					}
				/>

				<Group grow>
					<NumberInput
						label="Мин. участников"
						placeholder="Минимум"
						value={filters.minParticipants}
						onChange={(value) => handleChange("minParticipants", value)}
						min={0}
					/>
					<NumberInput
						label="Макс. участников"
						placeholder="Максимум"
						value={filters.maxParticipants}
						onChange={(value) => handleChange("maxParticipants", value)}
						min={filters.minParticipants || 0}
					/>
				</Group>

				<DatePickerInput
					label="Дата начала"
					placeholder="Выберите дату"
					value={filters.startDate ? new Date(filters.startDate) : null}
					onChange={(date) =>
						handleChange("startDate", date ? formatDate(date) : null)
					}
					clearable
				/>

				<DatePickerInput
					label="Дата окончания"
					placeholder="Выберите дату"
					value={filters.endDate ? new Date(filters.endDate) : null}
					onChange={(date) =>
						handleChange("endDate", date ? formatDate(date) : null)
					}
					clearable
					minDate={filters.startDate ? new Date(filters.startDate) : undefined}
				/>

				<Group mt="xl" grow>
					<Button variant="default" onClick={onReset} size="md">
						Сбросить
					</Button>
					<Button
						onClick={onApply}
						variant="gradient"
						gradient={{ from: "blue", to: "cyan" }}
						size="md"
					>
						Применить
					</Button>
				</Group>
			</Stack>
		</Drawer>
	);
}

export default FilterDrawer;
