import express from 'express';
import { checkAuth } from '../middlewares/auth.middleware';
import * as FlowController from "../controllers/flows.controllers";

const router = express.Router();

router.route("/")
    .get(checkAuth, FlowController.getFlowList)
    .post(checkAuth, FlowController.createFlow)

router.route("/json")
    .post(checkAuth, FlowController.createFlowJson);

router.route("/:id")
    .get(checkAuth, FlowController.getFlowById)
    .put(checkAuth, FlowController.updateFlow)
    .delete(checkAuth, FlowController.deleteFlow);
 
router.route("/:id/run")
    .get(FlowController.downloadNotebookVSC);

export default router;