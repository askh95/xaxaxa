// src/components/EventCard.tsx
import { Card, Text, Badge, Group, Button, Stack, Flex } from "@mantine/core";
import { IconCalendarEvent, IconMapPin, IconUsers } from "@tabler/icons-react";
import { Event } from "../features/events/types";
import { useNavigate } from "react-router-dom";

interface EventCardProps {
	event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
	const navigate = useNavigate();

	const handleDetailsClick = () => {
		navigate(`/sport-events/${event.id}`);
	};
	return (
		<Card shadow="sm" padding="lg" radius="md" withBorder>
			<Flex gap="lg" align="flex-start">
				<Stack style={{ flex: 1 }} justify="space-between">
					<div>
						<Group justify="space-between" mb="xs">
							<Text fw={500} size="lg" style={{ flex: 1 }} lineClamp={1}>
								{event.name}
							</Text>
							<Badge color="blue" variant="light" size="lg">
								{event.category.name}
							</Badge>
						</Group>

						<Text size="sm" c="dimmed" mb="md" lineClamp={2}>
							{event.description}
						</Text>
					</div>

					<Group gap="xl">
						<Group gap="xs">
							<IconCalendarEvent size={18} color="blue" />
							<Text size="sm">
								{new Date(event.dateStart).toLocaleDateString()} -
								{new Date(event.dateEnd).toLocaleDateString()}
							</Text>
						</Group>

						<Group gap="xs">
							<IconMapPin size={18} color="red" />
							<Text size="sm" lineClamp={1}>
								{event.location}
							</Text>
						</Group>

						<Group gap="xs">
							<IconUsers size={18} color="green" />
							<Text size="sm">{event.participants} участников</Text>
						</Group>
					</Group>
				</Stack>

				<Button
					variant="gradient"
					gradient={{ from: "blue", to: "cyan" }}
					size="md"
					radius="md"
					onClick={handleDetailsClick}
					styles={(theme) => ({
						root: {
							transition: "all 0.2s ease",
							"&:hover": {
								transform: "scale(1.05)",
								boxShadow: theme.shadows.md,
							},
						},
					})}
				>
					Подробнее
				</Button>
			</Flex>
		</Card>
	);
};

export default EventCard;
