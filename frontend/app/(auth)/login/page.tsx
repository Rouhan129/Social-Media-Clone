"use client";

import AuthForm from "@/app/components/AuthForm";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { signIn, loading, error } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("accessToken")) {
      router.push("/");
    }
  }, [router]);

  const handleLogin = async (data: any) => {
    await signIn(data.email, data.password);
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        <AuthForm type="login" onSubmit={handleLogin} loading={loading} error={error} />
        <p className="mt-4 text-center text-sm">
          Don’t have an account?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}