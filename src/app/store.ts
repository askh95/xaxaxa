// src/app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { eventsApi } from "../features/events/eventsApi";
import authReducer from "../features/auth/authSlice";
import { authApi } from "../features/auth/authApi";
import { newsApi } from "../features/news/newsApi";
import { forumApi } from "../features/forum/forumApi";

export const store = configureStore({
	reducer: {
		auth: authReducer,
		[eventsApi.reducerPath]: eventsApi.reducer,
		[authApi.reducerPath]: authApi.reducer,
		[newsApi.reducerPath]: newsApi.reducer,
		[forumApi.reducerPath]: forumApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(
			authApi.middleware,
			eventsApi.middleware,
			newsApi.middleware,
			forumApi.middleware
		),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
