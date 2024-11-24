export interface SportEvent {
	id: string;
	name: string;
	location: string;
	dateStart: string;
	dateEnd: string;
	participants: number;
	description: string;
}

export interface User {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
}

export interface TeamMember {
	id: number;
	teamId: number;
	userId: number;
	role: string;
	user: User;
	joinedAt: string;
}

export interface Team {
	id: number;
	name: string;
	description: string;
	sportEvent: SportEvent;
	createdAt: string;
	updatedAt: string;
	members?: TeamMember[];
}

export interface TeamInvitation {
	id: number;
	teamId: number;
	inviterId: number;
	inviteeId: number;
	status: string;
	teamName: string;
	inviterName: string;
	inviteeName: string;
	invitedAt: string;
}

export interface CreateTeamRequest {
	name: string;
	description: string;
	sportEventId: number;
}

export interface CreateTeamInvitationRequest {
	teamId: number;
	inviteeId: number;
}

export type TeamListResponse = Team[];
export type TeamMemberListResponse = TeamMember[];
export type TeamInvitationListResponse = TeamInvitation[];
