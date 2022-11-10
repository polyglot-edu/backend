import express from 'express';
import flowRouter from './flows.routes';
import executionRouter from './execution.routes';
import authRouter from './auth.routes';
import userRouter from './user.routes';
import searchRouter from "./search.routes";

const router = express.Router();

router.use("/api/auth", authRouter);
router.use("/api/flows", flowRouter);
router.use("/api/execution", executionRouter);
router.use("/api/user", userRouter);
router.use("/api/search", searchRouter);

export default router;