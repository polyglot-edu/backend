import { PolyglotNode } from "../../types";
import { ChallengeContent, ChallengeSetup, zip } from "./Node";

export type MultipleChoiceQuestionNodeData = {
    question: string;
    choices: string[];
    isChoiceCorrect: boolean[];
  };
  
export function multipleChoiceQuestionNodeExecution(node:PolyglotNode){
    const oldData = node.data as MultipleChoiceQuestionNodeData;

    const data = {
      ...oldData,
      correctAnswers: zip(oldData?.choices, oldData?.isChoiceCorrect).reduce(
        (acc, { first, second }) => {
          if (second) {
            acc.push(first);
          }
          return acc;
        },
        [] as string[]
      ),
    };

    const challengeSetup: ChallengeSetup[] = [
      `
using Polyglot.Interactive;
var kernel = Kernel.Root.FindKernelByName("multiplechoice") as MultipleChoiceKernel;
kernel.Options = new HashSet<string> { ${data.choices
        .map((_, i) => `"${i + 1}"`)
        .join(', ')} };
`,
    ];
    const challengeContent: ChallengeContent[] = [
      {
        type: 'multiplechoice',
        content: '',
        priority: 1,
      },
      {
        type: 'markdown',
        content:
          data.question +
          data.choices.map((value, index) => '\n' + (index + 1) + '. ' + value),
        priority: 0,
      },
    ];
    
    console.log({
        ...node,
        data,
        runtimeData: {
          challengeSetup,
          challengeContent,
        },});

    return {
      ...node,
      data,
      runtimeData: {
        challengeSetup,
        challengeContent,
      },
    };}