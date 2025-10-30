"use client";

import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import Button from "../components/Button";
import { useRouter } from "next/navigation";
import { getFollowedUsers, getMessages } from "@/lib/messages";

export default function MessagesPage() {
  const router = useRouter();
  const [followedUsers, setFollowedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState(null);
  
  const currentUserId = typeof window !== "undefined" ? localStorage.getItem("id") : null;
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const messagesEndRef = useRef(null);

  // Scroll to bottom when new message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // === SOCKET INITIALIZATION (ONCE) ===
  useEffect(() => {
    if (!token || !currentUserId) return;

    const newSocket = io("http://localhost:5000", {
      auth: { token },
      query: { userId: currentUserId },
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
      newSocket.emit("join_user", currentUserId); // Join personal room
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    setSocket(newSocket);

    // Fetch followed users
    const fetchUsers = async () => {
      try {
        const users = await getFollowedUsers(token);
        setFollowedUsers(users);
      } catch (error) {
        console.error("Error fetching followed users:", error);
      }
    };

    fetchUsers();

    // Cleanup
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [token, currentUserId]);

  // === LISTEN FOR INCOMING MESSAGES ===
  useEffect(() => {
    if (!socket || !currentUserId) return;

    const handleReceiveMessage = (msg) => {
      console.log("Received message:", msg);

      // Only add if part of current conversation
      if (
        selectedUser &&
        ((msg.senderId === currentUserId && msg.receiverId === selectedUser._id) ||
          (msg.senderId === selectedUser._id && msg.receiverId === currentUserId))
      ) {
        setMessages((prev) => {
          // Prevent duplicates
          const exists = prev.some(
            (m) =>
              m._id === msg._id ||
              (m.temp && m.content === msg.content && m.senderId === msg.senderId)
          );
          if (exists) {
            // Replace temp message with real one
            return prev.map((m) =>
              m.temp && m.content === msg.content && m.senderId === msg.senderId ? msg : m
            );
          }
          return [...prev, msg];
        });
      }
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket, selectedUser, currentUserId]);

  // === FETCH CHAT HISTORY WHEN USER SELECTED ===
  useEffect(() => {
    if (!selectedUser || !token) return;

    const fetchChat = async () => {
      try {
        const msgs = await getMessages(selectedUser._id, token);
        setMessages(msgs || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchChat();
  }, [selectedUser, token]);

  // === SEND MESSAGE ===
  const handleSend = () => {
    if (!selectedUser || !input.trim() || !socket || !currentUserId) return;

    const tempId = Date.now().toString();
    const optimisticMessage = {
      _id: tempId,
      senderId: currentUserId,
      receiverId: selectedUser._id,
      content: input.trim(),
      temp: true,
      createdAt: new Date().toISOString(),
    };

    // Optimistically update UI
    setMessages((prev) => [...prev, optimisticMessage]);
    setInput("");

    // Send to server
    socket.emit("send_message", {
      senderId: currentUserId,
      receiverId: selectedUser._id,
      content: input.trim(),
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar */}
      <div className="w-80 bg-white border-r border-gray-300 flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Messages</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {followedUsers.length === 0 ? (
            <p className="text-center text-gray-500 mt-8">No conversations yet.</p>
          ) : (
            followedUsers.map((user) => (
              <div
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`p-4 cursor-pointer border-b hover:bg-gray-50 transition ${
                  selectedUser?._id === user._id ? "bg-blue-50" : ""
                }`}
              >
                <p className="font-medium">
                  {user.username || user.email || "Unknown User"}
                </p>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t">
          <Button onClick={() => router.push("/")} className="w-full">
            Back to Home
          </Button>
        </div>
      </div>

      {/* Right Chat Panel */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="bg-white p-4 border-b font-semibold shadow-sm">
              {selectedUser.username || selectedUser.email}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.length === 0 ? (
                <div className="text-center text-gray-400 mt-10">
                  No messages yet. Say hello!
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg._id || msg.temp}
                    className={`flex ${msg.senderId === currentUserId ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.senderId === currentUserId
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-800 border"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button onClick={handleSend}>Send</Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
}