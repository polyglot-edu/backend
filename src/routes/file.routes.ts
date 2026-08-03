import express from "express";
import * as FileControllers from "../controllers/file.controllers";
import { checkAuth } from "../middlewares/auth.middleware";
import { requireMaintenanceSecret } from "../middlewares/maintenance.middleware";

const router = express.Router();
router.post("/upload/:id", checkAuth, FileControllers.uploadFile);
router.get("/download/:id", checkAuth, FileControllers.download);
// Destructive maintenance route: gated by MAINTENANCE_SECRET, not by a
// password in the URL. Declared before any "/:id" route would match it.
router
  .route("/serverClean")
  .delete(requireMaintenanceSecret, checkAuth, FileControllers.fileCleanUp);

export default router;
