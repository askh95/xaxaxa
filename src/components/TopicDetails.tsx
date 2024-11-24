// TopicDetails.tsx
import {
	Paper,
	Title,
	Text,
	Stack,
	Group,
	Button,
	Textarea,
	Card,
	ActionIcon,
	Center,
	Loader,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { formatDistance } from "date-fns";
import { ru } from "date-fns/locale";
import {
	IconEdit,
	IconTrash,
	IconCheck,
	IconX,
	IconArrowLeft,
} from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	useGetTopicByIdQuery,
	useGetTopicCommentsQuery,
	useCreateCommentMutation,
	useDeleteCommentMutation,
	useUpdateCommentMutation,
} from "../features/forum/forumApi";
import { Comment } from "../features/forum/types";

interface TopicDetailsProps {
	topicId: number;
}

interface CommentFormValues {
	content: string;
}

export function TopicDetails({ topicId }: TopicDetailsProps) {
	const navigate = useNavigate();
	const [editingCommentId, setEditingCommentId] = useState<number | null>(null);

	const { data: topic, isLoading: isTopicLoading } =
		useGetTopicByIdQuery(topicId);
	const { data: commentsData, isLoading: areCommentsLoading } =
		useGetTopicCommentsQuery({
			topicId,
			page: 0,
			size: 50,
		});

	const [createComment] = useCreateCommentMutation();
	const [updateComment] = useUpdateCommentMutation();
	const [deleteComment] = useDeleteCommentMutation();

	const newCommentForm = useForm<CommentFormValues>({
		initialValues: {
			content: "",
		},
		validate: {
			content: (value) => (!value ? "Необходимо написать комментарий" : null),
		},
	});

	const editCommentForm = useForm<CommentFormValues>({
		initialValues: {
			content: "",
		},
		validate: {
			content: (value) => (!value ? "Необходимо написать комментарий" : null),
		},
	});

	if (!topicId || isNaN(topicId)) {
		return <Text>Некорректный ID темы</Text>;
	}

	const handleSubmitComment = async (values: CommentFormValues) => {
		try {
			await createComment({
				topicId,
				content: values.content,
			}).unwrap();

			newCommentForm.reset();
			notifications.show({
				title: "Успешно",
				message: "Комментарий успешно добавлен",
				color: "green",
			});
		} catch (error) {
			notifications.show({
				title: "Ошибка",
				message: "Не удалось добавить комментарий",
				color: "red",
			});
		}
	};

	const handleStartEditing = (comment: Comment) => {
		setEditingCommentId(comment.id);
		editCommentForm.setValues({ content: comment.content });
	};

	const handleCancelEditing = () => {
		setEditingCommentId(null);
		editCommentForm.reset();
	};

	const handleSubmitEdit = async (commentId: number) => {
		if (!editCommentForm.validate().hasErrors) {
			try {
				await updateComment({
					topicId,
					commentId,
					data: { content: editCommentForm.values.content },
				}).unwrap();

				setEditingCommentId(null);
				editCommentForm.reset();
				notifications.show({
					title: "Успешно",
					message: "Комментарий успешно обновлен",
					color: "green",
				});
			} catch (error) {
				notifications.show({
					title: "Ошибка",
					message: "Не удалось обновить комментарий",
					color: "red",
				});
			}
		}
	};

	const handleDeleteComment = async (commentId: number) => {
		try {
			await deleteComment({ topicId, commentId }).unwrap();
			notifications.show({
				title: "Успешно",
				message: "Комментарий успешно удален",
				color: "green",
			});
		} catch (error) {
			notifications.show({
				title: "Ошибка",
				message: "Не удалось удалить комментарий",
				color: "red",
			});
		}
	};

	if (isTopicLoading) {
		return (
			<Center p="xl">
				<Loader size="md" />
			</Center>
		);
	}

	if (!topic) {
		return <Text>Тема не найдена</Text>;
	}

	return (
		<Stack gap="lg">
			<Group mb="md">
				<Button
					variant="subtle"
					leftSection={<IconArrowLeft size={16} />}
					onClick={() => navigate(-1)}
				>
					Назад
				</Button>
			</Group>

			<Paper p="md" withBorder>
				<Title order={2}>{topic.title}</Title>
				<Group mt="xs">
					<Text size="sm" c="dimmed">
						Автор: {topic.userDto.firstName} {topic.userDto.lastName}
					</Text>
					<Text size="sm" c="dimmed">
						{formatDistance(new Date(topic.createdAt), new Date(), {
							addSuffix: true,
							locale: ru,
						})}
					</Text>
				</Group>
				<Text mt="md">{topic.content}</Text>
			</Paper>

			<Paper p="md" withBorder>
				<form onSubmit={newCommentForm.onSubmit(handleSubmitComment)}>
					<Textarea
						placeholder="Напишите комментарий..."
						minRows={3}
						mb="sm"
						{...newCommentForm.getInputProps("content")}
					/>
					<Button type="submit">Отправить</Button>
				</form>
			</Paper>

			<Stack gap="md">
				{areCommentsLoading ? (
					<Text>Загрузка комментариев...</Text>
				) : (
					commentsData?.content.map((comment: Comment) => (
						<Card key={comment.id} withBorder>
							<Group justify="space-between" mb="xs">
								<Group>
									<Text size="sm" fw={500}>
										{comment.userDto.firstName} {comment.userDto.lastName}
									</Text>
									<Text size="sm" c="dimmed">
										{formatDistance(new Date(comment.createdAt), new Date(), {
											addSuffix: true,
											locale: ru,
										})}
									</Text>
								</Group>
								<Group gap="xs">
									{editingCommentId === comment.id ? (
										<>
											<ActionIcon
												variant="filled"
												color="green"
												size="sm"
												onClick={() => handleSubmitEdit(comment.id)}
											>
												<IconCheck size={16} />
											</ActionIcon>
											<ActionIcon
												variant="filled"
												color="gray"
												size="sm"
												onClick={handleCancelEditing}
											>
												<IconX size={16} />
											</ActionIcon>
										</>
									) : (
										<>
											<ActionIcon
												variant="subtle"
												color="blue"
												size="sm"
												onClick={() => handleStartEditing(comment)}
											>
												<IconEdit size={16} />
											</ActionIcon>
											<ActionIcon
												variant="subtle"
												color="red"
												size="sm"
												onClick={() => handleDeleteComment(comment.id)}
											>
												<IconTrash size={16} />
											</ActionIcon>
										</>
									)}
								</Group>
							</Group>
							{editingCommentId === comment.id ? (
								<Textarea
									{...editCommentForm.getInputProps("content")}
									minRows={2}
									autosize
								/>
							) : (
								<Text mt="xs">{comment.content}</Text>
							)}
						</Card>
					))
				)}
			</Stack>
		</Stack>
	);
}
