import express from 'express';
import * as ExecutionController from "../controllers/execution.controller";

const router = express.Router();

router.post("/next", ExecutionController.getNextExercise)
router.post("/first", ExecutionController.getInitialExercise)

export default router;