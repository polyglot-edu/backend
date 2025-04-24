import express from "express";
import * as OpenAiControllers from "../controllers/openai.controllers";

const router = express.Router();

router.post("/genRes", OpenAiControllers.genResource);
router.post("/genGraph", OpenAiControllers.genConceptMap);
//generativeAPI
router.post("/MaterialAnalyser", OpenAiControllers.analyseMaterial);
router.post("/LearningObjectiveGenerator", OpenAiControllers.generateLO); //outdated
router.post("/MaterialGenerator", OpenAiControllers.generateMaterial);
router.post("/Summarizer", OpenAiControllers.summarize);
router.post("/ActivityGenerator", OpenAiControllers.activityGenerator);
router.post("/Corrector", OpenAiControllers.corrector);

export default router;
