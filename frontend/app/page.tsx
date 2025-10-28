"use client"

// import { redirect } from "next/navigation";

export default function Home() {

  // const token  = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null
  // if (!token) redirect('/login')
  return (
    <main className="flex flex-col items-center gap-3 mt-5">
      <h1>Welcome</h1>
      <p>You are logged in!</p>
      <button onClick={() => {localStorage.clear(); window.location.href = '/login'}} className="bg-gray-600 text-white rounded-sm p-4 hover:bg-gray-400 cursor-pointer">Logout</button>
    </main>
  );
}
