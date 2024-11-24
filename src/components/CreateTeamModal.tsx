// components/CreateTeamModal.tsx
import {
	Modal,
	TextInput,
	Textarea,
	Button,
	Group,
	Stack,
	LoadingOverlay,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useCreateTeamMutation } from "../features/teams/teamsApi";

interface CreateTeamModalProps {
	opened: boolean;
	onClose: () => void;
}

interface FormValues {
	name: string;
	description: string;
	sportEventId: string;
}

export function CreateTeamModal({ opened, onClose }: CreateTeamModalProps) {
	const [createTeam, { isLoading }] = useCreateTeamMutation();

	const form = useForm({
		initialValues: {
			name: "",
			description: "",
			sportEventId: "1", // Временно захардкодим ID мероприятия
		},
		validate: {
			name: (value) =>
				value.length < 2 ? "Название должно содержать минимум 2 символа" : null,
		},
	});

	const handleSubmit = async (values: FormValues) => {
		try {
			await createTeam({
				name: values.name,
				description: values.description,
				sportEventId: 1, // Временно захардкодим ID мероприятия
			}).unwrap();

			notifications.show({
				title: "Успешно",
				message: "Команда успешно создана",
				color: "green",
			});

			form.reset();
			onClose();
		} catch (error) {
			notifications.show({
				title: "Ошибка",
				message: "Не удалось создать команду",
				color: "red",
			});
		}
	};

	return (
		<Modal
			opened={opened}
			onClose={onClose}
			title="Создание новой команды"
			size="md"
		>
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<LoadingOverlay visible={isLoading} />
				<Stack gap="md">
					<TextInput
						required
						label="Название команды"
						placeholder="Введите название команды"
						{...form.getInputProps("name")}
					/>

					<Textarea
						label="Описание"
						placeholder="Введите описание команды"
						autosize
						minRows={3}
						maxRows={6}
						{...form.getInputProps("description")}
					/>

					<Group justify="flex-end" mt="md">
						<Button variant="light" onClick={onClose} disabled={isLoading}>
							Отмена
						</Button>
						<Button type="submit" loading={isLoading}>
							Создать команду
						</Button>
					</Group>
				</Stack>
			</form>
		</Modal>
	);
}
