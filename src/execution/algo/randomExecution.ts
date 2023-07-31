import { PolyglotNode } from "../../types";
import { DistrubutionAlgorithm } from "./base";

export class RandomDA extends DistrubutionAlgorithm {
  public getNextExercise(possibleNextNodes: PolyglotNode[]) {
    if (!this.flow) throw new Error("No flow found");
    
    const randomNode = possibleNextNodes[Math.floor(Math.random() * possibleNextNodes.length)];

    this.ctx.currentNodeId = randomNode._id;

    const outgoingEdges = this.flow.edges.filter(edge => edge.reactFlow.source === randomNode.reactFlow.id);
    const nextNode = {
      ...JSON.parse(JSON.stringify(randomNode)),
      validation: outgoingEdges.map(e => ({
          id: e.reactFlow.id,
          title: e.title,
          code: e.code,
          data: e.data,
          type: e.type,
        }))
    }

    return {
      execNodeInfo: {},
      node: nextNode
    }
  }
}