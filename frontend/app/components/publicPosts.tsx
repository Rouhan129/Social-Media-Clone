"use client";

import { useEffect, useState } from "react";
import { feedPosts, postComment, toggleLike } from "@/lib/post";
import Button from "@/app/components/Button";

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
  const [replyData, setReplyData] = useState<{ [key: string]: string }>({});
  const [replyVisible, setReplyVisible] = useState<{ [key: string]: boolean }>({});

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

  const handleReply = async (
    e: React.FormEvent,
    postId: string,
    email: string
  ) => {
    e.preventDefault();
    const text = replyData[`${postId}-${email}`];
    if (!text) return;

    try {
      await postComment({ postId, text, parentComment: email });
      const posts = await feedPosts();
      setData(posts);
      setReplyData((prev) => ({ ...prev, [`${postId}-${email}`]: "" }));
      setReplyVisible((prev) => ({ ...prev, [`${postId}-${email}`]: false }));
    } catch (err) {
      console.error("Failed to post reply", err);
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
    const fetchPosts = async () => {
      try {
        const posts = await feedPosts();
        setData(posts);
      } catch (err) {
        console.error(err);
        setError("Failed to load posts");
      }
    };

    fetchPosts();
  }, []);

  if (error) return <div className="text-red-600 font-bold">{error}</div>;

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
                {post.isLikedByUser ? "Liked" : "Likes"}{" "}
                {post.likes > 0 ? `(${post.likes})` : "(0)"}
              </button>
            </div>

            {/* COMMENT FORM */}
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

          {/* RIGHT SIDE — Comments */}
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

                    {/* Render reply tag if exists */}
                    {comment.parentComment && (
                      <p className="text-sm text-blue-600 mb-1">
                        @{comment.parentComment}
                      </p>
                    )}

                    <p className="text-gray-800">{comment.text}</p>

                    {/* Reply Button */}
                    <button
                      className="text-xs text-blue-600 mt-1 hover:underline"
                      onClick={() =>
                        setReplyVisible((prev) => ({
                          ...prev,
                          [`${post._id}-${comment.userId.email}`]:
                            !prev[`${post._id}-${comment.userId.email}`],
                        }))
                      }
                    >
                      Reply
                    </button>

                    {/* Reply Input */}
                    {replyVisible[`${post._id}-${comment.userId.email}`] && (
                      <form
                        onSubmit={(e) =>
                          handleReply(e, post._id, comment.userId.email)
                        }
                        className="mt-2 space-y-1"
                      >
                        <textarea
                          placeholder={`Reply to ${comment.userId.email}...`}
                          rows={2}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                          value={replyData[`${post._id}-${comment.userId.email}`] || ""}
                          onChange={(e) =>
                            setReplyData((prev) => ({
                              ...prev,
                              [`${post._id}-${comment.userId.email}`]: e.target.value,
                            }))
                          }
                        />
                        <Button
                          type="submit"
                          className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm py-1"
                        >
                          Send Reply
                        </Button>
                      </form>
                    )}
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
