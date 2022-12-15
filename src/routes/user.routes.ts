import express from 'express';
import * as UserControllers from '../controllers/user.controller'
import { checkAuth } from '../middlewares/auth.middleware';

const router = express.Router();

router.get("/me", checkAuth, UserControllers.getUserInfo);

export default router;