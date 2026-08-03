import express from "express";
import { checkAuth } from "../middlewares/auth.middleware";
import { requireMaintenanceSecret } from "../middlewares/maintenance.middleware";
import * as CourseController from "../controllers/course.controllers";

const router = express.Router();
// cambiare tutto con flow

// Destructive maintenance route: gated by MAINTENANCE_SECRET, not by a password
// in the URL. MUST stay above "/:id", which would otherwise match it.
router
  .route("/serverClean")
  .delete(requireMaintenanceSecret, checkAuth, CourseController.serverCleanUp);

router
  .route("/:id")
  .delete(checkAuth, CourseController.deleteCourse)
  .get(checkAuth, CourseController.getCoursesById);

router
  .route("/")
  .post(checkAuth, CourseController.createCourse)
  .put(checkAuth, CourseController.updateCourse)
  .get(checkAuth, CourseController.getCourses);

router.route("/json").post(checkAuth, CourseController.createCourseJson);

// get enrolled courses
export default router;
