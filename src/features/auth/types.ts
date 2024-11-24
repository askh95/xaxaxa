// src/features/auth/types.ts
export interface AuthState {
	token: string | null;
	user: User | null;
	isAuthenticated: boolean;
}

export interface User {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface RegisterRequest {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
}

export interface AuthResponse {
	token: string;
	user: User;
}

export interface LogoutResponse {
	success: boolean;
	message?: string;
}

export interface ApiError {
	status: number;
	data: {
		message: string;
		errors?: Record<string, string[]>;
	};
}
