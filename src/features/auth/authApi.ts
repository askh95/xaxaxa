// src/features/auth/authApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
	AuthResponse,
	LoginRequest,
	LogoutResponse,
	RegisterRequest,
} from "./types";
import { RootState } from "../../app/store";
import { setCredentials } from "./authSlice";

const BASE_URL = "http://213.171.12.10:8080/api";

export const authApi = createApi({
	reducerPath: "authApi",
	baseQuery: fetchBaseQuery({
		baseUrl: BASE_URL,
		prepareHeaders: (headers, { getState }) => {
			const token = (getState() as RootState).auth.token;
			if (token) {
				headers.set("Authorization", `Bearer ${token}`);
			}
			headers.set("Content-Type", "application/json");
			return headers;
		},
	}),
	endpoints: (builder) => ({
		login: builder.mutation<AuthResponse, LoginRequest>({
			query: (credentials) => ({
				url: "/auth/login",
				method: "POST",
				body: credentials,
			}),
			async onQueryStarted(_, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					// Добавляем подробное логирование
					console.log("Raw server response:", data);
					console.log("JWT Token:", data.token);

					if (data.token) {
						// Декодируем JWT токен
						const token = data.token;
						try {
							// Разбиваем токен на части
							const [_, payload, __] = token.split(".");
							// Декодируем payload
							const decodedPayload = JSON.parse(atob(payload));
							console.log("Decoded JWT payload:", decodedPayload);

							// Создаем объект пользователя из данных токена
							const user = {
								id: decodedPayload.sub,
								firstName: decodedPayload.firstName || decodedPayload.name,
								lastName: decodedPayload.lastName,
								email: decodedPayload.email,
								// другие поля, которые могут быть в токене
							};

							// Отправляем в Redux и данные токена, и данные пользователя
							dispatch(setCredentials({ token, user }));
						} catch (e) {
							console.error("Error decoding JWT:", e);
						}
					} else {
						console.error("No token in response");
					}
				} catch (err) {
					console.error("Login error:", err);
				}
			},
		}),
		register: builder.mutation<AuthResponse, RegisterRequest>({
			query: (data) => ({
				url: "/auth/register",
				method: "POST",
				body: data,
				responseHandler: async (response) => {
					if (!response.ok) {
						const error = await response.json();
						console.error("Server response error:", error);
						return Promise.reject(error);
					}
					return response.json();
				},
			}),
		}),
		logout: builder.mutation<LogoutResponse, void>({
			query: () => ({
				url: "/auth/logout",
				method: "POST",
			}),
		}),
	}),
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation } =
	authApi;
