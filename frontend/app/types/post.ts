export interface Post {
    _id: string,
    title: string,
    desc: string,
    image: string,
    createdAt: string
}

export interface CreatePostFormData {
  title: string;
  description: string;
}

export interface Error {
    message: string
}

export interface CreateCommentPayload {
  postId: string;
  text: string;
  parentComment?: string | null;
}
