import { PolyglotEdge, PolyglotNode } from ".";

export type PolyglotExecutionData = {
    algo: string
}

export type PolyglotFlowInfo = {
    _id: string;
    title: string;
    author: string;
    learningPathId: string;
    description: string;
    publish: boolean;
    tags: string[];
    execution: PolyglotExecutionData;
}

export type PolyglotFlow = PolyglotFlowInfo & {
    nodes: PolyglotNode[];
    edges: PolyglotEdge[];
};