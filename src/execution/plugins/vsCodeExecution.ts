import { PolyglotNode } from "../../types";
import { ChallengeContent, ChallengeSetup, LessonTextNodeData, MultipleChoiceQuestionNodeData, closeEndedQuestionNodeData, readMaterialNodeData, zip } from "./Node";

//LessonTextNodeData Execution block   
function lessonTextNodeExecution(node:PolyglotNode):PolyglotNode{
    const oldData = node.data as LessonTextNodeData;

    const challengeSetup: ChallengeSetup[] = [];
    const challengeContent = [
        {
        type: 'markdown',
        content: oldData.text,
        },
    ];
    const baaaa:PolyglotNode={
        _id:node._id,
        type:node.type,
        data:node.data,
        description:node.description,
        difficulty:node.difficulty,
        platform:node.platform,
        title:node.title,
        reactFlow:node.reactFlow,
        runtimeData:{
            challengeSetup,
            challengeContent,
          }
    }
    return baaaa;
}

//readMaterialNode Execution block
function readMaterialNodeExecution(node:PolyglotNode){
    const oldData = node.data as readMaterialNodeData;

    const challengeSetup: ChallengeSetup[] = [];
    const challengeContent: ChallengeContent[] = [
      {
        type: 'markdown',
        content: 'aaaaaaaaaaaaaaa'+oldData.text,
      },
      {
        type: 'markdown',
        content: 'AAAAAAAAAAAAAAAAAARun this link: ' + oldData.link,
      },
    ];
    const baaaa:PolyglotNode={
        _id:node._id,
        type:node.type,
        data:node.data,
        description:node.description,
        difficulty:node.difficulty,
        platform:node.platform,
        title:node.title,
        reactFlow:node.reactFlow,
        runtimeData:{
            challengeSetup,
            challengeContent,
          }
    }
    return baaaa;
}

//closeEndedQuestionNode Execution block
function closeEndedQuestionNodeExecution(node:PolyglotNode):PolyglotNode{
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
function multipleChoiceQuestionNodeExecution(node:PolyglotNode):PolyglotNode{
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

export function vsCodeExecution(node:PolyglotNode){
    console.log('vsCode execution run');
    if(node?.type=="multipleChoiceQuestionNode") return multipleChoiceQuestionNodeExecution(node);
    if(node?.type=="lessonTextNode") {console.log('lessonText'); return lessonTextNodeExecution(node);}
    if(node?.type=="closeEndedQuestionNode") return closeEndedQuestionNodeExecution(node);
    if(node?.type=="ReadMaterialNode") {console.log('readMaterial'); return readMaterialNodeExecution(node);}
    return null;
}