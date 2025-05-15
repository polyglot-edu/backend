import { PolyglotNodeModel } from "../../../models/node.model";
import User from "../../../models/user.model";
import { SubmitAnswerAction } from "../../../types/LearningData";
import { XAPIStatement } from "../XAPITypes";

export async function convertSubmitAnswerAction(action: SubmitAnswerAction): Promise<XAPIStatement> {
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

  const user = await User.findById(userId);
    if(!user){throw new Error}  //Gestione errore in caso di no user, da fixare
    
  const node = await PolyglotNodeModel.findById(nodeId);
    if(!node){throw new Error}  //Gestione errore in caso di no user, da fixare

 return {
    actor: {
      userId,
      name: user?.username,
      mbox: `mailto:${userId}@polyglot.dev`,
    },
    verb: {
      id: "http://adlnet.gov/expapi/verbs/answered",
      display: { "en-US": "answered" },
    },
    object: {
      id: `https://polyglot.dev/flows/${flowId}/nodes/${nodeId}`,
      definition: {
        name: { "en-US": `Exercise ${node.title}` }, //to fix!
        description: {
          "en-US": `Exercise of type ${node.description} in flow ${flowId}`, //to fix!
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

//perchè manca la parte delle possibili risposte al quiz? da fixare!

export const dataFactory: Record<string, (values: NodeType) => any> = {
  OpenQuestionNode: (values) => ({
    question: values.data.question,
    material: values.data.material,
    possibleAnswer: values.data.possibleAnswer,
  }),
  closeEndedQuestionNode: (values) => ({
    question: values.question,
    correctAnswers: values.correctAnswers,
  }),
  TrueFalseNode: (values) => {
    return {
      question:  values.data.question,
      choices:  values.data.choices,
      isChoiceCorrect:  values.data.isChoiceCorrect,
    };
  },
  multipleChoiceQuestionNode: (values) => {
    return {
      question: values.data.question,
      choices: values.data.choices,
      isChoiceCorrect: values.data.isChoiceCorrect,
    };
  },
};

// Per usarlo: const i= dataFactory[typeNode]?.(node)