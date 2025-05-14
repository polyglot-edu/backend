import { convertToXAPI } from "../src/utils/xapi/convertToXAPI";
import * as ActionTypes from "../src/types/LearningData";
//import { SubmitAnswerAction } from "../src/types/LearningData";

const testAction: ActionTypes.SubmitAnswerAction = {
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

const result = convertToXAPI(testAction);

//console.log("Test result:", result);  
console.dir(result, { depth: null, colors: true});  //Per testare: npx ts-node tests/testConvertToXAPI.ts
