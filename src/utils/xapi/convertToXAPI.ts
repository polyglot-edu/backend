import { UserAction } from "../../types/LearningData";
import * as ActionTypes from "../../types/LearningData";
import { XAPIStatement } from "./XAPITypes";

import { convertSubmitAnswerAction } from "./convertActionFunctions/convertSubmitAnswerAction";
import { convertCompleteLPAction } from "./convertActionFunctions/convertCompleteLPAction";
import { PolyglotNode } from "../../types";
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
- SubmitAnswerAction          TO FIX
- CompleteLPAction            DONE
- LogIn / LogOutToPlyGloT
- Open / CloseActivityAction
MID PRIO
- Open / CloseToolAction
- GradeLPAction 

*/

export const dataFactory: Record<string, (values: PolyglotNode) => any> = { //dai nodo e ritorna struttura dati come l'abbiamo fatto noi, da spostare in submit
  OpenQuestionNode: (values) => ({
    question: values.data.question,
    material: values.data.material,
    possibleAnswer: values.data.possibleAnswer,
  }),
  closeEndedQuestionNode: (values) => ({
    question: values.assignment + ' ' + values.plus,
    correctAnswers: values.solutions,
    isAnswerCorrect: [],
  }),
  TrueFalseNode: (values) => {
    const solutions = values.solutions.map((s) => {
      const splitIndex = s.indexOf('. ');
      return splitIndex !== -1 ? s.slice(splitIndex + 2) : s;
    });
    const answers = [
      ...solutions,
      ...values.distractors,
      ...values.easily_discardable_distractors,
    ].filter((statement) => statement !== 'empty');
    const shuffleAnswers = shuffleArray(answers);
    const isAnswerCorrect = new Array(shuffleAnswers.length).fill(false);
    shuffleAnswers.forEach((value, index) => {
      if (values.solutions.includes(value)) isAnswerCorrect[index] = true;
    });
    return {
      question: values.assignment,
      choices: shuffleAnswers,
      isChoiceCorrect: isAnswerCorrect,
    };
  },
  multipleChoiceQuestionNode: (values) => {
    const answers = [
      ...values.solutions,
      ...values.distractors,
      ...values.easily_discardable_distractors,
    ].filter((statement) => statement !== 'empty');
    const shuffleAnswers = shuffleArray(answers);
    const isAnswerCorrect = new Array(shuffleAnswers.length).fill(false);
    shuffleAnswers.forEach((value, index) => {
      if (values.solutions.includes(value)) isAnswerCorrect[index] = true;
    });
    return {
      question: values.assignment,
      choices: shuffleAnswers,
      isChoiceCorrect: isAnswerCorrect,
    };
  },
};
