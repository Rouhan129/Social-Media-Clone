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

  const currentUserId =
    typeof window !== "undefined" ? localStorage.getItem("id") : null;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const messagesEndRef = useRef(null);
  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

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
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    setSocket(newSocket);

    const fetchUsers = async () => {
      try {
        const users = await getFollowedUsers(token);
        setFollowedUsers(users);
      } catch (error) {
        console.error("Error fetching followed users:", error);
      }
    };

    fetchUsers();

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
      if (
        selectedUser &&
        ((msg.senderId === currentUserId &&
          msg.receiverId === selectedUser._id) ||
          (msg.senderId === selectedUser._id &&
            msg.receiverId === currentUserId))
      ) {
        setMessages((prev) => {
          const exists = prev.some(
            (m) =>
              m._id === msg._id ||
              (m.temp &&
                m.content === msg.content &&
                m.senderId === msg.senderId)
          );
          if (exists) {
            return prev.map((m) =>
              m.temp && m.content === msg.content && m.senderId === msg.senderId
                ? msg
                : m
            );
          }
          return [...prev, msg];
        });
      }
    };

    socket.on("receive_message", handleReceiveMessage);
    return () => socket.off("receive_message", handleReceiveMessage);
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

    setMessages((prev) => [...prev, optimisticMessage]);
    setInput("");

    socket.emit("send_message", {
      senderId: currentUserId,
      receiverId: selectedUser._id,
      content: input.trim(),
    });
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Left Sidebar */}
      <div className="w-full md:w-80 bg-white border-r border-gray-300 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-blue-700">Messages</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {followedUsers.length === 0 ? (
            <p className="text-center text-gray-500 mt-8">
              No conversations yet.
            </p>
          ) : (
            followedUsers.map((user) => (
              <div
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`flex items-center p-4 cursor-pointer transition rounded-xl mx-2 my-1 ${
                  selectedUser?._id === user._id
                    ? "bg-blue-100 text-blue-800"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex flex-col">
                  <p className="font-semibold text-sm">
                    {user.username || user.email || "Unknown User"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Chat Panel */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="bg-white p-4 border-b font-semibold text-blue-700 shadow-sm sticky top-0 z-10">
              {selectedUser.username || selectedUser.email}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="text-center text-gray-400 mt-10">
                  No messages yet. Say hello!
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg._id || msg.temp}
                    className={`flex ${
                      msg.senderId === currentUserId
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs md:max-w-sm px-4 py-2 rounded-2xl text-sm md:text-base shadow-md ${
                        msg.senderId === currentUserId
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-white text-gray-800 rounded-bl-none"
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
            <div className="bg-white p-3 md:p-4 border-t flex items-center gap-2 sticky bottom-0">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 text-sm md:text-base rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
              <button
                onClick={handleSend}
                className="px-4 md:px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition shadow-sm"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 p-4 text-center">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
