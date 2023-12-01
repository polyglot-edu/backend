import { Node } from 'reactflow';

/**
 * A node in the polyglot graph.
 * @param sas comment
 */
export type PolyglotNode = {
  reactFlow: Node<unknown>;
};

export const zip = <T, K>(a: T[], b: K[]) =>
a.map((k, i) => ({ first: k, second: b[i] }));

// TODO: add type TextualQuestion or similar to standardize textual questions such as multiple choice, open questions, coding exercises, ecc.

export type ChallengeSetup = {};
export type ChallengeContent = {
  type: string;
  content: string;
  priority?: number;
};
