import { PolyglotNode } from "../../types";
import { ChallengeContent, ChallengeSetup, LessonTextNodeData, MultipleChoiceQuestionNodeData, CloseEndedQuestionNodeData, textLinkNodeData, zip, CodingQuestionNodeData } from "./Node";

type vsCodeSpecifics={challengeSetup: ChallengeSetup[], challengeContent:ChallengeContent[]};

//LessonTextNodeData Execution block   
function lessonTextNodeExecution(node:PolyglotNode){
    const oldData = node.data as LessonTextNodeData;

    const challengeSetup: ChallengeSetup[] = [];
    const challengeContent: ChallengeContent[] = [
        {
        type: 'markdown',
        content: oldData.text,
        },
    ];
    return {
        challengeSetup,
        challengeContent,
    };
}

//readMaterialNode Execution block
function readMaterialNodeExecution(node:PolyglotNode){
    const oldData = node.data as textLinkNodeData;

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
        challengeSetup,
        challengeContent,        
    };
}

//closeEndedQuestionNode Execution block
function closeEndedQuestionNodeExecution(node:PolyglotNode){
    const oldData = node.data as CloseEndedQuestionNodeData;

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
        challengeSetup,
        challengeContent,        
    };
}

//MultipleChoiceQuestionNodeData Execution block    
function multipleChoiceQuestionNodeExecution(node:PolyglotNode){
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
        challengeSetup,
        challengeContent,
    };
}

function codingQuestionNodeExecution(node:PolyglotNode){
    const data = node.data as CodingQuestionNodeData;

    const challengeSetup: ChallengeSetup[] = [];
    const challengeContent: ChallengeContent[] = [
        {
        type: 'markdown',
        content: data?.question,
        priority: 0,
        },
        {
        type: data?.language,
        content: data?.codeTemplate,
        priority: 1,
        },
    ];

    return {
        challengeSetup,
        challengeContent,      
    };
}
//notImplementedNode Execution block   
function notImplementedNodeExecution(node:PolyglotNode){
    const challengeSetup: ChallengeSetup[] = [];
    const challengeContent: ChallengeContent[] = [
        {
        type: 'markdown',
        content: "This node type is not implemented for vsCode execution",
        },
    ];
    return {
        challengeSetup,
        challengeContent,
    };
}

export function vsCodeExecution(node:PolyglotNode){
    
    let vsCodeSpecifics:vsCodeSpecifics={challengeSetup:[],challengeContent:[]};

    if(node?.type=="multipleChoiceQuestionNode") vsCodeSpecifics = multipleChoiceQuestionNodeExecution(node);
    if(node?.type=="lessonTextNode") vsCodeSpecifics=lessonTextNodeExecution(node);
    if(node?.type=="closeEndedQuestionNode") vsCodeSpecifics=closeEndedQuestionNodeExecution(node);
    if(node?.type=="ReadMaterialNode") vsCodeSpecifics=readMaterialNodeExecution(node);
    if(node?.type=="codingQuestionNode") vsCodeSpecifics=codingQuestionNodeExecution(node);
    if(node?.type=="TrueFalseNode"||node?.type=="WatchVideoNode"||node?.type=="SummaryNode"||node?.type=="OpenQuestionNode") vsCodeSpecifics = notImplementedNodeExecution(node);
    
    return {...node,
    runtimeData: vsCodeSpecifics,
    }
}