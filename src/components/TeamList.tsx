// components/TeamList.tsx
import { SimpleGrid, Group, Text, Loader, Center } from "@mantine/core";
import { useState } from "react";
import { useGetMyTeamsQuery } from "../features/teams/teamsApi";
import { TeamCard } from "./TeamCard";
import { CreateTeamModal } from "./CreateTeamModal";

export function TeamList() {
	const [createModalOpened, setCreateModalOpened] = useState(false);
	const { data: teams, isLoading } = useGetMyTeamsQuery();

	const handleViewDetails = (teamId: number) => {
		console.log("Navigate to team:", teamId);
	};

	if (isLoading) {
		return (
			<Center h={200}>
				<Loader size="lg" />
			</Center>
		);
	}

	if (!teams?.length) {
		return <Text c="dimmed">У вас пока нет команд</Text>;
	}

	return (
		<>
			<Group justify="space-between" mb="lg">
				<Text size="xl" fw={500}>
					Мои команды
				</Text>
			</Group>

			<SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
				{teams.map((team) => (
					<TeamCard
						key={team.id}
						team={team}
						onViewDetails={handleViewDetails}
					/>
				))}
			</SimpleGrid>

			<CreateTeamModal
				opened={createModalOpened}
				onClose={() => setCreateModalOpened(false)}
			/>
		</>
	);
}
