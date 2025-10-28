// hooks/useAuth.ts
import { useState } from "react";
import { login, register } from "@/lib/auth";
import { AuthResponse } from "@/app/types/auth";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await login({ email, password });
      saveTokens(data);
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, role?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await register({ email, password, role: role as any });
      saveTokens(data);
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const saveTokens = ({ accessToken, refreshToken }: AuthResponse) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
  };

  return { signIn, signUp, logout, loading, error };
};