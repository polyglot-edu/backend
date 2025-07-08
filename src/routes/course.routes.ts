import express from "express";
import { checkAuth } from "../middlewares/auth.middleware";
import * as CourseController from "../controllers/course.controllers";

const router = express.Router();
// cambiare tutto con flow

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

router
  .route("/:password/serverClean") //API to clean the server from empty flows
  .get(CourseController.serverCleanUp);

// get enrolled courses
export default router;
