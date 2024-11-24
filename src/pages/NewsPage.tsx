// src/pages/NewsPage.tsx
import { useState, useEffect, useRef } from "react";
import {
	Container,
	Grid,
	Card,
	Image,
	Text,
	Title,
	Alert,
	Center,
	Loader,
	Box,
	Anchor,
	Flex,
	Group,
} from "@mantine/core";
import { IconTrophy } from "@tabler/icons-react";
import { useGetNewsQuery } from "../features/news/newsApi";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { NewsArticle } from "../features/news/types";

const PAGE_SIZE = 10;

const NewsPage = () => {
	const [page, setPage] = useState(1);
	const [allArticles, setAllArticles] = useState<NewsArticle[]>([]);
	const [hasMore, setHasMore] = useState(true);
	const observerTarget = useRef<HTMLDivElement>(null);

	const { data, error, isLoading } = useGetNewsQuery({
		page: page,
		max: PAGE_SIZE,
	});

	useEffect(() => {
		if (data) {
			if (page === 1 && data.articles.length === 0) {
				setHasMore(false);
				setAllArticles([]);
				return;
			}

			if (page === 1) {
				setAllArticles(data.articles);
			} else {
				setAllArticles((prev) => [...prev, ...data.articles]);
			}

			// Проверяем, есть ли еще статьи для загрузки
			const totalFetchedArticles =
				(page - 1) * PAGE_SIZE + data.articles.length;
			if (totalFetchedArticles >= data.totalArticles) {
				setHasMore(false);
			}
		}
	}, [data, page]);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (
					entries[0].isIntersecting &&
					hasMore &&
					!isLoading &&
					allArticles.length > 0
				) {
					setPage((prev) => prev + 1);
				}
			},
			{ threshold: 0.1 }
		);

		if (observerTarget.current) {
			observer.observe(observerTarget.current);
		}

		return () => {
			if (observerTarget.current) {
				observer.unobserve(observerTarget.current);
			}
		};
	}, [hasMore, isLoading, allArticles.length]);

	if (error) {
		return (
			<Container>
				<Alert title="Ошибка!" color="red" mt="md">
					Произошла ошибка при загрузке новостей. Пожалуйста, попробуйте позже.
				</Alert>
			</Container>
		);
	}

	return (
		<Box>
			<Box
				p="md"
				mb={10}
				style={{
					position: "sticky",
					top: 0,
					backgroundColor: "white",
					borderBottom: "1px solid #eee",
					zIndex: 1,
				}}
			>
				<Flex justify="space-between" align="center">
					<Group>
						<IconTrophy size={30} color="blue" />
						<Title>Спортивные новости</Title>
					</Group>
				</Flex>
			</Box>
			<Container>
				<Grid>
					{allArticles.map((article, index) => (
						<Grid.Col key={index} span={{ base: 12, sm: 12, md: 6 }}>
							<Card shadow="sm" padding="lg" radius="md" withBorder>
								<Card.Section>
									<Image
										src={article.image || "/placeholder-image.jpg"}
										height={160}
										alt={article.title}
									/>
								</Card.Section>
								<Box mt="md">
									<Text size="xs" color="dimmed">
										{article.source.name}
									</Text>
									<Title order={4} mt="xs">
										{article.title}
									</Title>
									<Text size="sm" color="dimmed" lineClamp={2} mt="xs">
										{article.description}
									</Text>
									<Text size="xs" color="dimmed" mt="xs">
										{format(new Date(article.publishedAt), "PPp", {
											locale: ru,
										})}
									</Text>
									<Anchor
										href={article.url}
										target="_blank"
										rel="noopener noreferrer"
										color="blue"
										mt="md"
										style={{ textDecoration: "none" }}
									>
										Читать подробнее
									</Anchor>
								</Box>
							</Card>
						</Grid.Col>
					))}
				</Grid>

				{hasMore && <div ref={observerTarget} style={{ height: "20px" }} />}

				{isLoading && (
					<Center p="xl">
						<Loader size="md" />
					</Center>
				)}

				{!isLoading && !hasMore && allArticles.length > 0 && (
					<Text ta="center" color="dimmed" mt="md">
						Больше новостей нет
					</Text>
				)}

				{!isLoading && allArticles.length === 0 && (
					<Text ta="center" color="dimmed" size="lg" mt="md">
						Новости не найдены
					</Text>
				)}
			</Container>
		</Box>
	);
};

export default NewsPage;
