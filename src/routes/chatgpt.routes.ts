import express from 'express';
import * as ChatGPTControllers from '../controllers/chatgpt.controllers'

const router = express.Router();

router.post("/", ChatGPTControllers.chat_to_GPT);

export default router;