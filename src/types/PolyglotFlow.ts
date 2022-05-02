import { PolyglotEdge, PolyglotNode } from ".";

export type PolyglotFlow = {
    id: string;
    nodes: PolyglotNode[];
    edges: PolyglotEdge[];
};