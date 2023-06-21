import express from 'express';
import * as OpenAiControllers from '../controllers/openai.controllers';

const router = express.Router();

router.post("/genRes", OpenAiControllers.genResource);
router.post("/genGraph", OpenAiControllers.genConceptMap);

export default router;