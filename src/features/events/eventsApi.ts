// src/features/events/eventsApi.ts

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Event, EventFilters, PaginatedResponse } from "./types";

const BASE_URL = "http://213.171.12.10:8080/api";

const removeEmptyValues = (obj: Record<string, any>) => {
	return Object.fromEntries(
		Object.entries(obj).filter(([_, value]) => {
			if (value === "") return false;
			if (value === null) return false;
			if (value === undefined) return false;
			return true;
		})
	);
};

export const eventsApi = createApi({
	reducerPath: "eventsApi",
	baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
	tagTypes: ["Events"],
	endpoints: (builder) => ({
		getEvents: builder.query<
			PaginatedResponse<Event>,
			{ filters?: EventFilters; page: number; size: number }
		>({
			query: ({ filters = {}, page, size }) => {
				const params = removeEmptyValues({
					...filters,
					page,
					size,
				});

				return {
					url: "/sport-events",
					method: "GET",
					params,
				};
			},
			transformResponse: (response: PaginatedResponse<Event>) => {
				return {
					...response,
					content: response.content.map((event) => ({
						...event,
						dateStart: new Date(event.dateStart).toISOString(),
						dateEnd: new Date(event.dateEnd).toISOString(),
					})),
				};
			},
		}),
	}),
});

export const { useGetEventsQuery } = eventsApi;
