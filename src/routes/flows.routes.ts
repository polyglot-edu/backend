import express from 'express';
import * as FlowController from '../controllers/flows.controllers';

const router = express.Router();

router.post("/", FlowController.createFlow)

router.route("/:id")
    .get(FlowController.getFlowById)
    .put(FlowController.updateFlow)

export default router;