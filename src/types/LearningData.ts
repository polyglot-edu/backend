import { Date } from "mongoose";

export enum ZoneId {
  FreeZone,
  OutsideZone,
  SilentZone,
  LearningPathSelectionZone,
  InstructionWebpageZone,
  WebAppZone,
  MeetingRoomZone,
  PolyGlotLearningZone,
  PolyGlotLearningPathCreationZone,
  PapyrusWebZone,
  VirtualStudioZone,
}

export enum ExerciseType {
  LessonNode = "lessonNode",
  LessonTextNode = "lessonTextNode",
  WatchVideoNode = "WatchVideoNode",
  ReadMaterialNode = "ReadMaterialNode",
  CreateKeywordsListNode = "CreateKeywordsListNode",
  MemoriseKeywordsListNode = "MemoriseKeywordsListNode",
  SummaryNode = "SummaryNode",
  ScanningNode = "ScanningNode",
  MindMapNode = "MindMapNode",
  ProblemSolvingNode = "ProblemSolvingNode",
  FindSolutionNode = "FindSolutionNode",
  CloseEndedQuestionNode = "closeEndedQuestionNode",
  OpenQuestionNode = "OpenQuestionNode",
  CodingQuestionNode = "codingQuestionNode",
  PromptEngineeringNode = "PromptEngineeringNode",
  MultipleChoiceQuestionNode = "multipleChoiceQuestionNode",
  TrueFalseNode = "TrueFalseNode",
  CircuitNode = "CircuitNode",
  ImageEvaluationNode = "ImageEvaluationNode",
  CollaborativeModelingNode = "CollaborativeModelingNode",
  UMLModelingNode = "UMLModelingNode",
  CasesEvaluationNode = "CasesEvaluationNode",
  InnovationPitchNode = "InnovationPitchNode",
}

export enum Platform {
  PolyGloT,
  VisualStudio,
  PapyrusWeb,
  WebApp,
  WorkAdventure,
}

export enum UserRole {
  Teacher,
  Student,
  Tutor,
}

export enum Activity {
  OpenEndedQuestion,
  MultipleChoiceQuestion,
}

// Tipo base di tutte le azioni
export type BaseAction = {
  timestamp: Date;
  userId: string;
  actionType: String;
  zoneId: ZoneId;
  platform: Platform;
};

// Registration to WorkAdventure
export type RegistrationToWorkAdventureAction = BaseAction & {
  action: {
    userRole: UserRole;
  };
};

// LogIn and LogOut to WorkAdventure
export type LogInToWorkAdventureAction = BaseAction & {
  action: {
    userRole: UserRole;
  };
};

export type LogOutToWorkAdventureAction = BaseAction & {
  action: {
    userRole: UserRole;
  };
};

// LogIn and LogOut to PoliGloT
export type LogInToPolyGloTAction = BaseAction & {
  action: {
    userRole: UserRole;
  };
};

export type LogOutToPolyGloTAction = BaseAction & {
  action: {
    userRole: UserRole;
  };
};

// Opening and Closing a tool
export type OpenToolAction = BaseAction & {
  action: {
    //anything to add?
  };
};

export type CloseToolAction = BaseAction & {
  action: {
    //anything to add?
  };
};

// Opening a non completed learning node for the first time in a session (starts execution of the node)
export type OpenNodeAction = BaseAction & {
  action: {
    flowId: string;
    nodeId: string;
    activity: string;
  };
};

// Closing a non completed learning node (stop execution of the node) -> This happens when a node gets closed before completing its activity
export type CloseNodeAction = BaseAction & {
  action: {
    flowId: string;
    nodeId: string;
    activity: string;
  };
};

// Moving to previous/next node
export type ChangeNodeAction = BaseAction & {
  action: {
    flowId: string;
    oldNodeId: string;
    newNodeId: string;
  };
};

