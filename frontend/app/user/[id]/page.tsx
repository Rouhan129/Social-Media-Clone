"use client";

import { useEffect, useState } from "react";
import { getFollow, toggleFollow, getUserPosts } from "@/lib/post";
import { getUserInfo } from "@/lib/user";
import Button from "../../components/Button";
import { useParams, useRouter } from "next/navigation";
import FollowUnfollow from "./components/FollowUnfollow";

interface Post {
  title: string;
  desc: string;
  image: string;
}

interface userResponse {
    _id: string;
    email: string;
    role: string;
    postCount: number;
    followerCount: number;
    followingCount: number;
}

export default function UserPage() {
  const { id } = useParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [follow, setFollow] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<userResponse | {}>({})

  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    const fetchUserData = async () => {
      try {
        const followRes = await getFollow(id as string);
        setFollow(followRes.isFollowing);

        const userPosts = await getUserPosts(id as string);

        const userInfo = await getUserInfo(id as string)
        console.log("INFO", info)
        setInfo(userInfo)
        setPosts(userPosts);
      } catch (err) {
        setError("Failed to load user data");
        console.error(err);
      }
    };

    fetchUserData();
  }, [id, info]);

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
      <span className="text-black font-semibold">User&apos;s Posts</span>

      <div>User Email: {info.email}</div>
      <div>User Role: {info.role}</div>
      <div>Post Count: {info.postCount}</div>
      <div>Follower Count: {info.followerCount}</div>
      <div>Following Count: {info.followingCount}</div>


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
