import { Router } from "express";
import * as aiController from "../controllers/ai.controller.js";

const aiRoutes = Router();

aiRoutes.get('/get-result', aiController.getResult)

export default aiRoutes;