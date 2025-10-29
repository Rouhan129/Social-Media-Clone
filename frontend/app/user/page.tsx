"use client"

import { useEffect, useState } from "react";
import {getPosts} from "@/lib/post"
import Button from "../components/Button";
import { useRouter } from "next/navigation";
// import Image from "next/image";

interface Post {
    title: string,
    desc: string,
    image: string
}

export default function UserPage(){
    const [data, setData] = useState<Post[]>([])
    const [error, setError] = useState<string | null>(null)

    const router = useRouter()


    useEffect(() => {
        const fectchPosts = async() => {
            try{
                const posts = await getPosts()
                setData(posts)
            }catch(err){
                setError("Failed to load posts")
            }
        }

        fectchPosts()
    }, [])

    if (error) return <div className="text-red-600 font-bold">ERROR!</div>
    return (
        <div className="flex flex-col items-center mt-5 gap-2">
            <span className="text-black">MY POSTS</span>
            {data.map((post, index) => (
                <div key={index} className="bg-gray-300 p-2 rounded-md">
                    <div><span>Title:{" "}</span>{post.title}</div>
                    <div><span>Description:{" "}</span>{post.desc}</div>
                    <img src={`http://localhost:5000/${post.image}`} alt={post.title} width={300} height={500} className="mt-2 rounded" />
                </div>
            ))}
            <div className="w-[5%] absolute top-4 left-4">
                <Button onClick={() => {router.push('/')}} >Home</Button>
            </div>
        </div>
    )
}