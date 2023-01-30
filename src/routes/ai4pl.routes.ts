import express from 'express';
import * as ai4plController from "../controllers/ai4pl.controller";

const router = express.Router();
router.get('/complete',ai4plController.convert)

export default router 

