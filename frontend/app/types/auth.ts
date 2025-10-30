export type Role = "user" | "admin";

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    userId: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    email: string;
    password: string;
    role: Role;
}

export interface User {
    id: string;
    email: string;
    role: Role;
}