/* Example of how it works, given Node1 a node where some information are given to the student, and Node2 a node where the user is asked to complete and activity. Node2 is the last node of the flow.
  1) User starts a new learning flow, opens first node for the first time --> openNodeAction of Node1 is registered
  2) User completes Node1's activity, then goes to the next node --> changeNodeAction from Node1 to Node2 is registered, then openNodeAction of Node2 is registered too 
  3) User goes back to Node1 to check something before completing the activity in Node2 --> changeNodeAction from Node2 to Node1 is registered, nothing else
    By doing this, time spent in Node1 after the change from Node2 is considered part of the time needed to complete the activity in Node2
  4) User returns to Node2 to complete the activity --> changeNodeAction from Node1 to Node2, nothing else
  5) User stops the execution of the Node2 (closes browser/window/flow execution) --> closeNodeAction of Node2 is registered
  6) After some time but in the same login session, user re-opens the learning flow (starting a new session of flow execution) and is sent back to Node2 --> openNodeAction of Node2 is registered, since this is a new session of flow execution
  7) User goes back to review Node1 --> changeNodeAction from Node2 to Node1 is registered, no openNodeAction of Node1 since it has been already completed in another session
  8) User goes to Node2, completes correctly the activity and closes the execution of the flow, since there are no more nodes in the flow --> changeNodeAction from Node1 to Node2 is registered, and then a closeNode is also registered
  */

// Opening the "More info" page of a LearningPath in the LP selection page
export type OpenLPInfoAction = BaseAction & {
  action: {
    flowId: string;
  };
};

// Closing the "More info" page of a LearningPath in the LP selection page (Do we need this?)
export type CloseLPInfoAction = BaseAction & {
  action: {
    flowId: string;
  };
};

// Searching for LearningPaths in the LP selection page
export type SearchForLPAction = BaseAction & {
  action: {
    queryId: string;
    queryText: string;
  };
};

// Obtaining the results after a search for LearningPaths in the LP selection page
export type ShowLPAction = BaseAction & {
  action: {
    queryId: string;
    resultId: string[];
  };
};

// Selection of a LearningPath
export type SelectLPAction = BaseAction & {
  action: {
    flowId: string;
  };
};

// Removal of the selection of a LearningPath
export type RemoveLPSelectionAction = BaseAction & {
  action: {
    flowId: string;
  };
};

// Creation of a LP
export type CreateLPAction = BaseAction & {
  action: {
    flowId: string;
  };
};

// Modification of a LP
export type ModifyLPAction = BaseAction & {
  action: {
    flowId: string;
    //Any info about the old version of the LP?
  };
};

// Elimination of a LP
export type DeleteLPAction = BaseAction & {
  action: {
    flowId: string;
    //Any info about the old version of the LP?
  };
};

// Submission of the answer to a node's activity
export type SubmitAnswerAction = BaseAction & {
  action: {
    flowId: string;
    nodeId: string;
    exerciseType: ExerciseType;
    answer: string;
    result: string; //boolean? enum{"correct","wrong"}? any? -> Da rendere boolean e fix negli altri file
  };
};

// Completion of a LearningPath
export type CompleteLPAction = BaseAction & {
  action: {
    flowId: string;
  };
};

// Evaluation of a LP after its completion
export type GradeLPAction = BaseAction & {
  action: {
    flowId: string;
    grade: number;
  };
};

// Tipo unione per tutte le azioni possibili dell'utente
export type UserAction =
  | RegistrationToWorkAdventureAction
  | LogInToWorkAdventureAction
  | LogOutToWorkAdventureAction
  | LogInToPolyGloTAction
  | LogOutToPolyGloTAction
  | OpenToolAction
  | CloseToolAction
  | OpenNodeAction
  | CloseNodeAction
  | ChangeNodeAction
  | OpenLPInfoAction
  | CloseLPInfoAction
  | SearchForLPAction
  | ShowLPAction
  | SelectLPAction
  | RemoveLPSelectionAction
  | CreateLPAction
  | ModifyLPAction
  | DeleteLPAction
  | SubmitAnswerAction
  | GradeLPAction
  | CompleteLPAction;
