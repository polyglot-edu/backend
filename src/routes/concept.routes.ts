import express from 'express';
import * as ConceptControllers from "../controllers/concept.controllers";

const router = express.Router();

router.route("/map").post(ConceptControllers.createConceptMap)
router.route("/map/:id").get(ConceptControllers.findConceptMapById);

export default router;