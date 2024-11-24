// src/features/news/newsApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { NewsResponse } from "./types";

export const newsApi = createApi({
	reducerPath: "newsApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "https://gnews.io/api/v4",
	}),
	endpoints: (builder) => ({
		getNews: builder.query<NewsResponse, { page: number; max: number }>({
			query: ({ page, max }) => ({
				url: "/top-headlines",
				params: {
					country: "ru",
					category: "sports",
					page: page,
					max: max,
					apikey: "490270b33d3724d3bc5efadcc1db4096",
				},
			}),
		}),
	}),
});

export const { useGetNewsQuery } = newsApi;
