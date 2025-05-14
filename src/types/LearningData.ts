//import { Date } from "mongoose";

export enum ZoneId {
  FreeZone = "FreeZone",
  OutsideZone = "OutsideZone",
  SilentZone = "SilentZone",
  LearningPathSelectionZone = "LearningPathSelectionZone",
  InstructionWebpageZone = "InstructionWebpageZone",
  WebAppZone = "WebAppZone",
  MeetingRoomZone = "MeetingRoomZone",
  PolyGloTLearningZone = "PolyGloTLearningZone",
  PolyGloTLearningPathCreationZone = "PolyGloTLearningPathCreationZone",
  PapyrusWebZone = "PapyrusWebZone",
  VisualStudioZone = "VisualStudioZone",
}

export enum ExerciseType {
  FillInQuestion = "fill-in",
  LongFillInQuestion = "long-fill-in",
  MultipleChoiceQuestion = "choice",
  TrueFalseQuestion = "true-false",
  NumericQuestion = "numeric",
  Performance = "performance",
  OtherQuestion = "other",
}

export enum Platform { // Da cambiare in PlatformType per averli tutti uguali?
  PolyGloT = "PolyGloT",
  VisualStudio = "VisualStudio",
  PapyrusWeb = "PapyrusWeb",
  WebApp = "WebApp",
  WorkAdventure = "WorkAdventure",
}

export enum UserRole {
  Teacher = "Teacher",
  Student = "Student",
  Tutor = "Tutor",
}

export enum Activity {  //To discuss and to implement! -> Da cambiare in ActivityType per averli tutti uguali?
  OpenEndedQuestion = "OpenEndedQuestion",
  MultipleChoiceQuestion = "MultipleChoiceQuestion",
  Exercise = "Exercise",
  Other = "Other",
}

// Basic type for all actions
export type BaseAction = {
  timestamp: Date;
  userId: string;
  actionType: String; //Sarebbe meglio fare una enum anche per actionType?
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

// Starting an activity in a LearningPath
export type OpenActivityAction = BaseAction & {
  action: {
    flowId: string;
    nodeId: string;
    activity: string;
  };
};

// Stopping the executionn of an activity in a LearningPath
export type CloseActivityAction = BaseAction & {
  action: {
    flowId: string;
    nodeId: string;
    activity: string;
  };
};

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
  }
}

// Tipo unione per tutte le azioni possibili dell'utente
export type UserAction =
  | RegistrationToWorkAdventureAction
  | LogInToWorkAdventureAction
  | LogOutToWorkAdventureAction
  | LogInToPolyGloTAction
  | LogOutToPolyGloTAction
  | OpenToolAction
  | CloseToolAction
  | OpenActivityAction
  | CloseActivityAction
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
