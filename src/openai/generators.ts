import { v4 } from "uuid";
import { createSubconceptsPrompt, sendClassicPrompt } from "./prompts";
import { PolyglotConceptEdge, PolyglotConceptMap, PolyglotConceptNode } from "../types/PolyglotConcept";

export const genGraphChatGpt = async (concept: string, depth: number) => {
  const graph: PolyglotConceptMap = { nodes: [], edges: []};
  await genGraphChatGptRec(graph, concept, null, depth);

  return graph;
}

const genGraphChatGptRec = async (graph: PolyglotConceptMap, concept: string, parent: PolyglotConceptNode | null, depth: number) => {
  try {
    const node: PolyglotConceptNode = {_id: v4(), name: concept}
    graph.nodes.push(node);

    if (parent) {
      const edge: PolyglotConceptEdge = {from: parent._id, to: node._id};
      graph.edges.push(edge);
    }

    if (!depth || depth <= 0) return;

    const prompt = createSubconceptsPrompt(concept);

    const completion = await sendClassicPrompt([prompt]);

    const subConcepts: string[] = JSON.parse(completion);

    const promises = Promise.all(subConcepts.map(async (subConcept) => {
      await genGraphChatGptRec(graph, subConcept, node, depth-1)
    }))

    await promises;

  } catch (err) {
    console.log(err);
  }
}