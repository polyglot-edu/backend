import express from "express";
import { checkAuth } from "../middlewares/auth.middleware";
import * as SyllabusController from "../controllers/syllabus.controllers";

const router = express.Router();
// cambiare tutto con flow

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

router.route("/:password/serverClean").get(SyllabusController.serverCleanUp);

export default router;
