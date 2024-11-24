import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
	Topic,
	Comment,
	PaginatedResponse,
	CreateTopicRequest,
	UpdateCommentRequest,
	TopicsQueryParams,
} from "./types";

const BASE_URL = "http://213.171.12.10:8080/api";

const baseQuery = fetchBaseQuery({
	baseUrl: BASE_URL,
	prepareHeaders: (headers) => {
		headers.set("Content-Type", "application/json");
		headers.set("Accept", "application/json");

		const token = localStorage.getItem("token");
		if (token) {
			headers.set("Authorization", `Bearer ${token}`);
		}

		return headers;
	},
});

export const forumApi = createApi({
	reducerPath: "forumApi",
	baseQuery,
	tagTypes: ["Topics", "Comments"],
	endpoints: (builder) => ({
		getTopics: builder.query<PaginatedResponse<Topic>, TopicsQueryParams>({
			query: ({ page = 0, size = 10, sort }) => {
				const params = new URLSearchParams();
				params.append("page", String(page));
				params.append("size", String(size));
				if (sort) {
					sort.forEach((s) => params.append("sort", s));
				}
				return {
					url: "/topics",
					params,
				};
			},
			providesTags: (result) =>
				result
					? [
							...result.content.map(({ id }) => ({
								type: "Topics" as const,
								id,
							})),
							{ type: "Topics", id: "LIST" },
					  ]
					: [{ type: "Topics", id: "LIST" }],
		}),

		getTopicsByEventId: builder.query<
			PaginatedResponse<Topic>,
			{ eventId: number; page?: number; size?: number; sort?: string[] }
		>({
			query: ({ eventId, page = 0, size = 10, sort }) => {
				const params = new URLSearchParams();
				params.append("page", String(page));
				params.append("size", String(size));
				if (sort) {
					sort.forEach((s) => params.append("sort", s));
				}
				return {
					url: `/topics/sport-event/${eventId}`,
					params,
				};
			},
			providesTags: (result) =>
				result
					? [
							...result.content.map(({ id }) => ({
								type: "Topics" as const,
								id,
							})),
							{ type: "Topics", id: "LIST" },
					  ]
					: [{ type: "Topics", id: "LIST" }],
		}),

		getTopicById: builder.query<Topic, number>({
			query: (id) => `/topics/${id}`,
			providesTags: (_, __, id) => [{ type: "Topics", id }],
		}),

		createTopic: builder.mutation<Topic, CreateTopicRequest>({
			query: (data) => ({
				url: "/topics",
				method: "POST",
				body: {
					title: data.title,
					content: data.content,
					...(data.sportEventId !== undefined && {
						sportEventId: data.sportEventId,
					}),
				},
			}),
			invalidatesTags: [{ type: "Topics", id: "LIST" }],
		}),

		getTopicComments: builder.query<
			PaginatedResponse<Comment>,
			{ topicId: number; page?: number; size?: number }
		>({
			query: ({ topicId, page = 0, size = 50 }) => ({
				url: `/topics/${topicId}/comments`,
				params: {
					page,
					size,
				},
			}),
			providesTags: (result, _, { topicId }) =>
				result
					? [
							...result.content.map(({ id }) => ({
								type: "Comments" as const,
								id,
								topicId,
							})),
							{ type: "Comments", id: "LIST", topicId },
					  ]
					: [{ type: "Comments", id: "LIST", topicId }],
		}),

		createComment: builder.mutation<
			Comment,
			{ topicId: number; content: string }
		>({
			query: ({ topicId, content }) => {
				console.log("RTK Query creating comment:", { topicId, content });
				return {
					url: `/topics/${topicId}/comments`,
					method: "POST",
					body: {
						topicId,
						content,
					},
				};
			},
			invalidatesTags: (_, __, { topicId }) => [
				{ type: "Comments", id: "LIST", topicId },
			],
		}),

		updateComment: builder.mutation<
			Comment,
			{ topicId: number; commentId: number; data: UpdateCommentRequest }
		>({
			query: ({ topicId, commentId, data }) => ({
				url: `/topics/${topicId}/comments/${commentId}`,
				method: "PUT",
				body: {
					topicId,
					content: data.content,
				},
			}),
			invalidatesTags: (_, __, { topicId, commentId }) => [
				{ type: "Comments", id: commentId, topicId },
				{ type: "Comments", id: "LIST", topicId },
			],
		}),

		deleteComment: builder.mutation<
			void,
			{ topicId: number; commentId: number }
		>({
			query: ({ topicId, commentId }) => ({
				url: `/topics/${topicId}/comments/${commentId}`,
				method: "DELETE",
			}),
			invalidatesTags: (_, __, { topicId }) => [
				{ type: "Comments", id: "LIST", topicId },
				{ type: "Topics", id: topicId },
			],
		}),
	}),
});

export const {
	useGetTopicsQuery,
	useGetTopicsByEventIdQuery,
	useGetTopicByIdQuery,
	useCreateTopicMutation,
	useGetTopicCommentsQuery,
	useCreateCommentMutation,
	useUpdateCommentMutation,
	useDeleteCommentMutation,
} = forumApi;
