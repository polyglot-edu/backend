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
    webAppSetup, 
    webAppContent,        
};
}

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
    webAppSetup, 
    webAppContent,        
  };
}

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
    webAppSetup, 
    webAppContent,        
  };
}

//MultipleChoiceQuestionNodeData Execution block  
function multipleChoiceQuestionNodeExecution(node:PolyglotNode){
  const data = node.data as MultipleChoiceQuestionNodeData;
  const webAppSetup: WebAppSetup[] = [];
  const webAppContent: WebAppContent = {content: data, type: 'MultChoiceQuestion'};    

  return {
    webAppSetup, 
    webAppContent,        
  };
}

export function webAppExecution(node:PolyglotNode){
  const challengeSetup: ChallengeSetup[] = [];
  const challengeContent : ChallengeContent [] = [
      {
      type: 'markdown',
      content: 'This node need to be executed in WebApp: https://polyglot-api.polyglot-edu.com/api/execution/next/'+node._id,
      },
  ];
  let webAppSpecifics;
  if(node?.type=="multipleChoiceQuestionNode")  webAppSpecifics=multipleChoiceQuestionNodeExecution(node);
  if(node?.type=="lessonTextNode") webAppSpecifics=lessonTextNodeExecution(node);
  if(node?.type=="closeEndedQuestionNode") webAppSpecifics=closeEndedQuestionNodeExecution(node);
  if(node?.type=="ReadMaterialNode") webAppSpecifics=readMaterialNodeExecution(node);
  return {...node,
  runtimeData: {
    challengeSetup,
    challengeContent,
    webAppSpecifics
  },
  }
}
