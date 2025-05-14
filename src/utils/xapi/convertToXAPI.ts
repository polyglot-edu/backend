import { UserAction } from "../../types/LearningData";
import * as ActionTypes from "../../types/LearningData";
import { XAPIStatement } from "./XAPITypes";

import { convertSubmitAnswer } from "./convertFunctions/convertSubmitAnswer";
//import { convertGradeLP } from "./converters/convertGradeLP";
// altri import...

export function convertToXAPI(action: UserAction): XAPIStatement | null {
  switch (action.actionType) {
    case "SubmitAnswer":
      return convertSubmitAnswer(action as ActionTypes.SubmitAnswerAction);
//    case "GradeLP":
//      return convertGradeLP(action);
    // altri case...
    default:
      console.warn(`No XAPI converter for action type: ${action.actionType}`);
      return null;
  }
}
