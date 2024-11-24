// components/TeamCard.tsx
import { Card, Text, Button, Stack } from "@mantine/core";
import { Team } from "../features/teams/types";

interface TeamCardProps {
	team: Team;
	onViewDetails: (teamId: number) => void;
}

export function TeamCard({ team, onViewDetails }: TeamCardProps) {
	console.log(team);
	return (
		<Card shadow="sm" padding="lg" radius="md" withBorder>
			<Stack gap="sm">
				<Text fw={500} size="lg">
					{team.name}
				</Text>
				<Text size="sm" c="dimmed" lineClamp={2}>
					{team.description}
				</Text>

				<Button
					variant="light"
					fullWidth
					onClick={() => onViewDetails(team.id)}
				>
					Подробнее
				</Button>
			</Stack>
		</Card>
	);
}
