import { AuthResponse, LoginCredentials, RegisterCredentials } from "@/app/types/auth";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const register = async (data: RegisterCredentials): Promise<AuthResponse> => {

    console.log("API_URL:", API_URL);
    const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    })

    if (!res.ok){
        const error = await res.json();
        throw new Error(error.message)
    }
    return res.json();
}

export const login = async(data: LoginCredentials): Promise<AuthResponse> => {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    })
    if (!res.ok){
        const error = await res.json()
        throw new Error(error.message)
    }
    return res.json()
}