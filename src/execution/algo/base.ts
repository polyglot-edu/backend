import { PolyglotEdge, PolyglotFlow, PolyglotNode, PolyglotNodeValidation } from "../../types";
import { ExecCtx, ExecCtxNodeInfo } from "../execution";

export class DistrubutionAlgorithm {
  protected ctx: ExecCtx;
  protected flow?: PolyglotFlow;

  constructor(_ctx: ExecCtx) {
    this.ctx = _ctx;
  }

  public setFlow(_flow: PolyglotFlow) {
    this.flow = _flow;
  }

  public getNextExercise(possibleNextNodes: PolyglotNode[]) : {execNodeInfo: ExecCtxNodeInfo, node: PolyglotNodeValidation | null} {
    throw Error("Not Implemented!")
  }
}

export class AbstractAlgorithm {
  protected ctx: ExecCtx;

  constructor(_ctx: ExecCtx) {
    this.ctx = _ctx;
  }

  public getNextExercise(execNodeInfo: ExecCtxNodeInfo, currentNode: PolyglotNode, satisfiedEdges : PolyglotEdge[] | null) : Promise<{execNodeInfo: ExecCtxNodeInfo, node: PolyglotNodeValidation | null}> {
    throw Error("Not implemented")
  }
}