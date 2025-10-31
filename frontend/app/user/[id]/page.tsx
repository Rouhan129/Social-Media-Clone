"use client";

import { useEffect, useState } from "react";
import { getFollow, toggleFollow, getUserPosts } from "@/lib/post";
import { getUserInfo, updateUserEmail } from "@/lib/user";
import Button from "../../components/Button";
import { useParams, useRouter } from "next/navigation";
import FollowUnfollow from "./components/FollowUnfollow";

interface Post {
  title: string;
  desc: string;
  image: string;
}

interface UserResponse {
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
  const [info, setInfo] = useState<UserResponse | null>(null);
  const [editing, setEditing] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    const fetchUserData = async () => {
      try {
        const [followRes, userPosts, userInfo] = await Promise.all([
          getFollow(id as string),
          getUserPosts(id as string),
          getUserInfo(id as string),
        ]);

        setFollow(followRes.isFollowing);
        setInfo(userInfo);
        setPosts(userPosts);

        const loggedInUserId = localStorage.getItem("id");
        if (loggedInUserId === userInfo._id) {
          setIsOwnProfile(true);
        }
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

  const handleEmailSave = async () => {
    try {
      const updatedUser = await updateUserEmail(id as string, newEmail);
      setInfo((prev) => prev ? { ...prev, email: updatedUser.email } : prev);
      setEditing(false);
    } catch (err) {
      console.error("Failed to update email:", err);
      alert("Error updating email!");
    }
  };

  if (error) return <div className="text-red-600 font-bold mt-6">{error}</div>;
  if (!info) return <div className="text-gray-600 mt-10 text-lg">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 relative">

      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-8 mb-10 text-center border border-gray-100">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-3xl flex items-center justify-center font-semibold mb-4">
            {info.email[0].toUpperCase()}
          </div>

          {editing ? (
            <div className="flex gap-2 items-center mb-4">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new email"
              />
              <Button onClick={handleEmailSave}>Save</Button>
              <Button onClick={() => setEditing(false)}>Cancel</Button>
            </div>
          ) : (
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              {info.email}
            </h2>
          )}

          {isOwnProfile && !editing && (
            <Button
              onClick={() => {
                setEditing(true);
                setNewEmail(info.email);
              }}
              className="mt-2"
            >
              Edit Email
            </Button>
          )}

          <p className="text-gray-500 mb-4 capitalize">Role: {info.role}</p>

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-4">
            <div className="text-center">
              <p className="text-xl font-bold text-gray-800">{info.postCount}</p>
              <p className="text-sm text-gray-500">Posts</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-gray-800">{info.followerCount}</p>
              <p className="text-sm text-gray-500">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-gray-800">{info.followingCount}</p>
              <p className="text-sm text-gray-500">Following</p>
            </div>
          </div>

          {!isOwnProfile && (
            <FollowUnfollow follow={follow} onToggle={handleFollowToggle} />
          )}
        </div>
      </div>

      {/* Posts Section */}
      <div className="max-w-4xl mx-auto">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          User’s Posts
        </h3>

        {posts.length === 0 ? (
          <div className="text-gray-500 text-center">No posts yet.</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
              >
                <img
                  src={`http://localhost:5000/${post.image}`}
                  alt={post.title}
                  className="w-full h-48 object-cover rounded-t-xl"
                />
                <div className="p-4">
                  <h4 className="font-semibold text-gray-800 text-lg truncate">
                    {post.title}
                  </h4>
                  <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                    {post.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
