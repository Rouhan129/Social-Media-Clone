"use client"

import { useRef } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";

type FileChangeHandler = (file: File | null) => void;

interface ImageUploadProps {
    onFileChange: FileChangeHandler
}

export default function ImageUpload({onFileChange}: ImageUploadProps){
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleClick = () => {
        fileInputRef.current?.click()
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        onFileChange(file);
    }


    return (
        <div className="bg-gray-200 p-4 rounded-md flex items-center">
            <input ref={fileInputRef} type="file" name="image" accept="image/jpeg,image/jpg,image/png" onChange={handleChange} />
            <button type="button" onClick={handleClick} className="bg-gray-600 p-2 rounded-md text-white"><IoCloudUploadOutline size={30} /></button>
        </div>
    )
}