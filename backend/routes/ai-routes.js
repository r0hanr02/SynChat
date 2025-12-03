import { Router } from "express";
import { getResultController } from "../controllers/ai-controller.js";

const aiRouter = Router();

aiRouter.route("/get-result").get(getResultController);

export default aiRouter;
