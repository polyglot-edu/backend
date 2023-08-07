import { ExecCtx } from "../execution";
import { AbstractAlgorithm, DistrubutionAlgorithm } from "./base";
import { ManualAA } from "./fragmentAlgorithm";
import { RandomDA } from "./randomExecution";

export type AlgoMap = {
  [key: string]: typeof AbstractAlgorithm
}

export type PathSelectorMap = {
  [key: string]: typeof DistrubutionAlgorithm
}


export const algoMap: AlgoMap = {
  "Manual abstract algorithm": ManualAA,
}

export const pathSelectorMap: PathSelectorMap = {
  "Random Execution": RandomDA
}

export const getAbstractAlgorithm = (algo: string, ctx: ExecCtx) => {
  if (!algoMap[algo] || typeof algoMap[algo] !== typeof AbstractAlgorithm ) throw Error("Abstract Algorithm not set");

  return new algoMap[algo](ctx);
}

export const getPathSelectorAlgorithm = (algo: string, ctx: ExecCtx) => {
  if (!pathSelectorMap[algo] || typeof pathSelectorMap[algo] !== typeof DistrubutionAlgorithm ) throw Error("Path Selector Algorithm not set");

  return new pathSelectorMap[algo](ctx);
}