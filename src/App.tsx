// src/App.tsx
import { MantineProvider, createTheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { AppShell } from "@mantine/core";
import HomePage from "./pages/HomePage";
import Navigation from "./components/Navigation";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import LangindPage from "./pages/LangindPage";
import NewsPage from "./pages/NewsPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import PrivateRoute from "./components/PrivateRoute";
import { ForumPage } from "./pages/ForumPage";

const theme = createTheme({
	primaryColor: "blue",
	fontFamily: "Roboto, sans-serif",
	headings: { fontFamily: "Roboto, sans-serif" },
});

function App() {
	return (
		<Provider store={store}>
			<MantineProvider theme={theme}>
				<BrowserRouter>
					<AppShell header={{ height: 80 }} padding="0">
						<AppShell.Header>
							<Navigation />
						</AppShell.Header>

						<AppShell.Main>
							<Notifications />
							<Routes>
								<Route path="/" element={<LangindPage />} />
								<Route path="/events" element={<HomePage />} />
								<Route path="/news" element={<NewsPage />} />
								<Route path="/events/:id" element={<EventDetailsPage />} />

								{/* Forum routes */}
								{/* Forum routes */}
								<Route
									path="/forum"
									element={
										<PrivateRoute>
											<ForumPage />
										</PrivateRoute>
									}
								/>
								<Route
									path="/forum/event/:eventId"
									element={
										<PrivateRoute>
											<ForumPage />
										</PrivateRoute>
									}
								/>
								<Route
									path="/forum/event/:eventId/topic/:topicId"
									element={
										<PrivateRoute>
											<ForumPage />
										</PrivateRoute>
									}
								/>
								<Route
									path="/forum/topic/:topicId"
									element={
										<PrivateRoute>
											<ForumPage />
										</PrivateRoute>
									}
								/>
							</Routes>
						</AppShell.Main>
					</AppShell>
				</BrowserRouter>
			</MantineProvider>
		</Provider>
	);
}

export default App;
