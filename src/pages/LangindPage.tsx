import React from "react";
import {
	Box,
	Container,
	Typography,
	Grid,
	Card,
	CardContent,
	ListItem,
	ListItemIcon,
	ListItemText,
	Button,
	AppBar,
	Toolbar,
} from "@mui/material";
import {
	SportsSoccer,
	Speed,
	AccessTime,
	Security,
	Forum,
	Groups,
	Newspaper,
	People,
	LocationOn,
	Category,
	Timer,
	EmojiEvents,
} from "@mui/icons-material";

import home from "../assets/home.webp";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
	const navigate = useNavigate();

	const scrollToSection = (sectionId: any) => {
		const element = document.getElementById(sectionId);
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
		}
	};

	const features = [
		{
			icon: <Speed />,
			title: "Быстрая работа",
			description:
				"Молниеносная скорость работы системы благодаря оптимизированной архитектуре",
		},
		{
			icon: <AccessTime />,
			title: "Доступность 24/7",
			description: "Круглосуточный доступ к системе из любой точки мира",
		},
		{
			icon: <Security />,
			title: "Безопасность",
			description: "Надежная защита данных и конфиденциальность пользователей",
		},
		{
			icon: <Forum />,
			title: "Форум общения",
			description:
				"Удобная платформа для обсуждений и обмена опытом с другими пользователями",
		},
		{
			icon: <Groups />,
			title: "Команда",
			description:
				"Профессиональная команда специалистов, готовая помочь в любой момент",
		},
		{
			icon: <Newspaper />,
			title: "Новости",
			description:
				"Актуальные новости и обновления системы в режиме реального времени",
		},
	];

	const filterCategories = [
		{ icon: <SportsSoccer />, text: "Вид спорта" },
		{ icon: <Category />, text: "Дисциплина" },
		{ icon: <LocationOn />, text: "Место проведения" },
		{ icon: <People />, text: "Количество участников" },
		{ icon: <Timer />, text: "Сроки проведения" },
		{ icon: <EmojiEvents />, text: "Тип соревнования" },
	];

	return (
		<Box>
			<AppBar position="static" color="primary" elevation={0}>
				<Toolbar>
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
						Календарь спортивных мероприятий
					</Typography>
					<Box
						sx={{
							display: "none",
							"@media (min-width: 740px)": {
								display: "flex",
							},
						}}
					>
						<Button color="inherit" onClick={() => scrollToSection("about")}>
							О проекте
						</Button>
						<Button color="inherit" onClick={() => scrollToSection("features")}>
							Возможности
						</Button>
						<Button color="inherit" onClick={() => scrollToSection("contacts")}>
							Контакты
						</Button>
					</Box>
				</Toolbar>
			</AppBar>

			<Box
				id="about"
				sx={{
					bgcolor: "primary.main",
					color: "white",
					py: 8,
					mb: 6,
				}}
			>
				<Container maxWidth="lg">
					<Grid container spacing={4} alignItems="center">
						<Grid item xs={12} md={6}>
							<Typography variant="h2" component="h1" gutterBottom>
								Календарь мероприятий для спорта высших достижений
							</Typography>
							<Typography variant="h5" component="p" sx={{ mb: 4 }}>
								Единая платформа для отслеживания всех спортивных событий в
								России
							</Typography>
							<Button
								variant="contained"
								color="info"
								size="large"
								sx={{ mr: 2 }}
								onClick={() => navigate("/events")}
							>
								Начать использование
							</Button>
						</Grid>
						<Grid item xs={12} md={6}>
							<Box
								component="img"
								src={home}
								alt="Sport Calendar Preview"
								sx={{
									width: "100%",
									height: "auto",
									borderRadius: 2,
								}}
							/>
						</Grid>
					</Grid>
				</Container>
			</Box>

			<Container id="features" maxWidth="lg" sx={{ mb: 8 }}>
				<Typography variant="h3" component="h2" align="center" gutterBottom>
					Основные возможности
				</Typography>
				<Grid container spacing={4} sx={{ mt: 4 }}>
					{features.map((feature, index) => (
						<Grid item xs={12} md={4} key={index}>
							<Card sx={{ height: "100%" }}>
								<CardContent>
									<Box
										sx={{ display: "flex", justifyContent: "center", mb: 2 }}
									>
										{React.cloneElement(feature.icon, { fontSize: "large" })}
									</Box>
									<Typography
										variant="h5"
										component="h3"
										align="center"
										gutterBottom
									>
										{feature.title}
									</Typography>
									<Typography variant="body1" align="center">
										{feature.description}
									</Typography>
								</CardContent>
							</Card>
						</Grid>
					))}
				</Grid>
			</Container>

			<Box sx={{ bgcolor: "grey.100", py: 8 }}>
				<Container maxWidth="lg">
					<Typography variant="h3" component="h2" align="center" gutterBottom>
						Фильтрация по параметрам
					</Typography>
					<Grid container spacing={3} sx={{ mt: 4 }}>
						{filterCategories.map((category, index) => (
							<Grid item xs={12} sm={6} md={4} key={index}>
								<Card sx={{ height: "100%" }}>
									<CardContent>
										<ListItem>
											<ListItemIcon>{category.icon}</ListItemIcon>
											<ListItemText primary={category.text} />
										</ListItem>
									</CardContent>
								</Card>
							</Grid>
						))}
					</Grid>
				</Container>
			</Box>

			<Box id="contacts" sx={{ bgcolor: "grey.900", color: "white", py: 6 }}>
				<Container maxWidth="lg">
					<Grid container spacing={4}>
						<Grid item xs={12} md={4}>
							<Typography variant="h6" gutterBottom>
								О проекте
							</Typography>
							<Typography variant="body2">
								Единая платформа для отслеживания спортивных мероприятий высших
								достижений
							</Typography>
						</Grid>
						<Grid item xs={12} md={4}>
							<Typography variant="h6" gutterBottom>
								Контакты
							</Typography>
							<Typography variant="body2">
								Email: support@sportcalendar.ru
							</Typography>
						</Grid>
						<Grid item xs={12} md={4}>
							<Typography variant="h6" gutterBottom>
								Партнеры
							</Typography>
							<Typography variant="body2">Министерство спорта РФ</Typography>
						</Grid>
					</Grid>
				</Container>
			</Box>
		</Box>
	);
};

export default LandingPage;
