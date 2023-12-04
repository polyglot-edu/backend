//idea: qui mappo i node types
// -> ognuno fa una rispettiva richiama passando 
//  la piattaforma così da specificarne l'esecuzione
//

import { PolyglotNode } from "../../types";
import { vsCodeExecution,
    webAppExecution,} from "./index";

export function nodeTypeRedirect(node:PolyglotNode|null){
    if (node?.platform=='VSCode') return vsCodeExecution(node);
//    if(node?.type=="multipleChoiceQuestionNode") return multipleChoiceQuestionNodeExecution(node);
//    if(node?.type=="lessonTextNode") return lessonTextNodeExecution(node);    
//    if(node?.type=="closeEndedQuestionNode") return closeEndedQuestionNodeExecution(node);
//    if(node?.type=="ReadMaterialNode") return readMaterialNodeExecution(node);
    if (node?.platform=='WebApp') return webAppExecution(node);
    console.log('not execution run');
    return node;
}
