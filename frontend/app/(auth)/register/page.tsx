"use client";

import AuthForm from "@/app/components/AuthForm";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { signUp, loading, error } = useAuth();
  const router = useRouter();

  const handleRegister = async (data: any) => {
    await signUp(data.email, data.password, data.role);
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>
        <AuthForm type="register" onSubmit={handleRegister} loading={loading} error={error} />
        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}