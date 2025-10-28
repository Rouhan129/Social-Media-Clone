import { Post } from "@/app/types/post";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export const createPost = async (formData: FormData): Promise<Post> => {
    const res = await fetch(`${API_URL}/post`, {
        method: 'POST',
        body: formData
    })

    if (!res.ok) {
        throw new Error("Failed to create POST!")
    }

    return res.json()
}

export const getPosts = async (): Promise<Post[]> => {
    const res = await fetch(`${API_URL}/post`)

    if (!res.ok){
        throw new Error("Unable to get posts.")
    }

    return res.json()
}