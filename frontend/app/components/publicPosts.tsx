"use client";

import { useEffect, useState } from "react";
import { feedPosts, postComment, toggleLike, getLikesForPost } from "@/lib/post";
import Button from "../components/Button";

interface User {
  _id: string;
  email: string;
}

interface Comment {
  _id?: string;
  postId: string;
  userId: User;
  text: string;
  parentComment?: string | null;
}

interface Post {
  _id: string;
  title: string;
  desc: string;
  image: string;
  user: User;
  comments: Comment[];
  likes: number;
  isLikedByUser?: boolean;
}

export default function PublicPosts() {
  const [data, setData] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [commentData, setCommentData] = useState<{ [key: string]: string }>({});

  const handleComment = async (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    const text = commentData[postId];
    if (!text) return;

    try {
      await postComment({ postId, text, parentComment: null });
      const posts = await feedPosts();
      setData(posts);
      setCommentData((prev) => ({ ...prev, [postId]: "" }));
    } catch (err) {
      console.error("Failed to post comment", err);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await toggleLike(postId);
      const posts = await feedPosts();
      setData(posts);
    } catch (err) {
      console.error("Failed to toggle like", err);
    }
  };

  useEffect(() => {
    const fetchPostsWithLikes = async () => {
      try {
        const posts = await feedPosts();

        const postsWithLikes = await Promise.all(
          posts.map(async (post) => {
            const likeData = await getLikesForPost(post._id);
            return {
              ...post,
              likes: likeData.likes || 0,
              isLikedByUser: likeData.isLikedByUser || false,
            };
          })
        );

        setData(postsWithLikes);
      } catch (err) {
        console.error(err);
        setError("Failed to load posts with likes");
      }
    };

    fetchPostsWithLikes();
  }, []);

  if (error) return <div className="text-red-600 font-bold">ERROR!</div>;

  return (
    <div className="flex flex-col items-center mt-10 gap-8 px-4">
      <h1 className="text-2xl font-bold text-gray-800">Public Posts</h1>

      {data.map((post) => (
        <div
          key={post._id}
          className="w-full max-w-5xl bg-white shadow-md hover:shadow-lg transition-all duration-200 rounded-2xl border border-gray-200 overflow-hidden flex flex-col md:flex-row"
        >
          {/* LEFT SIDE — Post Content */}
          <div className="w-full md:w-1/2 p-5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{post.title}</h2>
              <p className="text-gray-600 mb-3">{post.desc}</p>

              {post.image && (
                <img
                  src={`http://localhost:5000/${post.image}`}
                  alt={post.title}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
              )}

              <p className="text-sm text-gray-500 mb-2">
                Posted by <span className="font-medium">{post.user?.email}</span>
              </p>

              <button
                onClick={() => handleLike(post._id)}
                className={`px-4 py-1 rounded-full text-sm font-medium transition ${
                  post.isLikedByUser
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {post.isLikedByUser ? "♥ Liked" : "♡ Like"} ({post.likes})
              </button>
            </div>

            <form
              onSubmit={(e) => handleComment(e, post._id)}
              className="mt-4 space-y-2"
            >
              <textarea
                placeholder="Write a comment..."
                rows={2}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={commentData[post._id] || ""}
                onChange={(e) =>
                  setCommentData((prev) => ({
                    ...prev,
                    [post._id]: e.target.value,
                  }))
                }
              />
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Post Comment
              </Button>
            </form>
          </div>

          <div className="w-full md:w-1/2 bg-gray-50 p-5 overflow-y-auto max-h-[500px]">
            <h3 className="font-semibold text-gray-800 mb-3">Comments</h3>

            {post.comments.length > 0 ? (
              <div className="space-y-3">
                {post.comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="p-3 bg-white rounded-lg border border-gray-200"
                  >
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">{comment.userId.email}</span>
                    </p>
                    <p className="text-gray-800">{comment.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No comments yet</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
