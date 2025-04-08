import express from "express";
import { checkAuth } from "../middlewares/auth.middleware";
import * as LearningDataController from "../controllers/learningAnalysis.controllers";

const router = express.Router();

router
  .route("/")
  .post(checkAuth, LearningDataController.createAction)
  .get(checkAuth, LearningDataController.getAllActions);

router
  .route("/userId/:id") //Penso non abbia senso tenere quelle singole no?
  .get(checkAuth, LearningDataController.getActionByUserId);

router
  .route("/userIds/:ids")
  .get(checkAuth, LearningDataController.getActionsByUserIds);

router
  .route("/actionType/:id")
  .get(checkAuth, LearningDataController.getActionByActionType);

router
  .route("/actionTypes/:ids")
  .get(checkAuth, LearningDataController.getActionsByActionTypes);

router
  .route("/zoneId/:id")
  .get(checkAuth, LearningDataController.getActionByZoneId);

router
  .route("/zoneIds/:ids")
  .get(checkAuth, LearningDataController.getActionsByZoneIds);

router
  .route("/platform/:id")
  .get(checkAuth, LearningDataController.getActionByPlatform);

router
  .route("/platforms/:ids")
  .get(checkAuth, LearningDataController.getActionsByPlatforms);

router
  .route("/flowId/:id")
  .get(checkAuth, LearningDataController.getActionByFlowId);

router
  .route("/flowIds/:ids")
  .get(checkAuth, LearningDataController.getActionsByFlowIds);

router
  .route("/getUserLastLogIn/:id")
  .get(checkAuth, LearningDataController.getUserLastLogIn);

router
  .route("/filters") //esempio: http://localhost:5000/api/learningAnalytics/filters?userId=user1&startDate=2024-12-10
  .get(checkAuth, LearningDataController.getActionsByFilters);

router
  .route("/calcTimeOnTool") //esempio: http://localhost:5000/api/learningAnalytics/calcTimeOnTool?userId=user1&platform=WebApp
  .get(checkAuth, LearningDataController.calculateTimeOnTool);

router
  .route("/calcNodeTimeByUserId/:id")
  .get(checkAuth, LearningDataController.calculateNodeTimeByUserId);

router
  .route("/calcGradeMetrics") //esempio: http://localhost:5000/api/learningAnalytics/calcGradeMetrics?flowId=flow1
  .get(checkAuth, LearningDataController.calculateGradeMetrics);

router
  .route("/getGradeByUserId") 
  .get(checkAuth, LearningDataController.getGradeByUserId);

router    
  .route("/calcQuizMetrics")  //esempio: http://localhost:5000/api/learningAnalytics/calcQuizMetrics?flowId=flow1&nodeId=node3
  .get(checkAuth, LearningDataController.calculateQuizMetrics);

  router  
  .route("/calcLPQuizMetrics")  //esempio: http://localhost:5000/api/learningAnalytics/calcLPQuizMetrics?flowId=flow1
  .get(checkAuth, LearningDataController.calculateLPQuizMetrics);

export default router;