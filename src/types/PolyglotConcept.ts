export type PolyglotConceptNode = {
  _id: string;
  name: string;
}

export type PolyglotConceptEdge = {
  _id?: string;
  from: string;
  to: string;
}

export type PolyglotConceptMap = {
  _id?: string;
  nodes: PolyglotConceptNode[];
  edges: PolyglotConceptEdge[];
}