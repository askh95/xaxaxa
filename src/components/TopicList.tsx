import { Card, Text, Group, Stack, Pagination, Skeleton } from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import { Topic } from "../features/forum/types";
import { formatDistance } from "date-fns";
import { ru } from "date-fns/locale";

interface TopicListProps {
	topics: Topic[];
	isLoading: boolean;
	totalPages: number;
	currentPage: number;
	onPageChange: (page: number) => void;
}

export function TopicList({
	topics,
	isLoading,
	totalPages,
	currentPage,
	onPageChange,
}: TopicListProps) {
	const navigate = useNavigate();
	const { eventId } = useParams();

	const handleTopicClick = (topicId: number) => {
		if (eventId) {
			navigate(`/forum/event/${eventId}/topic/${topicId}`);
		} else {
			navigate(`/forum/topic/${topicId}`);
		}
	};

	if (isLoading) {
		return (
			<Stack gap="md">
				{[1, 2, 3].map((i) => (
					<Skeleton key={i} height={100} radius="md" />
				))}
			</Stack>
		);
	}

	return (
		<Stack gap="md">
			{topics.map((topic) => (
				<Card
					key={topic.id}
					shadow="sm"
					padding="md"
					radius="md"
					onClick={() => handleTopicClick(topic.id)}
					style={{ cursor: "pointer" }}
				>
					<Group justify="space-between" mb="xs">
						<Text size="lg" fw={500}>
							{topic.title}
						</Text>
						<Group>
							<Text size="sm" c="dimmed">
								{formatDistance(new Date(topic.createdAt), new Date(), {
									addSuffix: true,
									locale: ru,
								})}
							</Text>
							<Text size="sm" c="dimmed">
								{topic.commentsCount} комментариев
							</Text>
						</Group>
					</Group>

					<Text lineClamp={2} size="sm" c="dimmed">
						{topic.content}
					</Text>

					<Group mt="md">
						<Text size="sm">
							Автор: {topic.userDto.firstName} {topic.userDto.lastName}
						</Text>
					</Group>
				</Card>
			))}

			{totalPages > 1 && (
				<Pagination
					total={totalPages}
					value={currentPage + 1}
					onChange={(page) => onPageChange(page - 1)}
					mt="md"
				/>
			)}
		</Stack>
	);
}
