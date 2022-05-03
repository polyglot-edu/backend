import express from 'express';
import * as ExecutionController from "../controllers/execution.controller";

const router = express.Router();

router.get("/next", ExecutionController.getNextExercise)
router.get("/first", ExecutionController.getInitialExercise)

export default router;