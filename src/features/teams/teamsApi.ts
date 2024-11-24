import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
	Team,
	TeamInvitation,
	CreateTeamRequest,
	CreateTeamInvitationRequest,
	TeamListResponse,
	TeamMemberListResponse,
	TeamInvitationListResponse,
} from "./types";
import { RootState } from "../../app/store";

const BASE_URL = "http://213.171.12.10:8080/api";

export const teamsApi = createApi({
	reducerPath: "teamsApi",
	baseQuery: fetchBaseQuery({
		baseUrl: BASE_URL,
		prepareHeaders: (headers, { getState }) => {
			// Получаем токен из Redux store
			const token = (getState() as RootState).auth.token;

			if (token) {
				headers.set("Authorization", `Bearer ${token}`);
			}

			headers.set("Content-Type", "application/json");
			headers.set("Accept", "application/json");

			return headers;
		},
	}),
	tagTypes: ["Teams", "TeamMembers", "TeamInvitations"],
	endpoints: (builder) => ({
		createTeam: builder.mutation<Team, CreateTeamRequest>({
			query: (data) => ({
				url: "/teams",
				method: "POST",
				body: data,
			}),
			invalidatesTags: ["Teams"],
		}),

		getTeamInvitations: builder.query<TeamInvitationListResponse, void>({
			query: () => "/teams/invitations",
			providesTags: ["TeamInvitations"],
		}),

		createTeamInvitation: builder.mutation<
			TeamInvitation,
			CreateTeamInvitationRequest
		>({
			query: (data) => ({
				url: "/teams/invitations",
				method: "POST",
				body: data,
			}),
			invalidatesTags: ["TeamInvitations"],
		}),

		acceptTeamInvitation: builder.mutation<void, number>({
			query: (id) => ({
				url: `/teams/invitations/${id}/accept`,
				method: "POST",
			}),
			invalidatesTags: ["TeamInvitations", "Teams"],
		}),

		declineTeamInvitation: builder.mutation<void, number>({
			query: (id) => ({
				url: `/teams/invitations/${id}/decline`,
				method: "POST",
			}),
			invalidatesTags: ["TeamInvitations"],
		}),

		getTeamById: builder.query<Team, number>({
			query: (id) => `/teams/${id}`,
			providesTags: (_, __, id) => [{ type: "Teams", id }],
		}),

		getTeamMembers: builder.query<TeamMemberListResponse, number>({
			query: (teamId) => `/teams/${teamId}/members`,
			providesTags: (_, __, teamId) => [{ type: "TeamMembers", id: teamId }],
		}),

		getTeamsBySportEvent: builder.query<TeamListResponse, number>({
			query: (sportEventId) => `/teams/sport-event/${sportEventId}`,
			providesTags: ["Teams"],
		}),

		getMyTeams: builder.query<TeamListResponse, void>({
			query: () => "/teams/my",
			providesTags: ["Teams"],
		}),
	}),
});

export const {
	useCreateTeamMutation,
	useGetTeamInvitationsQuery,
	useCreateTeamInvitationMutation,
	useAcceptTeamInvitationMutation,
	useDeclineTeamInvitationMutation,
	useGetTeamByIdQuery,
	useGetTeamMembersQuery,
	useGetTeamsBySportEventQuery,
	useGetMyTeamsQuery,
} = teamsApi;
