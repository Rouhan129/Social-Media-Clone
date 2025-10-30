"use client";
import Button from "@/app/components/Button";

export default function UserSidebar({ followedUsers, selectedUser, setSelectedUser, onBack }) {
  return (
    <div className="w-1/4 bg-gray-200 p-4 overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">Your Conversations</h2>
      {followedUsers.length === 0 && <p>No followed users yet.</p>}
      {followedUsers.map((user) => (
        <div
          key={user._id}
          onClick={() => setSelectedUser(user)}
          className={`p-2 cursor-pointer rounded ${
            selectedUser?._id === user._id ? "bg-blue-400 text-white" : "hover:bg-blue-100"
          }`}
        >
          {user.email}
        </div>
      ))}

      <div className="mt-5">
        <Button onClick={onBack}>Back Home</Button>
      </div>
    </div>
  );
}
