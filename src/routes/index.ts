import express from 'express';
import flowRouter from './flows.routes';

const router = express.Router();

router.use("/api/flows", flowRouter);

export default router;