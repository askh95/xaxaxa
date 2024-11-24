// src/pages/EventDetailsPage.tsx
import { useNavigate, useParams } from "react-router-dom";
import {
	Container,
	Title,
	Text,
	Group,
	Stack,
	Badge,
	LoadingOverlay,
	Paper,
	Grid,
	Button,
} from "@mantine/core";
import {
	IconCalendarEvent,
	IconMapPin,
	IconUsers,
	IconTrophy,
	IconGenderBigender,
	IconUserCircle,
	IconArrowLeft,
} from "@tabler/icons-react";
import { useGetEventByIdQuery } from "../features/events/eventsApi";

const EventDetailsPage = () => {
	const { id } = useParams();
	const { data: event, isLoading, error } = useGetEventByIdQuery(Number(id));

	const navigate = useNavigate();
	const handleGoBack = () => {
		navigate("/events");
	};

	if (isLoading) {
		return <LoadingOverlay visible={true} />;
	}

	if (error || !event) {
		return (
			<Container size="md" py="xl">
				<Text>Произошла ошибка при загрузке события</Text>
			</Container>
		);
	}

	return (
		<Container size="xl" py="xl">
			<Stack gap="lg">
				<Button
					variant="subtle"
					leftSection={<IconArrowLeft size={16} />}
					onClick={handleGoBack}
					size="md"
					style={{ alignSelf: "flex-start" }}
				>
					Вернуться к календарю
				</Button>
				{/* Заголовок и категория */}
				<Group justify="space-between" align="center">
					<Title order={1}>{event.name}</Title>
					<Badge size="xl" color="blue" variant="light">
						{event.category.name}
					</Badge>
				</Group>

				{/* Основная информация */}
				<Paper shadow="sm" p="md" radius="md">
					<Grid>
						<Grid.Col span={6}>
							<Stack gap="md">
								<Group gap="xs">
									<IconCalendarEvent size={24} color="blue" />
									<Text size="lg">
										{new Date(event.dateStart).toLocaleDateString()} -
										{new Date(event.dateEnd).toLocaleDateString()}
									</Text>
								</Group>

								<Group gap="xs">
									<IconMapPin size={24} color="red" />
									<Text size="lg">{event.location}</Text>
								</Group>

								<Group gap="xs">
									<IconUsers size={24} color="green" />
									<Text size="lg">{event.participants} участников</Text>
								</Group>
							</Stack>
						</Grid.Col>

						<Grid.Col span={6}>
							<Stack gap="md">
								<Group gap="xs">
									<IconTrophy size={24} color="orange" />
									<Text size="lg">
										Тип соревнования: {event.competitionType}
									</Text>
								</Group>

								<Group gap="xs">
									<IconGenderBigender size={24} color="violet" />
									<Text size="lg">Пол участников: {event.gender}</Text>
								</Group>

								<Group gap="xs">
									<IconUserCircle size={24} color="teal" />
									<Text size="lg">Возрастная группа: {event.ageGroup}</Text>
								</Group>
							</Stack>
						</Grid.Col>
					</Grid>
				</Paper>

				{/* Описание */}
				<Paper shadow="sm" p="md" radius="md">
					<Title order={3} mb="md">
						Описание
					</Title>
					<Text>{event.description}</Text>
				</Paper>

				{/* Дополнительная информация */}
				<Paper shadow="sm" p="md" radius="md">
					<Title order={3} mb="md">
						Дополнительная информация
					</Title>
					<Grid>
						<Grid.Col span={6}>
							<Stack gap="sm">
								<Text fw={500}>Вид спорта: </Text>
								<Text>{event.sportType}</Text>

								<Text fw={500}>Дисциплина:</Text>
								<Text>{event.discipline}</Text>
							</Stack>
						</Grid.Col>

						<Grid.Col span={6}>
							<Stack gap="sm">
								<Text fw={500}>Программа:</Text>
								<Text>{event.program}</Text>

								<Text fw={500}>Место проведения:</Text>
								<Text>{event.venue}</Text>
							</Stack>
						</Grid.Col>
					</Grid>
				</Paper>

				{/* Расписание или дополнительные блоки */}
				<Paper shadow="sm" p="md" radius="md">
					<Title order={3} mb="md">
						Расписание
					</Title>
					<Stack gap="md">
						<Group gap="apart">
							<Text>Начало регистрации:</Text>
							<Text>{new Date(event.dateStart).toLocaleString()}</Text>
						</Group>
						<Group gap="apart">
							<Text>Окончание мероприятия:</Text>
							<Text>{new Date(event.dateEnd).toLocaleString()}</Text>
						</Group>
					</Stack>
				</Paper>

				{/* Контакты организаторов */}
				<Paper shadow="sm" p="md" radius="md">
					<Title order={3} mb="md">
						Контакты организаторов
					</Title>
					<Stack gap="md">
						<Text>
							По всем вопросам обращайтесь к организаторам мероприятия:
						</Text>
						<Group>
							<Text fw={500}>Email:</Text>
							<Text>organizers@example.com</Text>
						</Group>
						<Group>
							<Text fw={500}>Телефон:</Text>
							<Text>+7 (XXX) XXX-XX-XX</Text>
						</Group>
					</Stack>
				</Paper>

				{/* Правила участия */}
				<Paper shadow="sm" p="md" radius="md">
					<Title order={3} mb="md">
						Правила участия
					</Title>
					<Stack gap="md">
						<Text>Для участия в мероприятии необходимо:</Text>
						<ul>
							<li>
								<Text>Зарегистрироваться на платформе</Text>
							</li>
							<li>
								<Text>Подать заявку на участие</Text>
							</li>
							<li>
								<Text>Предоставить необходимые документы</Text>
							</li>
							<li>
								<Text>Получить подтверждение от организаторов</Text>
							</li>
						</ul>
					</Stack>
				</Paper>
			</Stack>
		</Container>
	);
};

export default EventDetailsPage;
