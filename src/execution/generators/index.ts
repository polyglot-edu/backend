import { v4 } from "uuid";
import { createResPrompt, createSubconceptsPrompt, sendClassicPrompt } from "../prompts";
import { PolyglotConceptEdge, PolyglotConceptMap, PolyglotConceptNode } from "../../types";
import { PolyglotNode } from "../../types";
import { getMultipleChoiceRuntimeData } from "../../utils/nodes";

export type GenResProps = {
  num_ex: number;
  type_ex: 'quiz'| 'multiple choice' | 'open ended question' | 'close ended question' | 'true or false' | 'numerical';
  language: string;
  topic: string;
  bloom_lv: 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';
  num_choices?: number;
  num_answer?: number
}

export const genGraphChatGpt = async (concept: string, depth: number) => {
  const graph: PolyglotConceptMap = { nodes: [], edges: []};
  await genGraphChatGptRec(graph, concept, null, depth);

  return graph;
}

export const genResChatGpt = async (opts: GenResProps) => {
  let counter = 5;
  while (counter > 0){
    try {
      const prompt = createResPrompt(opts);
      console.log(prompt)

      if (!prompt) return ([] as PolyglotNode[]);

      const answer = await sendClassicPrompt([prompt]);
      console.log(answer);

      // TODO: better handling
      const nodeData = JSON.parse(answer);

      const nodeId = v4();
      const nodes: PolyglotNode[] = nodeData.map((data: any) => ({
        _id: nodeId,
        data: data,
        title: "Openai generated node",
        runtimeData: getMultipleChoiceRuntimeData(data.choices, data.question),
        reactFlow: {
          id: nodeId
        },
        type: "multipleChoiceQuestionNode",
        description: "",
        difficulty: 1
      }));

      return nodes;
    } catch (err) {
      console.log(err);
      counter--;
      setTimeout(() => {}, 500);
    }
  }

  const output: PolyglotNode[] = []
  return output;
}

const genGraphChatGptRec = async (graph: PolyglotConceptMap, concept: string, parent: PolyglotConceptNode | null, depth: number) => {
  let counter = 5;
  while (counter > 0){
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

      counter = 0;

    } catch (err) {
      console.log(err);
      counter--;
      setTimeout(() => {}, 500);
    }
  }
}