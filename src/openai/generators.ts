import { createSubconceptsPrompt, sendClassicPrompt } from "./prompts";

type ConceptNode = {
  node_id: number;
  name: string;
}

type ConceptEdge = {
  from: number;
  to: number;
}

type ConceptGraph = {
  nodes: ConceptNode[];
  edges: ConceptEdge[];
}

export const genGraphChatGpt = async (concept: string, depth: number) => {
  const graph: ConceptGraph = { nodes: [], edges: []};
  await genGraphChatGptRec(graph, concept, null, depth);

  return graph;
}

const genGraphChatGptRec = async (graph: ConceptGraph, concept: string, parent: ConceptNode | null, depth: number) => {
  try {
    const node: ConceptNode = {node_id: graph.nodes.length, name: concept}
    graph.nodes.push(node);

    if (parent) {
      const edge: ConceptEdge = {from: parent.node_id, to: node.node_id};
      graph.edges.push(edge);
    }

    if (depth <= 0) return;

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