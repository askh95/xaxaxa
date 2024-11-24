// src/features/auth/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, AuthResponse } from "./types";

const initialState: AuthState = {
	token: localStorage.getItem("token"),
	user: (() => {
		try {
			const userData = localStorage.getItem("user");
			if (!userData) return null;
			const parsedUser = JSON.parse(userData);
			// Проверяем, что у нас есть все необходимые поля
			if (!parsedUser) return null;
			return parsedUser;
		} catch (e) {
			console.error("Error parsing user data:", e);
			localStorage.removeItem("user"); // Очищаем невалидные данные
			return null;
		}
	})(),
	isAuthenticated: !!localStorage.getItem("token"),
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setCredentials: (state, action: PayloadAction<AuthResponse>) => {
			const { token, user } = action.payload;

			if (!user) {
				console.error("No user data in payload");
				return;
			}

			state.token = token;
			state.user = user;
			state.isAuthenticated = true;
			localStorage.setItem("token", token);
			localStorage.setItem("user", JSON.stringify(user));
		},
		logout: (state) => {
			state.token = null;
			state.user = null;
			state.isAuthenticated = false;
			localStorage.removeItem("token");
			localStorage.removeItem("user");
		},
	},
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
