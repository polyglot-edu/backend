import { CompleteLPAction } from "../../../types/LearningData";
import { XAPIStatement } from "../XAPITypes";

export function convertCompleteLPAction(action: CompleteLPAction): XAPIStatement {
  const {
    userId,
    timestamp,
    platform,
    zoneId,
    action: {
      flowId
    }
  } = action;

  return {
    actor: {
      userId,
      name: userId,
      mbox: `mailto:${userId}@polyglot.dev`,
    },
    verb: {
      id: "http://adlnet.gov/expapi/verbs/completed",
      display: { "en-US": "completed" },
    },
    object: {
      id: `https://polyglot.dev/flows/${flowId}`,
      definition: {
        name: { "en-US": `Learning Path ${flowId}` }, //to fix!
        description: {
          "en-US": `Completion of Learning Path with ID ${flowId}`, //to fix!
        }
      },
    },
    context: {
      platform,
      extensions: {
        "https://polyglot.dev/xapi/zoneId": zoneId, //valutare
      },
    },
    timestamp: timestamp.toISOString(),
    metadata: { //Qualcosa da aggiungere?
      contentId: flowId,    //same
    },
  };
}
