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

export const LearningTypeMap = [ //da usare per fare da intramezzo tra il nostro std e quello xapi, come traduttore
  {
    nodeType: 'OpenQuestionNode',
    activity: 'Exercise', //Da aggiungere anche alle successive
    integrated: true,
    daxAPIsupported: 'long-fill-in', //Da fare anche per il resto!
  },
  {
    key: 'short answer question',
    text: 'Short Answer Question',
    nodeType: 'closeEndedQuestionNode',
    integrated: true,
  },
  {
    key: 'true or false',
    text: 'True or False',
    nodeType: 'TrueFalseNode',
    integrated: true,
  },
  {
    key: 'fill in the blanks',
    text: 'Fill in the Blanks',
    nodeType: 'activity',
    integrated: false,
  },
  {
    key: 'matching',
    text: 'Matching',
    nodeType: 'activity',
    integrated: false,
  },
  {
    key: 'ordering',
    text: 'Ordering',
    nodeType: 'activity',
    integrated: false,
  },
  {
    key: 'multiple choice',
    text: 'Multiple Choice',
    nodeType: 'multipleChoiceQuestionNode',
    integrated: true,
  },
  {
    key: 'multiple select',
    text: 'Multiple Select',
    nodeType: 'activity',
    integrated: false,
  },
  { key: 'coding', text: 'Coding', nodeType: 'activity', integrated: false },
  { key: 'essay', text: 'Essay', nodeType: 'activity', integrated: false },
  {
    key: 'knowledge exposition',
    text: 'Knowledge Exposition',
    nodeType: 'discussion',
    integrated: false,
  },
  { key: 'debate', text: 'Debate', nodeType: 'discussion', integrated: false },
  {
    key: 'brainstorming',
    text: 'Brainstorming',
    nodeType: 'discussion',
    integrated: false,
  },
  {
    key: 'group discussion',
    text: 'Group Discussion',
    nodeType: 'discussion',
    integrated: false,
  },
  {
    key: 'simulation',
    text: 'Simulation',
    nodeType: 'experiential',
    integrated: false,
  },
  {
    key: 'inquiry based learning',
    text: 'Inquiry-Based Learning',
    nodeType: 'experiential',
    integrated: false,
  },
  {
    key: 'non written material analysis',
    text: 'Non-Written Material Analysis',
    nodeType: 'experiential',
    integrated: false,
  },
  {
    key: 'non written material production',
    text: 'Non-Written Material Production',
    nodeType: 'experiential',
    integrated: false,
  },
  {
    key: 'case study analysis',
    text: 'Case Study Analysis',
    nodeType: 'project',
    integrated: false,
  },
  {
    key: 'project based learning',
    text: 'Project-Based Learning',
    nodeType: 'project',
    integrated: false,
  },
  {
    key: 'problem solving activity',
    text: 'Problem Solving Activity',
    nodeType: 'project',
    integrated: false,
  },
];

// Per conversione: const typeNode = LearningTypeMap.find((type) => type.daxAPIsupported== response.data.type)?.nodeType

export enum ExerciseType {
  FillInQuestion = "fill-in",
  LongFillInQuestion = "long-fill-in",
  MultipleChoiceQuestion = "choice",
  TrueFalseQuestion = "true-false",
  NumericQuestion = "numeric",
  Performance = "performance",
  OtherQuestion = "other",

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
  ImageEvaluationNode = "ImageEvaluationNode",
  CollaborativeModelingNode = "CollaborativeModelingNode",
  UMLModelingNode = "UMLModelingNode",
  CasesEvaluationNode = "CasesEvaluationNode",
  InnovationPitchNode = "InnovationPitchNode",
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

export enum Activity {  //To discuss and to implement! -> Da cambiare in ActivityType per averli tutti uguali? -> DA PRENDERE FACENDO IL MAP.FIND ECC
  Exercise = "Exercise",
  Text = "Text",
  Video = "Video",
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
    //anything to add? -> Fare enum di Tool e inserire come dato il tool aperto può essere un'idea?
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
