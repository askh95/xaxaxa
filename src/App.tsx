import { MantineProvider, createTheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";
import HomePage from "./pages/HomePage";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";

const theme = createTheme({
	primaryColor: "blue",
	fontFamily: "Roboto, sans-serif",
	headings: { fontFamily: "Roboto, sans-serif" },
});

function App() {
	return (
		<Provider store={store}>
			<MantineProvider theme={theme}>
				<div
					style={{
						width: "100%",
						minHeight: "100vh",
						margin: 0,
						padding: 0,
						boxSizing: "border-box",
					}}
				>
					<Notifications />
					<BrowserRouter>
						<Routes>
							<Route path="/" element={<HomePage />} />
						</Routes>
					</BrowserRouter>
				</div>
			</MantineProvider>
		</Provider>
	);
}

export default App;
