import { PolyglotEdge, PolyglotNode } from ".";

export type PolyglotFlowInfo = {
    id: string;
    title: string;
    description: string;
}

export type PolyglotFlow = PolyglotFlowInfo & {
    nodes: PolyglotNode[];
    edges: PolyglotEdge[];
};