"use client";

import { useEffect, useState } from "react";
import {  getPosts } from "@/lib/post";
import Button from "../components/Button";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";


export default function UserPage() {
  const params = useParams()
  const id = params.id;
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  const router = useRouter();

  useEffect(() => {

    const fetchUserData = async () => {
      try {
        const userPosts = await getPosts();
        setPosts(userPosts);
      } catch (err) {
        setError("Failed to load user data");
        console.error(err);
      }
    };

    fetchUserData();
  }, [id]);

  if (error) return <div className="text-red-600 font-bold">{error}</div>;

  return (
    <div className="flex flex-col items-center mt-5 gap-2">
      <span className="text-black font-semibold">User&apos;s Posts</span>

      {posts.map((post, index) => (
        <div key={index} className="bg-gray-300 p-2 rounded-md">
          <div><strong>Title:</strong> {post.title}</div>
          <div><strong>Description:</strong> {post.desc}</div>
          <img
            src={`http://localhost:5000/${post.image}`}
            alt={post.title}
            width={300}
            height={500}
            className="mt-2 rounded"
          />
        </div>
      ))}

      <div className="absolute top-4 left-4">
        <Button onClick={() => router.push("/")}>Home</Button>
      </div>
    </div>
  );
}
