/**
 * A node in the polyglot graph.
 * @param sas comment
 */

export type LessonTextNodeData = {
  text: string;
};

export type textLinkNodeData = {
  text: string;
  link: string;
};

export type MultipleChoiceQuestionNodeData = {
  question: string;
  choices: string[];
  isChoiceCorrect: boolean[];
};

export type CodingQuestionNodeData = {
  question: string;
  codeTemplate: string;
  language: string;
};

export type TrueFalseNodeData = {
  instructions: string;
  questions: string[];
  isQuestionCorrect: boolean[];
  negativePoints: number;
  positvePoints: number;
};

export type CloseEndedQuestionNodeData = {
  question: string;
  correctAnswers: string[];
};

export type OpenQuestionNodeData = {
  question: string;
  material: string;
  aiQuestion: boolean;
  language?: string;
  questionGenerated?: string;
  possibleAnswer?: string;
  questionCategory?: number;
  questionType?: number;
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

