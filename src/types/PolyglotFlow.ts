import { PolyglotEdge, PolyglotNode } from ".";

export type PolyglotExecutionData = {
  algo: string;
};

export type PolyglotFlowInfo = {
  _id: string;
  title: string;
  author: string;
  learningPathId: string;
  description: string;
  publish: boolean;
  platform: string;
  learningContext: string;
  duration: number;
  topics: string[];
  tags: string[];
  execution: PolyglotExecutionData;
  overallGrade?: number;
  executedTimes?: number;
};

export type PolyglotFlow = PolyglotFlowInfo & {
  nodes: PolyglotNode[];
  edges: PolyglotEdge[];
};
