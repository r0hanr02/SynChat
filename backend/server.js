import express from "express";
import dotenv from "dotenv";
import connectDb from "./db/db.js";
import cors from "cors";
import userRouter from "./routes/user-routes.js";
import { errorHandler, notFound } from "./middlewares/error-middleware.js";
import chatRouter from "./routes/chat-routes.js";
import messageRouter from "./routes/message-routes.js";
import { Server } from "socket.io";
import http from "http";
import aiRouter from "./routes/ai-routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
connectDb();

app.get("/", (req, res) => {
  res.send("Server is working");
});
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);
app.use("/api/ai", aiRouter);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3000;

const server = http.createServer(app);
server.listen(port, () => {
  console.log("Server Started on Port 3000");
});

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "https://synchat-green.vercel.app",
  },
});

io.on("connection", (socket) => {
  console.log("connected to Socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageReceived) => {
    let chat = newMessageReceived.chat;
    if (!chat.users) return console.log("chat.users not defined");
    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.on("ai-message", ({ room, message }) => {
    io.to(room).emit("ai-message", {
      sender: "AI",
      message: message,
    });
  });

  socket.off("setup", () => {
    console.log("User Disconnected");
    socket.leave(userData._id);
  });
});
