import { PolyglotNode } from "../../types";
import { ChallengeContent, ChallengeSetup, zip } from "./Node";

//LessonTextNodeData Execution block   
export type LessonTextNodeData = {
text: string;
};

export type LessonTextNode = PolyglotNode & {
type: 'lessonTextNode';
data: LessonTextNodeData;
};

function lessonTextNodeExecution(node:PolyglotNode){
const oldData = node.data as LessonTextNodeData;

console.log('aaaaaaaaaaaaa');
console.log(node);
console.log('aaaaaaaaaaaaa');
const challengeSetup: ChallengeSetup[] = [];
const challengeContent: ChallengeContent[] = [
    {
    type: 'markdown',
    content: oldData.text,
    },
];

return {
    ...node,
    runtimeData: {
    challengeSetup,
    challengeContent,
    },
};}

//readMaterialNode Execution block
export type readMaterialNodeData = {
    text: string;
    link: string;
};
  
export type readMaterialNode = PolyglotNode & {
    type: 'readMaterialNode';
    data: readMaterialNodeData;
};

function readMaterialNodeExecution(node:PolyglotNode){
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

//closeEndedQuestionNode Execution block
export type closeEndedQuestionNodeData = {
    question: string;
    correctAnswers: string[];
    };
    
    export type closeEndedQuestionNode = PolyglotNode & {
    type: 'readMaterialNode';
    data: closeEndedQuestionNodeData;
    };

    function closeEndedQuestionNodeExecution(node:PolyglotNode){
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

//MultipleChoiceQuestionNodeData Execution block    
export type MultipleChoiceQuestionNodeData = {
    question: string;
    choices: string[];
    isChoiceCorrect: boolean[];
  };
  
function multipleChoiceQuestionNodeExecution(node:PolyglotNode){
    const specificData = node.data as MultipleChoiceQuestionNodeData;
    const data = {
        ...specificData,
        correctAnswers: zip(specificData?.choices, specificData?.isChoiceCorrect).reduce(
        (acc, { first, second }) => {
            if (second) {
            acc.push(first);
            }
            return acc;
        },
        [] as string[]
        ),
    };

    return {
        ...node,
        data,
        runtimeData: {specificData
        },
};}

export function webAppExecution(node:PolyglotNode){
    console.log('webApp execution run');
    if(node?.type=="multipleChoiceQuestionNode") return multipleChoiceQuestionNodeExecution(node);
    if(node?.type=="lessonTextNode") {console.log('lessonText'); return lessonTextNodeExecution(node);}
    if(node?.type=="closeEndedQuestionNode") return closeEndedQuestionNodeExecution(node);
    if(node?.type=="ReadMaterialNode") return readMaterialNodeExecution(node);
    return null;
}