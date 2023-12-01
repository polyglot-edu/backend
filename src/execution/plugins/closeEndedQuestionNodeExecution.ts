import { PolyglotNode } from "../../types";
import { ChallengeContent, ChallengeSetup } from "./Node";

export type closeEndedQuestionNodeData = {
    question: string;
    correctAnswers: string[];
  };
  
  export type closeEndedQuestionNode = PolyglotNode & {
    type: 'readMaterialNode';
    data: closeEndedQuestionNodeData;
  };

  export function closeEndedQuestionNodeExecution(node:PolyglotNode){
    const oldData = node.data as closeEndedQuestionNodeData;

    const challengeSetup: ChallengeSetup[] = [];
    const challengeContent: ChallengeContent[] = [
      {
        type: 'markdown',
        content: oldData?.question,
        priority: 0,
      },
      {
        type: 'html',
        content: '',
        priority: 1,
      },
    ];

    return {
      ...node,
      runtimeData: {
        challengeSetup,
        challengeContent,
      },
    };
}
