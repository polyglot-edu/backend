import express from "express";
import { checkAuth } from "../middlewares/auth.middleware";
import { requireMaintenanceSecret } from "../middlewares/maintenance.middleware";
import * as FlowController from "../controllers/flows.controllers";

const router = express.Router();

router
  .route("/")
  .get(checkAuth, FlowController.getFlowList)
  .post(checkAuth, FlowController.createFlow);

router.route("/json").post(checkAuth, FlowController.createFlowJson);

// Registered before "/:id" so it is not shadowed by the id route.
router
  .route("/serverClean")
  .delete(requireMaintenanceSecret, checkAuth, FlowController.serverCleanUp);

router
  .route("/:id")
  .get(checkAuth, FlowController.getFlowById)
  .put(checkAuth, FlowController.updateFlow)
  .delete(checkAuth, FlowController.deleteFlow);

router
  .route("/:id/runFirst") //first version of the notebook (run the execution from the first call)
  .get(FlowController.downloadNotebookVSC);

router
  .route("/:ctxId/run/:filename") // version of notebook with only ctx information
  .get(FlowController.downloadNotebookVSCCTX);

router
  .route("/:id/:ctxId/run/:filename") //2nd version of notebook with ctx information and flowId
  .get(FlowController.downloadNotebookVSC2);

router
  .route("/:id/publish") //function to publish the flow
  .put(checkAuth, FlowController.publishFlow);

export default router;
