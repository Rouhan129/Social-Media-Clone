import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import http from "http";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import connectDB from "./src/config/db.js";

// Routes
import authRoutes from "./src/routes/auth.js";
import postRoutes from "./src/routes/postRoutes.js";
import commentRoutes from "./src/routes/commentRoutes.js";
import likeRoutes from "./src/routes/likeRoutes.js";
import followRoutes from "./src/routes/followRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import messageRoutes from "./src/routes/messageRoutes.js";

// Models
import Message from "./src/models/Message.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/like", likeRoutes);
app.use("/api/follow", followRoutes);
app.use("/api/user", userRoutes);
app.use("/api/message", messageRoutes);


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// === SOCKET.IO MIDDLEWARE: Authenticate user ===
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  const userId = socket.handshake.query.userId;

  if (!token || !userId) {
    return next(new Error("Authentication error: Missing token or userId"));
  }


  socket.userId = userId;
  next();
});

io.on("connection", (socket) => {
  const userId = socket.userId;
  console.log("User connected:", userId, "Socket ID:", socket.id);

  // Automatically join user's room
  socket.join(userId);
  console.log(`User ${userId} joined room: ${userId}`);


  socket.on("send_message", async (data) => {
    try {
      const { receiverId, content } = data;
      const senderId = userId; // Trust only authenticated user

      if (!receiverId || !content?.trim()) {
        return socket.emit("message_error", { error: "Invalid message data" });
      }

      // Save to DB
      const message = await Message.create({
        senderId,
        receiverId,
        content: content.trim(),
      });

      const messageToSend = {
        ...message.toObject(),
        senderId: message.senderId.toString(),
        receiverId: message.receiverId.toString(),
      };

      // Emit to receiver
      io.to(receiverId).emit("receive_message", messageToSend);

      // Emit back to sender (for confirmation)
      socket.emit("receive_message", messageToSend);

      console.log("Message sent:", messageToSend);
    } catch (error) {
      console.error("Error saving message:", error);
      socket.emit("message_error", { error: "Failed to send message" });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", userId);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});