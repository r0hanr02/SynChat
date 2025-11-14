import { Router } from "express";
import {
  createUserController,
  loginController,
  profileController,
} from "../controllers/userController.js";
import { body } from "express-validator";
import { authUser } from "../middlewares/authMiddleware.js";

const userRouter = Router();

userRouter
  .route(
    "/register",
    body("email").isEmail().withMessage("Email must be a valid Email address"),
    body("password").isLength({ min: 3 }).withMessage("Password must be valid")
  )
  .post(createUserController);

userRouter.route("/login").post(loginController);

userRouter.route("/profile").get(authUser, profileController);
export default userRouter;
