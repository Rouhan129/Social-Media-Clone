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

export const refreshToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    throw new Error("No refresh token found");
  }

  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: refreshToken }),
    });

    if (!res.ok) {
      throw new Error("Failed to refresh token");
    }

    const data = await res.json();

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    return data.accessToken;
  } catch (err) {
    console.error("Refresh token error:", err);

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";

    throw err;
  }
};
