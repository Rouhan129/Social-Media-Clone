interface userResponse {
    _id: string;
    email: string;
    role: string;
    // password: string;
    // createdAt: string;
    // updatedAt: string;
    // refreshToken: string;
}

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export const getUserInfo = async (id: string): Promise<userResponse> => {
    const userInfo = await fetch(`${API_URL}/user/${id}`)

    if (!userInfo.ok) throw new Error("User not present!");

    return userInfo.json()
        
}

export const getUsers = async() => {
    const users = await fetch(`${API_URL}/user/all`)

    if (!users.ok) throw new Error("No users present!")

        return users.json()
}

export const updateUserEmail = async (id: string, email: string) => {
  const res = await fetch(`${API_URL}/user/${id}/email`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) throw new Error("Failed to update email");
  return res.json();
};