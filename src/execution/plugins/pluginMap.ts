import { PolyglotNode } from "../../types";
import { vsCodeExecution } from "./index";

export function nodeTypeExecution(node: PolyglotNode | null, ctx: string) {
  if (node?.platform == "VSCode") return vsCodeExecution(node);
  return node;
}
