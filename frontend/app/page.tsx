"use client"

// import { redirect } from "next/navigation";
import PostForm from "./components/postForm";
import { useRouter } from "next/navigation";
import Button from "./components/Button";
import { useState } from "react";
import PublicPosts from "./components/publicPosts";

export default function Home() {

  // const token  = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null
  // if (!token) redirect('/login')
  const [modal, setModal] = useState<boolean>(false)

  const router = useRouter()
  return (
    <main className="flex flex-col items-center gap-3 mt-5">
      <div className="w-[8%] absolute top-4 left-4 z-10">
        <Button onClick={() => {router.push('/user')}}>See My Posts</Button>
      </div>
      <div className="w-[8%] absolute top-15 left-4 z-10">
        <Button onClick={() => {setModal(true)}}>Upload</Button>
      </div>
      <h1>Welcome</h1>
      <p>You are logged in!</p>
      {modal && (
        <div onClick={() => setModal(false)} className="fixed inset-0 flex justify-center items-center z-20">
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <PostForm />
          </div>
        </div>
      )}
      
      <div className="w-[5%] absolute top-4 right-4">
        <Button onClick={() => {localStorage.clear(); window.location.href = '/login'}} className="bg-gray-600 text-white rounded-sm p-4 hover:bg-gray-400 cursor-pointer">Logout</Button>
      </div>
      <PublicPosts />
    </main>
  );
}
