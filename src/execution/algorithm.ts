import { v4 } from "uuid";
import { PolyglotEdge, PolyglotFlow, PolyglotNode, PolyglotNodeValidation } from "../types";
import { ExecCtx, ExecCtxNodeInfo } from "./execution";
import { PolyglotConceptMap, PolyglotConceptNode } from "../types/PolyglotConcept";
import { genResChatGpt } from "../openai/generators";
import { GenResProps } from "../openai/prompts";

// TODO: add default getNextExercise and then add a specific abstract execution algorithm method
export abstract class DistrubutionAlgorithm {
  protected ctx: ExecCtx;
  protected flow?: PolyglotFlow;

  constructor(_ctx: ExecCtx) {
    this.ctx = _ctx;
  }

  public setFlow(_flow: PolyglotFlow) {
    this.flow = _flow;
  }

  public abstract getNextExercise(possibleNextNodes: PolyglotNode[]) : {execNodeInfo: ExecCtxNodeInfo, node: PolyglotNodeValidation | null};
}

const multipleChoiceWidget = () => `"""<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2/dist/tailwind.min.css" rel="stylesheet" type="text/css" /><script>const submit = (code,lang) => ({command: {code: code,targetKernelName: lang},commandType: "SubmitCode"});kernel.root.send(submit("1","multiplechoice"));</script><div class="container mx-auto rounded-md border-2 border-gray-900 bg-white text-black py-4 px-6"><div class="pb-4 font-medium text-lg">My Question:</div><div class="grid grid-cols-2 gap-4"><button class="flex rounded-md border-2 border-gray-900 p-8 justify-center">Option 1</button><button class="flex rounded-md border-2 border-gray-900 p-8 justify-center">Option 1</button><button class="flex rounded-md border-2 border-gray-900 p-8 justify-center">Option 1</button><button class="flex rounded-md border-2 border-gray-900 p-8 justify-center">Option 1</button></div></div>"""`

const choiceNode = () : PolyglotNode => {
  return {
    type: "choiceNode",
    _id: "1",
    title: "choice node",
    description: "descriptiom",
    difficulty: 1,
    runtimeData: {
      challengeSetup: [
        "\nusing Polyglot.Interactive;\nvar kernel = Kernel.Root.FindKernelByName(\"multiplechoice\") as MultipleChoiceKernel;\nkernel.Options = new HashSet<string> { \"1\", \"2\" };\n",
        `KernelInvocationContext.Current.DisplayAs(${multipleChoiceWidget()},"text/html");`
      ],
      challengeContent: [
        {
          type: "multiplechoice",
          content: "",
          priority: 1
        },
        // {
        //     type: "html",
        //     content: multipleChoiceWidget(),
        //     priority: 0
        // }
      ]
    },
    reactFlow: {},
    data: {} 
  }
}

const finishNode = () : PolyglotNode => {
  return {
    type: "multipleChoiceNode",
    _id: "1",
    title: "Domanda",
    description: "descriptiom",
    difficulty: 1,
    runtimeData: {
      challengeSetup: [
        "\nusing Polyglot.Interactive;\nvar kernel = Kernel.Root.FindKernelByName(\"multiplechoice\") as MultipleChoiceKernel;\nkernel.Options = new HashSet<string> { \"1\", \"2\" };\n",
        `KernelInvocationContext.Current.DisplayAs(${multipleChoiceWidget()},"text/html");`
      ],
      challengeContent: [
        {
          type: "multiplechoice",
          content: "",
          priority: 1
        },
        // {
        //     type: "html",
        //     content: multipleChoiceWidget(),
        //     priority: 0
        // }
      ]
    },
    reactFlow: {},
    data: {} 
  }
}

// export class SelectionDA extends DistrubutionAlgorithm {
//   public getNextExercise(possibleNextNodes: PolyglotNode[]) {
//     if (!this.flow) throw new Error("No flow found");
//     const currentNode = this.flow.nodes.find((node) => node._id === this.ctx.currentNodeId) as PolyglotNode;

//     // TODO: add check currentNode and remove imposition type

//     if (possibleNextNodes.length === 0 && currentNode.type !== "abstractNode") 
//       return {
//         ctx: this.ctx,
//         node: null
//       };

//     const randomNode = possibleNextNodes[Math.floor(Math.random() * possibleNextNodes.length)];

//     let nextNode: PolyglotNodeValidation;

//     // TODO: refactor algorithm inside another method
//     if (randomNode?.type === "abstractNode" || this.ctx.exec_node_info.count_node === 0) {
//         this.ctx.exec_node_info.count_node = 2;
//         nextNode = {
//           ...JSON.parse(JSON.stringify(choiceNode())),
//           validation: [
//             {
//               id: v4(),
//               title: "pass",
//               code: `async Task<(bool, string)> validate(PolyglotValidationContext context) {
//                 var cmd = context.JourneyContext.SubmittedCode;
                
