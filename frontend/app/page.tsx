"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PostForm from "./components/postForm";
import Button from "./components/Button";
import PublicPosts from "./components/publicPosts";
import { refreshToken } from "@/lib/auth";

export default function Home() {
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
  const checkAuth = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const refresh = localStorage.getItem("refreshToken");

    if (!accessToken && !refresh) {
      router.push("/login");
      return;
    }

    if (!accessToken && refresh) {
      const newAccess = await refreshToken();
      if (!newAccess) {
        router.push("/login");
        return;
      }
    }

    setLoading(false);
  };

  checkAuth();
}, [router]);


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading...
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center gap-3 mt-5">
      <div className="w-[8%] absolute top-4 left-4 z-10">
        <Button onClick={() => router.push("/user")}>See My Posts</Button>
      </div>

      <div className="w-[8%] absolute top-15 left-4 z-10">
        <Button onClick={() => setModal(true)}>Upload</Button>
      </div>

      <div className="w-[8%] absolute top-26 left-4 z-10">
        <Button onClick={() => router.push('/users')}>Users</Button>
      </div>

      <p>You are logged in!</p>

      {modal && (
        <div
          onClick={() => setModal(false)}
          className="fixed inset-0 flex justify-center items-center z-20"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg shadow-lg w-full max-w-md p-4"
          >
            <PostForm />
          </div>
        </div>
      )}

      <div className="w-[8%] absolute top-4 right-32">
        <Button onClick={() => router.push("/messages")}>Messages</Button>
      </div>

      <div className="w-[5%] absolute top-4 right-4">
        <Button
          onClick={() => {
            localStorage.clear();
            router.push("/login");
          }}
          className="bg-gray-600 text-white rounded-sm p-4 hover:bg-gray-400 cursor-pointer"
        >
          Logout
        </Button>
      </div>

      <PublicPosts />
    </main>
  );
}
