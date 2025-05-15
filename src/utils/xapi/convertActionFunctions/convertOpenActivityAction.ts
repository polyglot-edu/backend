import { OpenActivityAction } from "../../../types/LearningData";
import { XAPIStatement } from "../XAPITypes";

export function convertOpenActivityAction(action: OpenActivityAction): XAPIStatement {
  const {
    userId,
    timestamp,
    platform,
    zoneId,
    action: {
      flowId,
      nodeId,
      activity
    }
  } = action;

  return {
    actor: {
      userId,
      name: userId,
      mbox: `mailto:${userId}@polyglot.dev`,
    },
    verb: {
      id: "http://adlnet.gov/expapi/verbs/launched", // launched non è parte del core standard ma generalmente accettato, generico. 
      // Alternative sono "attempted" usato per indicare che utente un'attivitò di apprendimento o interazione, solitamente usato per quiz o attività,
      //  oppure "experienced" usato per quando di guarda, legge  o esplora un contenuto
      display: { "en-US": "launched" },
    },
    object: {
      id: `https://polyglot.dev/flows/${flowId}/nodes/${nodeId}`,
      definition: {
        name: { "en-US": `${activity} ${nodeId}` },
        description: {
          "en-US": `Opened ${activity} activity in flow ${flowId}`,
        },
        extensions: {
          "https://polyglot.dev/xapi/activityType": activity
        }
      }
    },
    context: {
      platform,
      extensions: {
        "https://polyglot.dev/xapi/zoneId": zoneId,
      },
    },
    timestamp: timestamp.toISOString(),
    metadata: {
      contentId: flowId,
    },
  };
}
