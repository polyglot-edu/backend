import express from 'express';
import * as ConceptsController from "../controllers/concepts.controller";

const router = express.Router();

router.post("/genGraphExt", ConceptsController.genGraphExt);
router.post("/genGraphSkill", ConceptsController.genGraphSkill);
router.post("/extract", ConceptsController.extractConcepts);

export default router;