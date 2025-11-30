import express from "express";
import dotenv from "dotenv";
import connectDb from "./db/db.js";
import cors from "cors";
import userRouter from "./routes/user-routes.js";
import { errorHandler, notFound } from "./middlewares/error-middleware.js";
import chatRouter from "./routes/chat-routes.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is working");
});
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3000;

connectDb().then(() => {
  app.listen(port, () => {
    console.log("Server Started on Port 3000");
  });
});
