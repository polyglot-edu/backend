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
    platform: string;
    /* to be discussed: do we want to save in the database the last summarized material of the professor?
    sourceMaterial?: string;
    levelMaterial?: string;
    generatedMaterial?: string;
    noW?: number;*/
    tags: string[];
    execution: PolyglotExecutionData;
}

export type PolyglotFlow = PolyglotFlowInfo & {
    nodes: PolyglotNode[];
    edges: PolyglotEdge[];
};