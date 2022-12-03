import { PolyglotEdge, PolyglotNode } from ".";

export type PolyglotFlowInfo = {
    _id: string;
    title: string;
    author: string;
    description: string;
}

export type PolyglotFlow = PolyglotFlowInfo & {
    nodes: PolyglotNode[];
    edges: PolyglotEdge[];
};