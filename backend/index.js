import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./utils/db.js";
import chats from "./data/data.js";
import userRouter from "./routes/userRoutes.js";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";
dotenv.config();

const app = express();
app.use(cors());

app.use(express.json());

app.use("/api/user", userRouter);

app.use(notFound);
app.use(errorHandler);

connectDB().then(() => {
  app.listen(5000, () => {
    console.log("Server Started at", 5000);
  });
});
