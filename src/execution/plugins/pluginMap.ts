//idea: qui mappo i node types
// -> ognuno fa una rispettiva richiama passando 
//  la piattaforma così da specificarne l'esecuzione
//

import { PolyglotNode } from "../../types";
import { closeEndedQuestionNodeExecution,
    readMaterialNodeExecution,
    multipleChoiceQuestionNodeExecution,
    lessonTextNodeExecution } from "./index";

const mappa={
    "multipleChoiceQuestionNode":multipleChoiceQuestionNodeExecution,
    "lessonTextNode":lessonTextNodeExecution,
    "readMaterialNode":readMaterialNodeExecution,
    "closeEndedQuestionNode":closeEndedQuestionNodeExecution,    
}

export function nodeTypeRedirect(node:PolyglotNode|null){
    
    if(node?.type=="multipleChoiceQuestionNode") return multipleChoiceQuestionNodeExecution(node);
    if(node?.type=="lessonTextNode") return lessonTextNodeExecution(node);
    /*
    if(node?.type=="closeEndedQuestionNode") return closeEndedQuestionNodeExecution(node.platform);
    if(node?.type=="ReadMaterialNode") return readMaterialNodeExecution(node.platform);*/
    return node;
}