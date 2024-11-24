// components/TeamDetails.tsx
import {
	Card,
	Text,
	Stack,
	Group,
	Avatar,
	Loader,
	Center,
} from "@mantine/core";
import {
	useGetTeamByIdQuery,
	useGetTeamMembersQuery,
} from "../features/teams/teamsApi";

interface TeamDetailsProps {
	teamId: number;
}

export function TeamDetails({ teamId }: TeamDetailsProps) {
	const { data: team, isLoading: isTeamLoading } = useGetTeamByIdQuery(teamId);
	const { data: members, isLoading: isMembersLoading } =
		useGetTeamMembersQuery(teamId);

	if (isTeamLoading || isMembersLoading) {
		return (
			<Center h={200}>
				<Loader size="lg" />
			</Center>
		);
	}

	if (!team) return <Text>Команда не найдена</Text>;

	return (
		<Stack gap="lg">
			<Card shadow="sm" padding="lg" radius="md" withBorder>
				<Stack gap="md">
					<Text size="xl" fw={500}>
						{team.name}
					</Text>
					<Text>{team.description}</Text>
					<Group>
						<Text fw={500}>Мероприятие:</Text>
						<Text>{team.sportEvent.participants}</Text>
					</Group>
					<Group>
						<Text fw={500}>Место проведения:</Text>
						<Text>{team.sportEvent.location}</Text>
					</Group>
				</Stack>
			</Card>

			<Card shadow="sm" padding="lg" radius="md" withBorder>
				<Text size="lg" fw={500} mb="md">
					Участники команды
				</Text>
				<Stack gap="md">
					{members?.map((member) => (
						<Group key={member.id}>
							<Avatar radius="xl" />
							<Stack gap={4}>
								<Text>
									{member.user.firstName} {member.user.lastName}
								</Text>
								<Text size="sm" c="dimmed">
									{member.role}
								</Text>
							</Stack>
						</Group>
					))}
				</Stack>
			</Card>
		</Stack>
	);
}
