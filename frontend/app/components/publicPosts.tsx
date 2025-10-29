"use client";

import { useEffect, useState } from "react";
import { getAllPosts, postComment, toggleLike, getLikesForPost } from "@/lib/post";
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
    likes: number;
    isLikedByUser?: boolean;
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
            await postComment({ postId, text, parentComment: null });
            const posts = await getAllPosts();
            setData(posts);
            setCommentData((prev) => ({ ...prev, [postId]: "" }));
        } catch (err) {
            console.error("Failed to post comment", err);
        }
    };

    const handleLike = async (postId: string) => {
        try {
            await toggleLike(postId);
            const posts = await getAllPosts();
            setData(posts);
        } catch (err) {
            console.error("Failed to toggle like", err);
        }
    };

    useEffect(() => {
        const fetchPostsWithLikes = async () => {
            try {
                const posts = await getAllPosts();

                const postsWithLikes = await Promise.all(
                    posts.map(async (post) => {
                        const likeData = await getLikesForPost(post._id);
                        return {
                            ...post,
                            likes: likeData.likes || 0,
                            isLikedByUser: likeData.isLikedByUser || false
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
        <div className="flex flex-col items-center mt-5 gap-2">
            <span className="text-black">Public POSTS</span>
            {data.map((post) => (
                <div key={post._id} className="flex w-full bg-gray-300 p-2 rounded-md gap-2">
                    <div className="w-1/2 p-2">
                        <h2 className="font-bold">{post.title}</h2>
                        <p>{post.desc}</p>
                        <img src={`http://localhost:5000/${post.image}`} alt={post.title} className="mt-2 rounded" />

                        <p className="text-red-500 mt-2">
                            <span className="font-semibold">User: </span>
                            {post.user?.email}
                        </p>

                        <button
                            onClick={() => handleLike(post._id)}
                            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
                        >
                            {post.isLikedByUser ? "Unlike" : "Like"} ({post.likes})
                        </button>

                        <form onSubmit={(e) => handleComment(e, post._id)} className="mt-2">
                            <textarea
                                placeholder="Write a comment..."
                                rows={2}
                                className="w-full p-2 rounded bg-white"
                                value={commentData[post._id] || ""}
                                onChange={(e) =>
                                    setCommentData((prev) => ({ ...prev, [post._id]: e.target.value }))
                                }
                            />
                            <Button type="submit" className="mt-2">Post Comment</Button>
                        </form>
                    </div>

                    <div className="w-1/2 bg-white p-2 rounded">
                        <h3 className="font-semibold">Comments</h3>
                        {post.comments.length > 0 ? (
                            post.comments.map((comment) => (
                                <div key={comment._id} className="p-2 border-b">
                                    <p className="text-sm text-gray-600">{comment.userId.email}</p>
                                    <p>{comment.text}</p>
                                </div>
                            ))
                        ) : (
                            <p>No comments yet</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}