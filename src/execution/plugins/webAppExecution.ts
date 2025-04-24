import { PolyglotNode } from "../../types";
import {
  ChallengeContent,
  ChallengeSetup,
  LessonTextNodeData,
  OpenQuestionNodeData,
  MultipleChoiceQuestionNodeData,
  TrueFalseNodeData,
  WebAppContent,
  WebAppSetup,
  CloseEndedQuestionNodeData,
  textLinkNodeData as TextLinkNodeData,
  zip,
} from "./Node";

type webAppSpecifics = {
  webAppSetup: WebAppSetup[];
  webAppContent: WebAppContent;
};

//LessonTextNodeData Execution block

function lessonTextNodeExecution(node: PolyglotNode) {
  const data = node.data as LessonTextNodeData;
  const webAppSetup: WebAppSetup[] = [];

  const webAppContent: WebAppContent = { content: data };

  return {
    webAppSetup,
    webAppContent,
  };
}

//readMaterialNode Execution block

function readMaterialNodeExecution(node: PolyglotNode) {
  const data = node.data as TextLinkNodeData;

  const webAppSetup: WebAppSetup[] = [];

  const webAppContent: WebAppContent = { content: data };

  return {
    webAppSetup,
    webAppContent,
  };
}

//closeEndedQuestionNode Execution block
function closeEndedQuestionNodeExecution(node: PolyglotNode) {
  const data = node.data as CloseEndedQuestionNodeData;

  const webAppSetup: WebAppSetup[] = [];

  const webAppContent: WebAppContent = { content: data };

  return {
    webAppSetup,
    webAppContent,
  };
}

//closeEndedQuestionNode Execution block
function openQuestionNodeExecution(node: PolyglotNode) {
  const data = node.data as OpenQuestionNodeData;

  const webAppSetup: WebAppSetup[] = [];

  const webAppContent: WebAppContent = { content: data };

  return {
    webAppSetup,
    webAppContent,
  };
}

//MultipleChoiceQuestionNodeData Execution block
function multipleChoiceQuestionNodeExecution(node: PolyglotNode) {
  const data = node.data as MultipleChoiceQuestionNodeData;
  const webAppSetup: WebAppSetup[] = [];
  const webAppContent: WebAppContent = { content: data };

  return {
    webAppSetup,
    webAppContent,
  };
}

//trueFalseNodeData Execution block
function trueFalseNodeExecution(node: PolyglotNode) {
  const data = node.data as TrueFalseNodeData;
  const webAppSetup: WebAppSetup[] = [];
  const webAppContent: WebAppContent = { content: data };

  return {
    webAppSetup,
    webAppContent,
  };
}

//watchVideoNodeData Execution block
function watchVideoNodeExecution(node: PolyglotNode) {
  const data = node.data as TextLinkNodeData;
  const webAppSetup: WebAppSetup[] = [];
  const webAppContent: WebAppContent = { content: data };

  return {
    webAppSetup,
    webAppContent,
  };
}

function summaryNodeExecution(node: PolyglotNode) {
  const data = node.data as TextLinkNodeData;
  const webAppSetup: WebAppSetup[] = [];
  const webAppContent: WebAppContent = { content: data };

  return {
    webAppSetup,
    webAppContent,
  };
}

function notImplementedNodeExecution(node: PolyglotNode) {
  const webAppSetup: WebAppSetup[] = [];
  const webAppContent: WebAppContent = {
    content:
      "This node type is not implemented for WebApp execution, go to: " +
      node.platform,
    type: node.type,
  };

  return {
    webAppSetup,
    webAppContent,
  };
}

export function webAppExecution(node: PolyglotNode, ctx: string) {
  if (node.platform == "Eraser" || node.platform == "PapyrusWeb") {
    const challengeSetup: ChallengeSetup[] = [];

    const challengeContent: ChallengeContent[] = [
      {
        type: "markdown",
        content:
          "You can do this activity in WorkAdventure, please go in our world to complete it.",
      },
    ];
    const webAppSpecifics: webAppSpecifics = {
      webAppSetup: [],
      webAppContent: { content: node.data, type: "Collaborative" },
    };
    return {
      ...node,
      runtimeData: {
        challengeSetup,
        challengeContent,
        webAppSpecifics,
      },
    };
  }

  let webAppSpecifics: webAppSpecifics = {
    webAppSetup: [],
    webAppContent: { content: "" },
  };
  if (node?.type == "multipleChoiceQuestionNode")
    webAppSpecifics = multipleChoiceQuestionNodeExecution(node);
  if (node?.type == "lessonTextNode")
    webAppSpecifics = lessonTextNodeExecution(node);
  if (node?.type == "closeEndedQuestionNode")
    webAppSpecifics = closeEndedQuestionNodeExecution(node);
  if (node?.type == "OpenQuestionNode")
    webAppSpecifics = openQuestionNodeExecution(node);
  if (node?.type == "ReadMaterialNode")
    webAppSpecifics = readMaterialNodeExecution(node);
  if (node?.type == "TrueFalseNode")
    webAppSpecifics = trueFalseNodeExecution(node);
  if (node?.type == "WatchVideoNode")
    webAppSpecifics = watchVideoNodeExecution(node);
  if (node?.type == "SummaryNode") webAppSpecifics = summaryNodeExecution(node);
  if (node?.type == "") webAppSpecifics = notImplementedNodeExecution(node); //default statement

  return {
    ...node,
    runtimeData: {
      webAppSpecifics,
    },
  };
}
