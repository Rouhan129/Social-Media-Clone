import { Post, CreateCommentPayload } from "@/app/types/post";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export const createPost = async (formData: FormData): Promise<Post> => {
    const token = localStorage.getItem("accessToken")
    const res = await fetch(`${API_URL}/post`, {
        method: 'POST',
        headers: {Authorization: `Bearer ${token}`},
        body: formData
    })

    if (!res.ok) {
        throw new Error("Failed to create POST!")
    }

    return res.json()
}

export const getPosts = async (): Promise<Post[]> => {
    const token = localStorage.getItem("accessToken")
    const res = await fetch(`${API_URL}/post`, {
        headers: {Authorization: `Bearer ${token}`}
    })

    if (!res.ok){
        throw new Error("Unable to get posts.")
    }

    return res.json()
}

export const getAllPosts = async (): Promise<Post[]> => {
    const token = localStorage.getItem("accessToken")
    const res = await fetch(`${API_URL}/post/all`, {
        headers: {Authorization: `Bearer ${token}`}
    })

    if (!res.ok){
        throw new Error("Unable to get posts.")
    }

    return res.json()
}

export const postComment = async (comment: CreateCommentPayload) => {
  const token = localStorage.getItem("accessToken");

  const res = await fetch(`${API_URL}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(comment),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create comment!");
  }

  return res.json();
};

export const toggleLike = async (postId: string) => {
    const token = localStorage.getItem("accessToken");
    const res = await fetch(`${API_URL}/like`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ postId })
    });

    if (!res.ok) throw new Error("Failed to like/unlike post");
    return res.json();
};

export const getLikesForPost = async (postId: string) => {
    try {
        const res = await fetch(`${API_URL}/like/${postId}`, {
            method: "GET",
        });

        if (!res.ok) {
            throw new Error("Failed to fetch likes");
        }

        return await res.json(); // { postId, likes }
    } catch (error) {
        console.error("Error fetching likes:", error);
        throw error;
    }
};