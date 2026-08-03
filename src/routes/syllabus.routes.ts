import express from "express";
import { checkAuth } from "../middlewares/auth.middleware";
import { requireMaintenanceSecret } from "../middlewares/maintenance.middleware";
import * as SyllabusController from "../controllers/syllabus.controllers";

const router = express.Router();
// cambiare tutto con flow

// Destructive maintenance route: gated by MAINTENANCE_SECRET, not by a password
// in the URL. MUST stay above "/:id", which would otherwise match it.
router
  .route("/serverClean")
  .delete(
    requireMaintenanceSecret,
    checkAuth,
    SyllabusController.serverCleanUp,
  );

router
  .route("/:id")
  .delete(checkAuth, SyllabusController.deleteSyllabus)
  .get(checkAuth, SyllabusController.getSyllabusById);

router
  .route("/")
  .post(checkAuth, SyllabusController.createSyllabus)
  .put(checkAuth, SyllabusController.updateSyllabus)
  .get(checkAuth, SyllabusController.getSyllabuses);

router.route("/json").post(checkAuth, SyllabusController.createSyllabusJson);

export default router;
