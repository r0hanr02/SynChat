import express from "express";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./db/db.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";

const app = express();
connectDB();

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/api", userRouter);
app.use("/projects", projectRoutes);

app.get("/", (req, res) => {
  res.status(200).send("Hello World");
});

export default app;
