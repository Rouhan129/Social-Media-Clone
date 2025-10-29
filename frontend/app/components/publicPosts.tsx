"use client";

import { useEffect, useState } from "react";
import { getAllPosts, postComment } from "@/lib/post";
import Button from "../components/Button";
import { useRouter } from "next/navigation";

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
}

export default function PublicPosts() {
    const [data, setData] = useState<Post[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [commentData, setCommentData] = useState<{ [key: string]: string }>({});

    const router = useRouter();

    const handleComment = async (e: React.FormEvent, postId: string) => {
        e.preventDefault();

        const text = commentData[postId];
        if (!text) return;

        try {
            await postComment({
                postId,
                text,
                parentComment: null,
            });

            const posts = await getAllPosts();
            setData(posts);

            setCommentData((prev) => ({ ...prev, [postId]: "" }));
        } catch (err) {
            console.error("Failed to post comment", err);
        }
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const posts = await getAllPosts();
                setData(posts);
            } catch (err) {
                setError("Failed to load posts");
            }
        };

        fetchPosts();
    }, []);

    if (error) return <div className="text-red-600 font-bold">ERROR!</div>;

    return (
        <div className="flex flex-col items-center mt-5 gap-2">
            <span className="text-black">Public POSTS</span>
            {data.map((post) => (
                <div key={post._id} className="flex w-[100%] bg-gray-300 p-2 rounded-md gap-2">
                    {/* Left Section */}
                    <div className="w-[50%] bg-gray-300 p-2 rounded-md">
                        <div><span className="font-semibold">Title: </span>{post.title}</div>
                        <div><span className="font-semibold">Description: </span>{post.desc}</div>

                        <img
                            src={`http://localhost:5000/${post.image}`}
                            alt={post.title}
                            width={300}
                            height={500}
                            className="mt-2 rounded"
                        />

                        <div className="text-red-500 mt-2">
                            <span className="font-semibold">User: </span>{post.user?.email || "Unknown"}
                        </div>

                        <form onSubmit={(e) => handleComment(e, post._id)} className="mt-2">
                            <textarea
                                name="comment"
                                placeholder="Write a comment..."
                                rows={2}
                                className="bg-white text-black w-full rounded-sm p-2"
                                value={commentData[post._id] || ""}
                                onChange={(e) =>
                                    setCommentData((prev) => ({ ...prev, [post._id]: e.target.value }))
                                }
                            />
                            <Button type="submit" className="mt-2">Post Comment</Button>
                        </form>
                    </div>

                    <div className="w-[50%] bg-white p-2 rounded-md">
                        <h3 className="font-semibold mb-2 text-black">Comments</h3>
                        {post.comments.length > 0 ? (
                            post.comments.map((comment) => (
                                <div key={comment._id} className="p-2 shadow-sm">
                                    <div className="text-sm text-gray-600">
                                        {comment.userId?.email || "Unknown User"}
                                    </div>
                                    <div className="text-black">{comment.text}</div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No comments yet</p>
                        )}
                    </div>
                </div>
            ))}

            <div className="w-[5%] absolute top-4 left-4">
                <Button onClick={() => router.push("/")}>Home</Button>
            </div>
        </div>
    );
}
