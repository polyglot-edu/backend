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
    return {
        ...node,
        runtimeData: {
        challengeSetup,
        challengeContent,
        },
    };
}

//readMaterialNode Execution block
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
    };
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
    console.log("checkpoint");
    console.log(data.correctAnswers);
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
    if(node?.type=="multipleChoiceQuestionNode") return multipleChoiceQuestionNodeExecution(node);
    if(node?.type=="lessonTextNode") {console.log('lessonText'); return lessonTextNodeExecution(node);}
    if(node?.type=="closeEndedQuestionNode") return closeEndedQuestionNodeExecution(node);
    if(node?.type=="ReadMaterialNode") {console.log('readMaterial'); return readMaterialNodeExecution(node);}
    return null;
}