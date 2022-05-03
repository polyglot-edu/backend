import express from 'express';
import * as ExecutionController from "../controllers/execution.controller";

const router = express.Router();

router.get("/next", ExecutionController.getNextExercise)

export default router;