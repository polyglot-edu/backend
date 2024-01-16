import { PolyglotNode } from "../../types";
import { ChallengeContent, ChallengeSetup, LessonTextNodeData, MultipleChoiceQuestionNodeData, TrueFalseNodeData, WebAppContent, WebAppSetup, closeEndedQuestionNodeData, textLinkNodeData as TextLinkNodeData, zip } from "./Node";

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
  const data = node.data as TextLinkNodeData;

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

//trueFalseNodeData Execution block  
function trueFalseNodeExecution(node:PolyglotNode){
  const data = node.data as TrueFalseNodeData;
  const webAppSetup: WebAppSetup[] = [];
  const webAppContent: WebAppContent[] = [{content: data, type: 'TrueFalse'}];    

  return {
    webAppSetup, 
    webAppContent,        
  };
}

//watchVideoNodeData Execution block  
function watchVideoNodeExecution(node:PolyglotNode){
  const data = node.data as TextLinkNodeData;
  const webAppSetup: WebAppSetup[] = [];
  const webAppContent: WebAppContent[] = [{content: data, type: 'WatchVideo'}];    

  return {
    webAppSetup, 
    webAppContent,        
  };
}

function summaryNodeExecution(node:PolyglotNode){
  const data = node.data as TextLinkNodeData;
  const webAppSetup: WebAppSetup[] = [];
  const webAppContent: WebAppContent[] = [{content: data, type: 'Summary'}];    

  return {
    webAppSetup, 
    webAppContent,        
  };
}

function notImplementedNodeExecution(node:PolyglotNode){

  const webAppSetup: WebAppSetup[] = [];
  const webAppContent: WebAppContent[] = [{content: "This node type is not implemented for WebApp execution, go to: "+node.platform, type: node.type}];    

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
  let webAppSpecifics:webAppSpecifics={webAppSetup:[],webAppContent:[]};
    switch (node?.type){
      case "multipleChoiceQuestionNode": {
        webAppSpecifics=multipleChoiceQuestionNodeExecution(node);
        break;
      }
      case "lessonTextNode": {
        webAppSpecifics=lessonTextNodeExecution(node);
        break;
      }
      case "closeEndedQuestionNode":{
        webAppSpecifics=closeEndedQuestionNodeExecution(node);
        break;
      }
      case "ReadMaterialNode": {
        webAppSpecifics=readMaterialNodeExecution(node);
        break;
      }
      case "TrueFalseNode": {
        webAppSpecifics=trueFalseNodeExecution(node);
        break;
      }
      case "WatchVideoNode": {
        webAppSpecifics=watchVideoNodeExecution(node);
        break;
      }
      case "SummaryNode": {
        webAppSpecifics=summaryNodeExecution(node);
        break;
      }
      default:{      
        webAppSpecifics = notImplementedNodeExecution(node);
      }
    }

  return {...node,
  runtimeData: {
    challengeSetup,
    challengeContent,
    webAppSpecifics
  },
  }
}
