import { genGraphChatGpt, genResChatGpt, GenResProps } from ".";
import { PolyglotConceptMap, PolyglotNode } from "../../types";

export type ConceptGeneratoMap = {
  [key: string]: (concept: string, depth: number) => Promise<PolyglotConceptMap>
}

export type ResGeneratoMap = {
  [key: string]: (opt: GenResProps) => Promise<PolyglotNode[]>
}

export const resGeneratorMap: ResGeneratoMap = {
  "resGptOpenAi": genResChatGpt,
}

export const conceptGeneratoMap: ConceptGeneratoMap = {
  "conceptmapGptOpenAi": genGraphChatGpt
}