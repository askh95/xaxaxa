// src/features/events/eventsApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Event, EventFilters, PaginatedResponse, Category } from "./types";

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
	tagTypes: ["Events", "Categories"],
	endpoints: (builder) => ({
		getSportCategories: builder.query<
			PaginatedResponse<Category>,
			{ page?: number; size?: number; search?: string }
		>({
			query: ({ page = 0, size = 30, search }) => {
				const params = removeEmptyValues({
					page,
					size,
					search,
				});

				return {
					url: "/sport-categories",
					method: "GET",
					params,
				};
			},
			providesTags: ["Categories"],
		}),

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
			keepUnusedDataFor: 0,
			providesTags: (result) =>
				result
					? [
							...result.content.map(({ id }) => ({
								type: "Events" as const,
								id,
							})),
							{ type: "Events", id: "LIST" },
					  ]
					: [{ type: "Events", id: "LIST" }],
		}),

		getEventById: builder.query<Event, number>({
			query: (id) => `/sport-events/${id}`,
			transformResponse: (response: Event) => ({
				...response,
				dateStart: new Date(response.dateStart).toISOString(),
				dateEnd: new Date(response.dateEnd).toISOString(),
			}),
			providesTags: (_, __, id) => [{ type: "Events", id }],
		}),
	}),
});

export const {
	useGetEventsQuery,
	useGetEventByIdQuery,
	useGetSportCategoriesQuery,
} = eventsApi;

export const useRefreshableGetEventsQuery = (args: {
	filters?: EventFilters;
	page: number;
	size: number;
}) => {
	const query = useGetEventsQuery(args);

	const refresh = () => {
		query.refetch();
	};

	return { ...query, refresh };
};
