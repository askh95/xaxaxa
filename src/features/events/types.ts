// src/features/events/types.ts

export interface Category {
	id: number;
	name: string;
}

export interface Event {
	id: number;
	eventId: string;
	name: string;
	dateStart: string;
	dateEnd: string;
	location: string;
	participants: number;
	description: string;
	category: Category;
	sportType: string;
	discipline: string;
	program: string;
	venue: string;
	gender: string;
	ageGroup: string;
	competitionType: string;
}

export interface EventFilters {
	timeFrame?: string;
	discipline?: string;
	minParticipants?: number;
	maxParticipants?: number;
	gender?: string;
	ageGroup?: string;
	startDate?: string;
	endDate?: string;
	location?: string;
	category?: string;
}

export interface Sort {
	empty: boolean;
	sorted: boolean;
	unsorted: boolean;
}

export interface Pageable {
	offset: number;
	pageNumber: number;
	pageSize: number;
	paged: boolean;
	unpaged: boolean;
	sort: Sort;
}

export interface PaginatedResponse<T> {
	content: T[];
	totalPages: number;
	totalElements: number;
	last: boolean;
	first: boolean;
	empty: boolean;
	number: number;
	size: number;
	numberOfElements: number;
	pageable: Pageable;
	sort: Sort;
}

export interface AuthModalProps {
	opened: boolean;
	close: () => void;
}

export interface LoginFormValues {
	email: string;
	password: string;
}

export interface RegisterFormValues extends LoginFormValues {
	confirmPassword: string;
	name: string;
}
export interface Category {
	id: number;
	name: string;
}
