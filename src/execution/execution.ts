import { GameEngine, SmartCampusGameEngine } from "../gamification/gamification";
import { abstractNodeSchema } from "../models/node.model";
import { PolyglotEdge, PolyglotFlow, PolyglotNode, PolyglotNodeValidation } from "../types";
import { AbstractAlgorithm, DistrubutionAlgorithm } from "./algorithm";

export type ExecCtx = {
  flowId: string;
  userId: string | null;
  gameId: string;
  currentNodeId: string;
  execNodeInfo: ExecCtxNodeInfo;
}

export type ExecCtxNodeInfo = {[x: string] : any};

export class Execution {
  private ctx: ExecCtx;
  private algo: DistrubutionAlgorithm;
  private abstractAlgo: AbstractAlgorithm;
  private flow: PolyglotFlow;
  private gameEngine: GameEngine;

  constructor(_ctx: ExecCtx, _algo: DistrubutionAlgorithm, _abstractAlgo: AbstractAlgorithm, _flow: PolyglotFlow) {
    this.ctx = _ctx;
    this.algo = _algo;
    this.abstractAlgo = _abstractAlgo;
    this.flow = _flow;
    this.gameEngine = new SmartCampusGameEngine();

    this.algo.setFlow(_flow);
  }

  public static createCtx(flowId: string, currentNodeId: string, userId?: string) {
    return {
      flowId: flowId,
      userId: userId ?? null,
      currentNodeId: currentNodeId,
      execNodeInfo: {}
    } as ExecCtx
  }

  // TODO: check if the first node is an abstract node
  public getFirstExercise() : {ctx: ExecCtx, node: PolyglotNodeValidation | null}  {
    const nodesWithIncomingEdges = new Set(this.flow.edges.map(edge => this.flow.nodes.find(node => node.reactFlow.id === edge.reactFlow.target)));
    const nodesWithoutIncomingEdges = this.flow.nodes.filter(node => !nodesWithIncomingEdges.has(node));

    // if (nodesWithoutIncomingEdges.length === 0) return null;

    const firstNode = nodesWithoutIncomingEdges[Math.floor(Math.random() * nodesWithoutIncomingEdges.length)];
    const outgoingEdges = this.flow.edges.filter(edge => edge.reactFlow.source === firstNode.reactFlow.id);

    const actualNode: PolyglotNodeValidation = {
      ...JSON.parse(JSON.stringify(firstNode)),
      validation: outgoingEdges.map(e => ({
          id: e.reactFlow.id,
          title: e.title,
          code: e.code,
          data: e.data,
          type: e.type,
      }))
    }

    return {
      ctx: Execution.createCtx(this.flow._id, firstNode._id),
      node: actualNode
    }
  }

  public getCurrentNode() {
    return this.flow.nodes.find((node) => node._id === this.ctx.currentNodeId) ?? null;
  }

  private async selectAlgoRec(execNodeInfo: ExecCtxNodeInfo, currentNode: PolyglotNode | null, satisfiedEdges: PolyglotEdge[] | null) : Promise<{ctx: ExecCtx, node: PolyglotNodeValidation | null}> {
    // caso in cui current node è null (fine esecuzione)
    if (!currentNode) {
      return {ctx: this.ctx, node: null};
    }
    // caso in cui sto eseguendo un nodo astratto
    if (currentNode.type === "abstractNode") {
      const {execNodeInfo, node} = await this.abstractAlgo.getNextExercise(this.ctx.execNodeInfo, currentNode, satisfiedEdges);

      if (execNodeInfo.done) {
        const nextEdges = this.flow.edges.filter(edge => edge.reactFlow.source === currentNode.reactFlow.id);
        const nextNodes = nextEdges.map(edge => this.flow.nodes.find(node => node.reactFlow.id === edge.reactFlow.target)) as PolyglotNode[];

        const {execNodeInfo, node} = this.algo.getNextExercise(nextNodes);

        this.ctx.execNodeInfo = execNodeInfo;
        this.ctx.currentNodeId = node?.reactFlow.id;

        return await this.selectAlgoRec(execNodeInfo, node, null);
      }

      this.ctx.execNodeInfo = execNodeInfo;
      return {ctx: this.ctx, node: node};
    }

    // caso in cui sono appena entrato nella funzione e non sto eseguendo un nodo astratto
    if (satisfiedEdges) {
      const possibleNextNodes = satisfiedEdges.map(edge => this.flow.nodes.find(node => node.reactFlow.id === edge.reactFlow.target)) as PolyglotNode[];

      const {execNodeInfo, node} = this.algo.getNextExercise(possibleNextNodes);

      this.ctx.currentNodeId = node?.reactFlow.id;

      return await this.selectAlgoRec(execNodeInfo, node, null);
    }

    // caso in cui mi sono calcolato il nodo successivo con l'algo normale e mi ha ritornato un nodo non astratto
    this.ctx.execNodeInfo = execNodeInfo;
    this.ctx.currentNodeId = currentNode.reactFlow.id; // todo check if needed

    return {ctx: this.ctx, node: (currentNode as PolyglotNodeValidation)};
    
  }

  public async getNextExercise(satisfiedConditions: string[]) : Promise<{ctx: ExecCtx, node: PolyglotNodeValidation | null}> {
    const {userId, gameId} = this.ctx;
    if (userId) {
      this.gameEngine.addPoints(gameId, userId, 100);
    }

    const satisfiedEdges = this.flow.edges.filter(edge => satisfiedConditions.includes(edge.reactFlow.id));

    const currentNode = this.getCurrentNode();

    return await this.selectAlgoRec(this.ctx.execNodeInfo,currentNode,satisfiedEdges);

  }
}

