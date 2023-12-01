import { PolyglotNode } from "../../types";
import { ChallengeContent, ChallengeSetup } from "./Node";

export type readMaterialNodeData = {
    text: string;
    link: string;
  };
  
  export type readMaterialNode = PolyglotNode & {
    type: 'readMaterialNode';
    data: readMaterialNodeData;
  };

  export function readMaterialNodeExecution(node:PolyglotNode){
    const oldData = node.data as readMaterialNodeData;

    const challengeSetup: ChallengeSetup[] = [];
    const challengeContent: ChallengeContent[] = [
      {
        type: 'markdown',
        content: oldData.text,
      },
      {
        type: 'markdown',
        content: 'Run this link: ' + oldData.link,
      },
    ];

    return {
      ...node,
      runtimeData: {
        challengeSetup,
        challengeContent,
      },
    };}
