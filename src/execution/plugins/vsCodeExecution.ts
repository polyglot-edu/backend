import { PolyglotNode } from "../../types";
import { ChallengeContent, ChallengeSetup, zip } from "./Node";

//readMaterialNode Execution block
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

//closeEndedQuestionNode Execution block
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

//MultipleChoiceQuestionNodeData Execution block    
export type MultipleChoiceQuestionNodeData = {
    question: string;
    choices: string[];
    isChoiceCorrect: boolean[];
  };
  
export function multipleChoiceQuestionNodeExecution(node:PolyglotNode){
    const oldData = node.data as MultipleChoiceQuestionNodeData;

    const data = {
        ...oldData,
        correctAnswers: zip(oldData?.choices, oldData?.isChoiceCorrect).reduce(
        (acc, { first, second }) => {
            if (second) {
            acc.push(first);
            }
            return acc;
        },
        [] as string[]
        ),
    };

    const challengeSetup: ChallengeSetup[] = [
        `
    using Polyglot.Interactive;
    var kernel = Kernel.Root.FindKernelByName("multiplechoice") as MultipleChoiceKernel;
    kernel.Options = new HashSet<string> { ${data.choices
        .map((_, i) => `"${i + 1}"`)
        .join(', ')} };
    `,
    ];
    const challengeContent: ChallengeContent[] = [
        {
        type: 'multiplechoice',
        content: '',
        priority: 1,
        },
        {
        type: 'markdown',
        content:
            data.question +
            data.choices.map((value, index) => '\n' + (index + 1) + '. ' + value),
        priority: 0,
        },
    ];

    return {
        ...node,
        data,
        runtimeData: {
        challengeSetup,
        challengeContent,
        },
};}

//LessonTextNodeData Execution block   
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

return {
    ...node,
    runtimeData: {
    challengeSetup,
    challengeContent,
    },
};}

export function vsCodeExecution(node:PolyglotNode){
    console.log('vsCode execution run');
    if(node?.type=="multipleChoiceQuestionNode") return multipleChoiceQuestionNodeExecution(node);
    if(node?.type=="lessonTextNode") return lessonTextNodeExecution(node);        
    if(node?.type=="closeEndedQuestionNode") return closeEndedQuestionNodeExecution(node);
    if(node?.type=="ReadMaterialNode") return readMaterialNodeExecution(node);
    return null;
}