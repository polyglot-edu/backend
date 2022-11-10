import express from 'express';
import * as SearchController from "../controllers/search.controllers";

const router = express.Router();

router.get("/autocomplete", SearchController.autocomplete);

export default router;