import express from "express";
import flowRouter from "./flows.routes";
import courseRouter from "./course.routes";
import syllabusRouter from "./syllabus.routes";
import executionRouter from "./execution.routes";
import userRouter from "./user.routes";
import fileRouter from "./file.routes";
import searchRouter from "./search.routes";
import metadataRouter from "./metadata.routes";
import openaiRouter from "./openai.routes";
import conceptRouter from "./concept.routes";
import learningRouter from "./learningAnalysis.routes";
import healthRouter from "./health.routes";
import apiKeyRouter from "./apiKey.routes";
import swaggerUi from "swagger-ui-express";
import { openApiSpec } from "../docs/openapi";
import cors from "cors";

const router = express.Router();

// Interactive API reference. The raw document is served separately so that
// codegen tooling can consume it without scraping the UI.
router.get("/api/docs.json", (_req, res) => res.json(openApiSpec));
router.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(openApiSpec as any, {
    customSiteTitle: "Polyglot API",
    swaggerOptions: { persistAuthorization: true },
  }),
);

router.use("/api/health", healthRouter);
router.use("/api/flows", flowRouter);
router.use("/api/course", courseRouter);
router.use("/api/syllabus", syllabusRouter);
router.use("/api/file", fileRouter);
router.use("/api/execution", executionRouter);
// Mounted before /api/user so the more specific prefix is matched first.
router.use("/api/user/apikeys", apiKeyRouter);
router.use("/api/user", userRouter);
router.use("/api/search", searchRouter);
router.use("/api/metadata", metadataRouter);
router.use("/api/openai", openaiRouter);
router.use("/api/concept", conceptRouter);
router.use("/api/learningAnalytics", learningRouter);

export default router;
