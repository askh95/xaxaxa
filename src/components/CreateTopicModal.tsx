import {
	Modal,
	TextInput,
	Textarea,
	Button,
	Stack,
	Select,
	Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useCreateTopicMutation } from "../features/forum/forumApi";
import { useGetSportCategoriesQuery } from "../features/events/eventsApi";

interface CreateTopicModalProps {
	opened: boolean;
	onClose: () => void;
	eventId?: number;
}

interface FormValues {
	title: string;
	content: string;
	categoryId: string;
}

export function CreateTopicModal({
	opened,
	onClose,
	eventId,
}: CreateTopicModalProps) {
	const [createTopic, { isLoading }] = useCreateTopicMutation();

	const { data: categoriesData } = useGetSportCategoriesQuery({
		page: 0,
		size: 100,
	});

	const form = useForm<FormValues>({
		initialValues: {
			title: "",
			content: "",
			categoryId: "",
		},
		validate: {
			title: (value) => (!value ? "Необходимо указать заголовок" : null),
			content: (value) => (!value ? "Необходимо добавить содержание" : null),
			categoryId: (value) => (!value ? "Необходимо выбрать категорию" : null),
		},
	});

	const handleSubmit = async (values: FormValues) => {
		try {
			const createTopicData = {
				title: values.title,
				content: values.content,
				sportEventId: eventId || Number(values.categoryId),
			};

			await createTopic(createTopicData).unwrap();

			notifications.show({
				title: "Успешно",
				message: "Тема успешно создана",
				color: "green",
			});

			form.reset();
			onClose();
		} catch (error) {
			notifications.show({
				title: "Ошибка",
				message: "Не удалось создать тему",
				color: "red",
			});
		}
	};

	return (
		<Modal
			opened={opened}
			onClose={onClose}
			title="Создание новой темы"
			size="lg"
		>
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Stack>
					<div>
						<TextInput
							label="Заголовок"
							placeholder="Write title in English / Напишите заголовок на русском"
							required
							{...form.getInputProps("title")}
						/>
						<Text size="sm" color="dimmed" mt={4}>
							Напишите заголовок на двух языках, сначала на английском, затем на
							русском
						</Text>
					</div>

					{!eventId && (
						<Select
							label="Категория"
							placeholder="Выберите категорию"
							required
							data={
								categoriesData?.content.map((category) => ({
									value: String(category.id),
									label: category.name,
								})) || []
							}
							{...form.getInputProps("categoryId")}
						/>
					)}

					<div>
						<Textarea
							label="Содержание"
							placeholder="Write content in English / Напишите содержание на русском"
							required
							minRows={4}
							{...form.getInputProps("content")}
						/>
						<Text size="sm" color="dimmed" mt={4}>
							Напишите содержание на двух языках, сначала на английском, затем
							на русском
						</Text>
					</div>

					<Button type="submit" loading={isLoading} fullWidth>
						Создать тему
					</Button>
				</Stack>
			</form>
		</Modal>
	);
}
