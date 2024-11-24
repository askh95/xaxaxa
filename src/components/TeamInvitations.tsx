// components/TeamInvitations.tsx
import {
	Card,
	Text,
	Stack,
	Button,
	Group,
	Loader,
	Center,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
	useGetTeamInvitationsQuery,
	useAcceptTeamInvitationMutation,
	useDeclineTeamInvitationMutation,
} from "../features/teams/teamsApi";

export function TeamInvitations() {
	const { data: invitations, isLoading } = useGetTeamInvitationsQuery();
	const [acceptInvitation] = useAcceptTeamInvitationMutation();
	const [declineInvitation] = useDeclineTeamInvitationMutation();

	const handleAcceptInvitation = async (invitationId: number) => {
		try {
			await acceptInvitation(invitationId).unwrap();
			notifications.show({
				title: "Успешно",
				message: "Вы успешно приняли приглашение в команду",
				color: "green",
			});
		} catch (error) {
			notifications.show({
				title: "Ошибка",
				message: "Не удалось принять приглашение",
				color: "red",
			});
		}
	};

	const handleDeclineInvitation = async (invitationId: number) => {
		try {
			await declineInvitation(invitationId).unwrap();
			notifications.show({
				title: "Успешно",
				message: "Вы отклонили приглашение в команду",
				color: "green",
			});
		} catch (error) {
			notifications.show({
				title: "Ошибка",
				message: "Не удалось отклонить приглашение",
				color: "red",
			});
		}
	};

	if (isLoading) {
		return (
			<Center h={200}>
				<Loader size="lg" />
			</Center>
		);
	}

	if (!invitations?.length) {
		return <Text c="dimmed">У вас нет активных приглашений</Text>;
	}

	return (
		<Stack gap="md">
			<Text size="xl" fw={500}>
				Приглашения в команды
			</Text>
			{invitations.map((invitation) => (
				<Card
					key={invitation.id}
					shadow="sm"
					padding="md"
					radius="md"
					withBorder
				>
					<Stack gap="sm">
						<Text fw={500}>{invitation.teamName}</Text>
						<Text size="sm">Пригласил: {invitation.inviterName}</Text>
						<Text size="sm" c="dimmed">
							{new Date(invitation.invitedAt).toLocaleDateString()}
						</Text>
						<Group>
							<Button
								variant="filled"
								color="green"
								onClick={() => handleAcceptInvitation(invitation.id)}
							>
								Принять
							</Button>
							<Button
								variant="light"
								color="red"
								onClick={() => handleDeclineInvitation(invitation.id)}
							>
								Отклонить
							</Button>
						</Group>
					</Stack>
				</Card>
			))}
		</Stack>
	);
}
