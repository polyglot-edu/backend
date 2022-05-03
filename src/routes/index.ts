import express from 'express';
import flowRouter from './flows.routes';
import executionRouter from './execution.routes';

const router = express.Router();

router.use("/api/flows", flowRouter);
router.use("/api/execution", executionRouter);

export default router;