import { UserAction } from "../../types/LearningData";
import * as ActionTypes from "../../types/LearningData";
import { XAPIStatement } from "./XAPITypes";

import { convertSubmitAnswerAction } from "./convertFunctions/convertSubmitAnswerAction";
import { convertCompleteLPAction } from "./convertFunctions/convertCompleteLPAction";
// altri import...

export function convertToXAPI(action: UserAction): XAPIStatement | null {
  switch (action.actionType) {
    case "submit_answer":
      return convertSubmitAnswerAction(action as ActionTypes.SubmitAnswerAction);
    case "complete_LP":
      return convertCompleteLPAction(action as ActionTypes.CompleteLPAction);
    // altri case...
    default:
      console.warn(`Error: No XAPI converter for action type: ${action.actionType}`);
      return null;
  }
}

/* ACTIONS TO CONVERT
HIGH PRIO
- SubmitAnswerAction DONE
- CompleteLPAction
- LogIn / LogOutToPlyGloT
- Open / CloseActivityAction
MID PRIO
- Open / CloseToolAction
- GradeLPAction 

*/