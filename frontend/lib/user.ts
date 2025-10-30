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