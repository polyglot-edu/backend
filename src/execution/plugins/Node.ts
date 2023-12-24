/**
 * A node in the polyglot graph.
 * @param sas comment
 */

export type LessonTextNodeData = {
  text: string;
};

export type readMaterialNodeData = {
  text: string;
  link: string;
};

export type MultipleChoiceQuestionNodeData = {
  question: string;
  choices: string[];
  isChoiceCorrect: boolean[];
};

export type closeEndedQuestionNodeData = {
  question: string;
  correctAnswers: string[];
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

export type WebAppSetup = {};
export type WebAppContent = {
  type?: string;
  content: any;
  priority?: number;
};

