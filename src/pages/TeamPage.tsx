// pages/TeamPage.tsx
import { Container, Tabs, rem, Button, Group } from "@mantine/core";
import { IconUsers, IconBellRinging, IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { TeamList } from "../components/TeamList";
import { TeamInvitations } from "../components/TeamInvitations";
import { CreateTeamModal } from "../components/CreateTeamModal";

export default function TeamPage() {
	const [createModalOpened, setCreateModalOpened] = useState(false);

	return (
		<Container size="xl" py="xl">
			<Group justify="flex-end" mb="md">
				<Button
					onClick={() => setCreateModalOpened(true)}
					leftSection={<IconPlus size={20} />}
					variant="filled"
					color="blue"
				>
					Создать команду
				</Button>
			</Group>

			<Tabs defaultValue="teams">
				<Tabs.List>
					<Tabs.Tab
						value="teams"
						leftSection={
							<IconUsers style={{ width: rem(16), height: rem(16) }} />
						}
					>
						Команды
					</Tabs.Tab>
					<Tabs.Tab
						value="invitations"
						leftSection={
							<IconBellRinging style={{ width: rem(16), height: rem(16) }} />
						}
					>
						Приглашения
					</Tabs.Tab>
				</Tabs.List>

				<Tabs.Panel value="teams" pt="xl">
					<TeamList />
				</Tabs.Panel>

				<Tabs.Panel value="invitations" pt="xl">
					<TeamInvitations />
				</Tabs.Panel>
			</Tabs>

			<CreateTeamModal
				opened={createModalOpened}
				onClose={() => setCreateModalOpened(false)}
			/>
		</Container>
	);
}
