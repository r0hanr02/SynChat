import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./utils/db.js";
import chats from "./data/data.js";
dotenv.config();
const app = express();
app.use(cors());

app.use(express.json());

app.get("/api/chat", (req, res) => {
  res.json(chats);
});
app.get("/api/chat/:id", (req, res) => {
  const singleChat = chats.find((c) => c._id === req.params.id);
  res.json(singleChat);
});
connectDB().then(() => {
  app.listen(5000, () => {
    console.log("Server Started at", 5000);
  });
});
