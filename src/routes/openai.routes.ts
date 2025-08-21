import express from "express";
import multer from "multer";
import * as OpenAiControllers from "../controllers/openai.controllers";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/genRes", OpenAiControllers.genResource);
router.post("/genGraph", OpenAiControllers.genConceptMap);
//generativeAPI
router.post(
  "/MaterialAnalyser",
  upload.single("file"),
  OpenAiControllers.analyseMaterial,
);
router.post("/LearningObjectiveGenerator", OpenAiControllers.generateLO); //outdated
router.post("/MaterialGenerator", OpenAiControllers.generateMaterial);
router.post("/Summarizer", OpenAiControllers.summarize);
router.post("/ActivityGenerator", OpenAiControllers.activityGenerator);
router.post("/PlanLesson", OpenAiControllers.planLesson);
router.post("/DefineSyllabus", OpenAiControllers.generateSyllabus);
router.post("/PlanCourse", OpenAiControllers.planCourse);
router.post("/Corrector", OpenAiControllers.corrector);

router
  .route("/chat/teacher/:id")
  .get(OpenAiControllers.getChatTeacher)
  .post(OpenAiControllers.chatTeacher)
  .put(OpenAiControllers.resetChatTeacher);
router.post(
  "/chat/uploadFile/:id",
  upload.single("file"),
  OpenAiControllers.chatFileUpload,
);

export default router;
