// src/features/forum/types.ts

export interface User {
	id: number;
	email: string;
	firstName: string;
	lastName: string;
}

export interface Topic {
	id: number;
	title: string;
	content: string;
	createdAt: string;
	userDto: User;
	eventId: number;
	commentsCount: number;
}

export interface Comment {
	id: number;
	content: string;
	createdAt: string;
	userDto: User;
}

export interface CreateTopicRequest {
	title: string;
	content: string;
	sportEventId: number; // Сделали опциональным
}

export interface CreateCommentRequest {
	content: string;
	topicId: number;
}

export interface UpdateCommentRequest {
	content: string;
}

export interface Sort {
	direction: string;
	nullHandling: string;
	ascending: boolean;
	property: string;
	ignoreCase: boolean;
}

export interface Pageable {
	offset: number;
	sort: Sort[];
	paged: boolean;
	pageNumber: number;
	pageSize: number;
	unpaged: boolean;
}

export interface PaginatedResponse<T> {
	totalPages: number;
	totalElements: number;
	first: boolean;
	last: boolean;
	size: number;
	content: T[];
	number: number;
	sort: Sort[];
	numberOfElements: number;
	pageable: Pageable;
	empty: boolean;
}

export interface TopicsQueryParams {
	page?: number;
	size?: number;
	sort?: string[];
}
