import { useState } from "react";
import Input from "./Input";
import ImageUpload from "./ImageUpload";
import { createPost } from "@/lib/post";

export default function PostForm() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ title?: string; desc?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { title?: string; desc?: string } = {};
    if (!title) newErrors.title = "Title is required.";
    if (!desc) newErrors.desc = "Description is required.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("desc", desc);
    if (image) formData.append("image", image);

    try {
      const post = await createPost(formData);
      console.log("Post created:", post);
      setTitle("")
      setDesc("")
      setImage(null)
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
      <Input
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={errors.title}
      />

      <Input
        label="Description"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        error={errors.desc}
      />

      <ImageUpload onFileChange={(file) => setImage(file)} />

      <button
        type="submit"
        className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  );
}
