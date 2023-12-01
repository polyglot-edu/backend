import { PolyglotNode } from "../../types";
import { ChallengeContent, ChallengeSetup } from "./Node";

export type LessonTextNodeData = {
    text: string;
  };
  
  export type LessonTextNode = PolyglotNode & {
    type: 'lessonTextNode';
    data: LessonTextNodeData;
  };

  export function lessonTextNodeExecution(node:PolyglotNode){
    const oldData = node.data as LessonTextNodeData;

    const challengeSetup: ChallengeSetup[] = [];
    const challengeContent: ChallengeContent[] = [
      {
        type: 'markdown',
        content: oldData.text,
      },
    ];
    console.log({
        ...node,
        runtimeData: {
          challengeSetup,
          challengeContent,
        },});

    return {
      ...node,
      runtimeData: {
        challengeSetup,
        challengeContent,
      },
    };}
