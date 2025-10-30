export async function getFollowedUsers(token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/following`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch followed users");
  return res.json();
}

export async function getMessages(userId: string, token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/message/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch messages");
  return res.json();
}
