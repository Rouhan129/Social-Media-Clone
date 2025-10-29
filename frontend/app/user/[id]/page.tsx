"use client";

import { useEffect, useState } from "react";
import { getFollow, toggleFollow, getUserPosts } from "@/lib/post";
import Button from "../../components/Button";
import { useParams, useRouter } from "next/navigation";
import FollowUnfollow from "./components/FollowUnfollow";

interface Post {
  title: string;
  desc: string;
  image: string;
}

export default function UserPage() {
  const { id } = useParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [follow, setFollow] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    const fetchUserData = async () => {
      try {
        const followRes = await getFollow(id as string);
        setFollow(followRes.isFollowing);

        const userPosts = await getUserPosts(id as string);
        setPosts(userPosts);
      } catch (err) {
        setError("Failed to load user data");
        console.error(err);
      }
    };

    fetchUserData();
  }, [id]);

  const handleFollowToggle = async () => {
    try {
      await toggleFollow(id as string);
      setFollow((prev) => !prev);
    } catch (err) {
      console.error("Failed to toggle follow:", err);
    }
  };

  if (error) return <div className="text-red-600 font-bold">{error}</div>;

  return (
    <div className="flex flex-col items-center mt-5 gap-2">
      <FollowUnfollow follow={follow} onToggle={handleFollowToggle} />
      <span className="text-black font-semibold">User's Posts</span>

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
