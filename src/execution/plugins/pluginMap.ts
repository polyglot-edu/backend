import { PolyglotNode } from "../../types";
import { vsCodeExecution,
    webAppExecution,} from "./index";

export function nodeTypeExecution(node:PolyglotNode|null, ctx:string){
    console.log("bhoo "+ctx);
    if (node?.platform=='VSCode') return vsCodeExecution(node);
    if (node?.platform=='WebApp') return webAppExecution(node,ctx);
    console.log('not execution run');
    return node;
}
