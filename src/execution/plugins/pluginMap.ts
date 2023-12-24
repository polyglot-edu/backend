import { PolyglotNode } from "../../types";
import { vsCodeExecution,
    webAppExecution,} from "./index";

export function nodeTypeExecution(node:PolyglotNode|null){
    if (node?.platform=='VSCode') return vsCodeExecution(node);
    if (node?.platform=='WebApp') return webAppExecution(node);
    console.log('not execution run');
    return node;
}
