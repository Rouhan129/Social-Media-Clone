"use client";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function useMessages(currentUserId: string, token: string | null) {
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Connect socket once
  useEffect(() => {
    if (!token) return;

    // Only connect once
    if (!socket) {
      socket = io(process.env.NEXT_PUBLIC_BACKEND_URL!, {
        auth: { token },
      });

      socket.on("connect", () => console.log("Socket connected:", socket?.id));
      socket.on("connect_error", (err) => console.error("Socket error:", err));
    }

    return () => {
      // optional: disconnect only when leaving page
      // socket?.disconnect();
    };
  }, [token]);

  // Listen for messages separately
  useEffect(() => {
    if (!socket) return;

    const handleReceive = (msg: any) => {
      if (
        selectedUser &&
        ((msg.senderId === currentUserId && msg.receiverId === selectedUser._id) ||
          (msg.senderId === selectedUser._id && msg.receiverId === currentUserId))
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("receive_message", handleReceive);
    return () => {
      socket.off("receive_message", handleReceive);
    };
  }, [selectedUser, currentUserId]);

  // Send message function
  const sendMessage = (receiverId: string, content: string) => {
    if (!socket || !receiverId || !content.trim()) {
      console.warn("⚠️ Cannot send message — socket not ready or invalid input");
      return;
    }

    const msg = { senderId: currentUserId, receiverId, content };
    console.log("📤 Sending message:", msg);
    socket.emit("send_message", msg);
    setMessages((prev) => [...prev, msg]); // optimistic UI
  };

  return { messages, setMessages, selectedUser, setSelectedUser, sendMessage };
}
