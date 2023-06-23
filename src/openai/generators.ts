import { v4 } from "uuid";
import { GenResProps, createResPrompt, createSubconceptsPrompt, sendClassicPrompt } from "./prompts";
import { PolyglotConceptEdge, PolyglotConceptMap, PolyglotConceptNode } from "../types/PolyglotConcept";
import { PolyglotNode } from "../types";

export const genGraphChatGpt = async (concept: string, depth: number) => {
  const graph: PolyglotConceptMap = { nodes: [], edges: []};
  await genGraphChatGptRec(graph, concept, null, depth);

  return graph;
}

export const genResChatGpt = async (opt: GenResProps) => {
  const prompt = createResPrompt(opt);
  console.log(prompt)

  if (!prompt) throw Error("Prompt generation failed!");

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

const getMultipleChoiceRuntimeData = (choices: string[], question: string) => {
  const choicesStr = choices.map(c => `"${c}"`).join(", ");
  const markdown = question + choices.map((c,id) => "\n" + (id+1) + ". " + c).join(",")
  return {
    challengeSetup: [
        "\nusing Polyglot.Interactive;\nvar kernel = Kernel.Root.FindKernelByName(\"multiplechoice\") as MultipleChoiceKernel;\nkernel.Options = new HashSet<string> { "+ choicesStr +" };\n"
    ],
    challengeContent: [
        {
            type: "multiplechoice",
            content: "",
            priority: 1
        },
        {
            type: "markdown",
            content: markdown,
            priority: 0
        }
    ]
  }
}