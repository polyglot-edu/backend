import { convertToXAPI } from "../src/utils/xapi/convertToXAPI";
import * as ActionTypes from "../src/types/LearningData";
//import { SubmitAnswerAction } from "../src/types/LearningData";

const testSubmitAnswerAction: ActionTypes.SubmitAnswerAction = {
  timestamp: new Date(),
  userId: "testUserNik",
  actionType: "SubmitAnswer",
  zoneId: ActionTypes.ZoneId.WebAppZone,
  platform: ActionTypes.Platform.PolyGloT,
  action: {
    flowId: "flowtest",
    nodeId: "node2",
    exerciseType: ActionTypes.ExerciseType.MultipleChoiceQuestion,
    answer: "A",
    result: "correct",
  },
}; 

const testCompleteLPAction: ActionTypes.CompleteLPAction = {
  timestamp: new Date(),
  userId: "testUserNik",
  actionType: "complete_LP",
  zoneId: ActionTypes.ZoneId.WebAppZone,
  platform: ActionTypes.Platform.PolyGloT,
  action: {
    flowId: "flowtest",
  },
};

const result = convertToXAPI(testCompleteLPAction);

//console.log("Test result:", result);  
console.dir(result, { depth: null, colors: true});  //Per testare: npx ts-node tests/testConvertToXAPI.ts
