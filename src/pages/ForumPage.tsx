import { useState } from "react";
import { Container, Title, Group, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useParams } from "react-router-dom";
import { TopicList } from "../components/TopicList";
import { CreateTopicModal } from "../components/CreateTopicModal";
import { TopicDetails } from "../components/TopicDetails";
import {
	useGetTopicsQuery,
	useGetTopicsByEventIdQuery,
} from "../features/forum/forumApi";

export function ForumPage() {
	const { eventId, topicId } = useParams();
	const [page, setPage] = useState(0);
	const [opened, { open, close }] = useDisclosure(false);

	const pageSize = 10;
	const numericTopicId = topicId ? Number(topicId) : undefined;

	const topicsQuery = eventId
		? useGetTopicsByEventIdQuery({
				eventId: Number(eventId),
				page,
				size: pageSize,
		  })
		: useGetTopicsQuery({
				page,
				size: pageSize,
		  });

	if (numericTopicId && !isNaN(numericTopicId)) {
		return (
			<Container size="lg" py="xl">
				<TopicDetails topicId={numericTopicId} />
			</Container>
		);
	}

	return (
		<Container size="lg" py="xl">
			<Group justify="space-between" mb="xl">
				<Title>Форум</Title>
				<Button onClick={open}>Создать тему</Button>
			</Group>

			<TopicList
				topics={topicsQuery.data?.content || []}
				isLoading={topicsQuery.isLoading}
				totalPages={topicsQuery.data?.totalPages || 0}
				currentPage={page}
				onPageChange={setPage}
			/>

			<CreateTopicModal
				opened={opened}
				onClose={close}
				eventId={eventId ? Number(eventId) : undefined}
			/>
		</Container>
	);
}
