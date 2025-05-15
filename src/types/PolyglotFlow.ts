import { PolyglotEdge, PolyglotNode } from ".";
import { EducationLevel, LearningOutcome, Topic } from "./AIGenerativeTypes";

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
  sourceMaterial?: string;
  learning_outcome?: LearningOutcome;
  topicsAI?: Topic[];
  language?: string;
  macro_subject?: string;
  education_level?: EducationLevel;
  context?: string;
  overallGrade?: number;
  executedTimes?: number;
};

export type PolyglotFlow = PolyglotFlowInfo & {
  nodes: PolyglotNode[];
  edges: PolyglotEdge[];
};
