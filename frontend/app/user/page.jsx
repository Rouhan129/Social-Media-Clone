"use client";

import { useEffect, useState } from "react";
import { getPosts, toggleLike } from "@/lib/post";
import { useRouter, useParams } from "next/navigation";

export default function UserPage() {
  const params = useParams();
  const id = params.id;

  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userPosts = await getPosts();
        setPosts(userPosts);
      } catch (err) {
        setError("Failed to load user data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  const handleLike = async (postId) => {
    try {
      await toggleLike(postId);
      const posts = await getPosts();
      setPosts(posts);
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  if (error)
    return (
      <div className="text-red-600 font-bold text-center mt-10">{error}</div>
    );
  if (loading)
    return (
      <div className="text-gray-500 text-center mt-10">Loading posts...</div>
    );

  return (
    <div className="flex flex-col items-center mt-10 px-4 gap-8">
      {posts.length === 0 ? (
        <p className="text-gray-500 mt-10">No posts yet</p>
      ) : (
        posts.map((post) => (
          <div
            key={post._id}
            className="w-full sm:w-[500px] md:w-[550px] lg:w-[600px] bg-white border border-gray-200 shadow-md rounded-2xl p-6 transition hover:shadow-xl"
          >
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  {post.title}
                </h2>
                <p className="text-gray-600 mt-2">{post.desc}</p>
              </div>

              {post.image && (
                <img
                  src={`http://localhost:5000/${post.image}`}
                  alt={post.title}
                  className="w-full h-[500px] object-cover rounded-lg border border-gray-100"
                />
              )}

              <div className="flex justify-between items-center mt-3">
                <p className="text-sm text-gray-500">
                  Posted by{" "}
                  <span className="font-medium text-gray-700">
                    {post.user?.email}
                  </span>
                </p>

                <button
                  onClick={() => handleLike(post._id)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${post.isLikedByUser
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  {post.isLikedByUser ? "Liked" : "Like"}
                  <span className="ml-1 text-xs">
                    {post.likes > 0 ? `(${post.likes})` : "(0)"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
