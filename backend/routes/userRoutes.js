import express from "express";
import { authUser, registerUser } from "../controllers/userController.js";
const userRouter = express.Router();

userRouter.route("/").post(registerUser);
userRouter.route("/login").post(authUser);

export default userRouter;
