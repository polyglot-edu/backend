import express from "express";
import { checkAuth, denyApiKeyAuth } from "../middlewares/auth.middleware";
import * as ApiKeyController from "../controllers/apiKey.controllers";

const router = express.Router();

// denyApiKeyAuth on every route: key management requires a Google sign-in, so a
// leaked key cannot mint replacements for itself.
router
  .route("/")
  .get(checkAuth, denyApiKeyAuth, ApiKeyController.listApiKeys)
  .post(checkAuth, denyApiKeyAuth, ApiKeyController.createApiKey);

router
  .route("/:id")
  .delete(checkAuth, denyApiKeyAuth, ApiKeyController.revokeApiKey);

export default router;
