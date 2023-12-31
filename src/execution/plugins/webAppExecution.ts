import { PolyglotNode } from "../../types";
import { ChallengeContent, ChallengeSetup, LessonTextNodeData, MultipleChoiceQuestionNodeData, WebAppContent, WebAppSetup, closeEndedQuestionNodeData, readMaterialNodeData, zip } from "./Node";

type webAppSpecifics={webAppSetup: WebAppSetup[], webAppContent:WebAppContent[]};

//LessonTextNodeData Execution block

function lessonTextNodeExecution(node:PolyglotNode){
  const data = node.data as LessonTextNodeData;
  const webAppSetup: WebAppSetup[] = [];
  
  const webAppContent: WebAppContent[] = [{content: data, type: 'LessonText'}];    

  return {
    webAppSetup, 
    webAppContent,        
};
}

//readMaterialNode Execution block

function readMaterialNodeExecution(node:PolyglotNode){
  const data = node.data as readMaterialNodeData;

  const webAppSetup: WebAppSetup[] = [];
  
  const webAppContent: WebAppContent[] = [{content: data, type: 'ReadMaterial'}];    


  return {
    webAppSetup, 
    webAppContent,        
  };
}

//closeEndedQuestionNode Execution block 
function closeEndedQuestionNodeExecution(node:PolyglotNode){
  const data = node.data as closeEndedQuestionNodeData;

  const webAppSetup: WebAppSetup[] = [];
  
  const webAppContent: WebAppContent[] = [{content: data, type: 'CloseEndedQuestion'}];    

  return {
    webAppSetup, 
    webAppContent,        
  };
}

//MultipleChoiceQuestionNodeData Execution block  
function multipleChoiceQuestionNodeExecution(node:PolyglotNode){
  const data = node.data as MultipleChoiceQuestionNodeData;
  const webAppSetup: WebAppSetup[] = [];
  const webAppContent: WebAppContent[] = [{content: data, type: 'MultChoiceQuestion'}];    

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
  let webAppSpecifics:webAppSpecifics={webAppSetup:[],webAppContent:[],};
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
