import express from 'express';
import { checkAuth } from '../middlewares/auth.middleware';
import * as FlowController from "../controllers/flows.controllers";

const router = express.Router();

router.route("/")
    .get(checkAuth, FlowController.getFlowList)
    .post(checkAuth, FlowController.createFlow) // FIX: Type error when add requiresAuth

router.route("/:id")
    .get(checkAuth, FlowController.getFlowById)
    .put(checkAuth, FlowController.updateFlow)

export default router;