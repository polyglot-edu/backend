import { PolyglotNode } from "../../types";
import { ChallengeContent, ChallengeSetup, LessonTextNodeData, MultipleChoiceQuestionNodeData, WebAppContent, WebAppSetup, closeEndedQuestionNodeData, readMaterialNodeData, zip } from "./Node";

//LessonTextNodeData Execution block

function lessonTextNodeExecution(node:PolyglotNode){
const oldData = node.data as LessonTextNodeData;
const webAppSetup: WebAppSetup[] = [];
const webAppContent: WebAppContent[] = [
    {
    content: oldData.text,
    },
];

return {
    ...node,
    runtimeData: {
    webAppSetup,
    webAppContent,
    },
};}

//readMaterialNode Execution block

function readMaterialNodeExecution(node:PolyglotNode){
    const oldData = node.data as readMaterialNodeData;

    const webAppSetup: WebAppSetup[] = [];
    const webAppContent: WebAppContent[] = [
      {
        content: oldData.text,
      },
      {
        content: 'Run this link: ' + oldData.link,
      },
    ];

    return {
      ...node,
      runtimeData: {
        webAppSetup,
        webAppContent,
      },
    };}

//closeEndedQuestionNode Execution block 
    function closeEndedQuestionNodeExecution(node:PolyglotNode){
    const oldData = node.data as closeEndedQuestionNodeData;

    const webAppSetup: WebAppSetup[] = [];
    const webAppContent: WebAppContent[] = [
        {
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
        webAppSetup,
        webAppContent,
        },
    };
}

//MultipleChoiceQuestionNodeData Execution block  
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
    const webAppSetup: WebAppSetup[] = [];
    const webAppContent: WebAppContent[] = [];    

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