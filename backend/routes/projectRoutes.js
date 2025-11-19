import { Router } from "express";
import { body } from "express-validator";
import {
  createProjectController,
  getAllProjectController,
  getProjectByIdController,
  addUserToProjectController,
} from "../controllers/projectController.js";
import { authUser } from "../middlewares/authMiddleware.js";
const router = Router();

router
  .route("/create")
  .post(
    authUser,
    createProjectController,
    body("name").isString().withMessage("Name is Required")
  );

router.route("/all").get(authUser, getAllProjectController);

router
  .route("/adduser")
  .put(
    authUser,
    body("projectId").isString().withMessage("projectId must be a string"),
    body("users")
      .isArray({ min: 1 })
      .withMessage("Users must be a non-empty array"),
    body("users.*").isString().withMessage("Each user ID must be a string"),
    addUserToProjectController
  );

router.route("/get-project/:projectId").get(authUser, getProjectByIdController);
export default router;