//                 var resp = await GamificationClient.Current.SendCommand(cmd);
                    
//                 return (resp, \"Pass/Fail edge\");
//             }`,
//               data: {
//                 "conditionKind": "pass"
//               },
//               type: "passFailEdge",
//             }
//           ]
//         }
//         if (randomNode?.type === "abstractNode") this.ctx.currentNodeId = randomNode._id;
//     }else if (currentNode.type === "abstractNode"){
//       this.ctx.exec_node_info.count_node--;

//       // TODO: prendi nodo random in base alla scelta
//       nextNode = {
//         ...JSON.parse(JSON.stringify(genRandomNode())),
//         validation: [
//           {
//             id: v4(),
//             title: "pass",
//             code: `async Task<(bool, string)> validate(PolyglotValidationContext context) {
//               var cmd = context.JourneyContext.SubmittedCode;
              
//               var resp = await GamificationClient.Current.SendCommand(cmd);
                  
//               return (resp, \"Pass/Fail edge\");
//           }`,
//             data: {
//               "conditionKind": "pass"
//             },
//             type: "passFailEdge",
//           }
//         ]
//       }
//     } else {
//       this.ctx.currentNodeId = randomNode._id;
//       const outgoingEdges = this.flow.edges.filter(edge => edge.reactFlow.source === randomNode.reactFlow.id);
//       nextNode = {
//         ...JSON.parse(JSON.stringify(randomNode)),
//         validation: outgoingEdges.map(e => ({
//             id: e.reactFlow.id,
//             title: e.title,
//             code: e.code,
//             data: e.data,
//             type: e.type,
//           }))
//       }
//     }

//     return {
//       ctx: this.ctx,
//       node: nextNode
//     }
//   }

// }

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

export abstract class AbstractAlgorithm {
  private ctx: ExecCtx;

  constructor(ctx: ExecCtx) {
    this.ctx = ctx;
  }

  public abstract getNextExercise(execNodeInfo: ExecCtxNodeInfo, currentNode: PolyglotNode, satisfiedEdges : PolyglotEdge[] | null) : Promise<{execNodeInfo: ExecCtxNodeInfo, node: PolyglotNodeValidation | null}>;
}

type ManualAAConceptOrder = 'bts'

export class ManualAA extends AbstractAlgorithm {
  // TODO: implement this
  public getConceptOrder(algo: ManualAAConceptOrder, conceptmap: PolyglotConceptMap) : PolyglotConceptNode[] {
    // TODO: probably better if i create an api to order the concepts with an algorithm and then provide the ability to modify it
    return conceptmap.nodes;
  }
  public async getNextExercise(execNodeInfo: ExecCtxNodeInfo, currentNode: PolyglotNode, satisfiedEdges : PolyglotEdge[] | null) : Promise<{execNodeInfo: ExecCtxNodeInfo, node: PolyglotNodeValidation | null}> {
    const orderType = "bts";
    const numOfRes = 1;
    
    if (!execNodeInfo.concepts) {
      const conceptmap: PolyglotConceptMap | undefined = currentNode.data.conceptmap;

      // TODO: create custom Error
      if (!conceptmap) throw Error("Concept map not defined!");

      const concepts = this.getConceptOrder(orderType, conceptmap);

      // No concepts return
      if (concepts.length === 0) {
        execNodeInfo.done = true;
        return { execNodeInfo: execNodeInfo, node: null };
      }

      execNodeInfo.concepts = concepts;
      execNodeInfo.conceptIndex = 0;
      execNodeInfo.executedNodes = 0;
    }


    // const { conceptId, executedNodes } = execNodeInfo;

    if (execNodeInfo.executedNodes >= numOfRes) {
      execNodeInfo.conceptIndex++;
      execNodeInfo.executedNodes = 0;
    }

    if (execNodeInfo.conceptIndex >= execNodeInfo.concepts.length) {
      execNodeInfo.done = true;

      return { execNodeInfo: execNodeInfo, node: null };
    }

    const currentConcept: PolyglotConceptNode = execNodeInfo.concepts[execNodeInfo.conceptIndex];

    console.log(currentConcept)


    // TODO: import from exec config from abstractNode
    const opts: GenResProps = {
      num_ex: 1,
      type_ex: "multiple choice", // TODO: set from node exec config
      language: "english",
      topic: currentConcept.name,
      bloom_lv: "remember" // TODO: set from node exec config
    } 

    // TODO: handle error
    const nextNode = await genResChatGpt(opts);

    execNodeInfo.executedNodes++;

    // TODO: create better edge validation
    const node: PolyglotNodeValidation = {
      ...nextNode[0],
      validation: [
        {
          id: v4(),
          title: "pass",
          code: `async Task<(bool, string)> validate(PolyglotValidationContext context) {                
            return (true, \"Pass/Fail edge\");
        }`,
          data: {
            "conditionKind": "pass"
          },
          type: "passFailEdge",
        }
      ]
    }

    return {execNodeInfo, node};
  };
}