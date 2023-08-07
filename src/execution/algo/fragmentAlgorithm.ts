import { v4 } from "uuid";
import { GenResProps } from "../prompts";
import { PolyglotNode, PolyglotEdge, PolyglotNodeValidation } from "../../types";
import { PolyglotConceptMap, PolyglotConceptNode } from "../../types/PolyglotConcept";
import { AbstractAlgorithm } from "./base";
import { ExecCtxNodeInfo } from "../execution";
import { resGeneratorMap } from "../generators/register";

export class ManualAA extends AbstractAlgorithm {     
    public async getNextExercise(execNodeInfo: ExecCtxNodeInfo, currentNode: PolyglotNode, satisfiedEdges : PolyglotEdge[] | null) : Promise<{execNodeInfo: ExecCtxNodeInfo, node: PolyglotNodeValidation | null}> {
      const numOfRes = currentNode.data.execution?.numOfRes ?? 1;
      const bloom_lv = currentNode.data.execution?.bloom_lv ?? 'remember'
      const resType = currentNode.data.execution?.resType ?? 'multiple choice'
  
      if (!execNodeInfo.concepts) {
        const conceptmap: PolyglotConceptMap | undefined = currentNode.data.conceptmap;
  
        // TODO: create custom Error
        if (!conceptmap) throw Error("Concept map not defined!");
  
        const concepts: PolyglotConceptNode[] = currentNode.data.execution?.concepts ?? conceptmap.nodes
        console.log(currentNode.data.execution)
  
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
        type_ex: resType, // TODO: set from node exec config
        language: "english",
        topic: currentConcept.name,
        bloom_lv: bloom_lv
      }
  
      // TODO: handle error
      const nextNode = await resGeneratorMap["resGptOpenAi"](opts);
  
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