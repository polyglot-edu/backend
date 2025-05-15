import { SubmitAnswerAction } from "../../../types/LearningData";
import { XAPIStatement } from "../XAPITypes";

export function convertSubmitAnswerAction(action: SubmitAnswerAction): XAPIStatement {
  const {   //destructuring
    userId,
    timestamp,
    platform,
    zoneId,
    action: {
      flowId,
      nodeId,
      exerciseType,
      answer,
      result
    }
  } = action;

  const isCorrect = result === "correct";

 return {
    actor: {
      userId,
      name: userId,
      mbox: `mailto:${userId}@polyglot.dev`,
    },
    verb: {
      id: "http://adlnet.gov/expapi/verbs/answered",
      display: { "en-US": "answered" },
    },
    object: {
      id: `https://polyglot.dev/flows/${flowId}/nodes/${nodeId}`,
      definition: {
        name: { "en-US": `Exercise ${nodeId}` }, //to fix!
        description: {
          "en-US": `Exercise of type ${exerciseType} in flow ${flowId}`, //to fix!
        },
        interactionType: exerciseType,
        extensions: {
          "https://polyglot.dev/xapi/exerciseType": exerciseType,
        },
      },
    },
    result: {
      success: isCorrect,
      response: answer,
      score: {
        raw: isCorrect ? 1 : 0,
        min: 0,
        max: 1,
        scaled: isCorrect ? 1 : 0,
      },
    },
    context: {
      platform,
      extensions: { //additional context
        "https://polyglot.dev/xapi/zoneId": zoneId, //valuta se lasciare così
      },
    },
    timestamp: timestamp.toISOString(),  
    metadata: { //Da decidere cosa metterci
      contentId: flowId, //valuta se lasciare così
    },
  };
}
