import { Router } from "express";
import { getResultController } from "../controllers/aiController.js";

const aiRouter = Router();

aiRouter.route("/get-result").get(getResultController);

export default aiRouter;
