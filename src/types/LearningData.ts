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
  OpenEndedQuestion,
  CloseEndedQuestion,
  MultipleChoiceQuestion,
  TrueFalseQuestion,
}

export enum Platform {
  PolyGloT,
  VirtualStudio,
  Papyrus,
  WebApp,
  WorkAdventure,
}

export enum UserRole {
  Teacher,
  Student,
  Tutor,
}

// Tipo base di tutte le azioni
export type BaseAction = {
  timestamp: Date;
  userId: string;
  actionType: String;
  zoneId: ZoneId;
  platform: Platform; //meglio modificare in "tool"?
};

// Azione di registrazione a WorkAdventure
export type RegistrationToWorkAdventureAction = BaseAction & {
  action: {
    userRole: UserRole;
  };
};

// Azioni di LogIn e LogOut to WorkAdventure
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

// Azioni di LogIn e LogOut to PoliGloT
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

// Azioni di apertura e chiusura di un tool
export type OpenToolAction = BaseAction & {
  action: {
    // ?
  };
};

export type CloseToolAction = BaseAction & {
  action: {
    // ?
  };
};

// Azione di apertura di un node di appendimento (inizio esecuzione del node)
export type OpenNodeAction = BaseAction & {
  action: {
    flowId: string;
    nodeId: string;
    activity: string; //DA DISCUTERE!
  };
};

// Azione di chiusura di un node di appendimento (termine esecuzione del node)
export type CloseNodeAction = BaseAction & { //Quando avviene questa azione? Ad ogni cambio pagina o solo quando viene chiuso il nodo e basta?
  action: {
    flowId: string;
    nodeId: string;
    activity: string; //DA DISCUTERE!
  };
};

// Azione di passaggio al node successivo/precedente durante un'attività di learning.
export type ChangeNodeAction = BaseAction & {
  action: {
    flowId: string;
    oldNodeId: string;
    newNodeId: string;
  };
};

//Apertura schermata di info aggiuntive nella selezione LP
export type OpenLPInfoAction = BaseAction & {
  action: {
    flowId: string;
  };
};

// Chiusura schermata di info aggiuntive riguardo un LP (serve?)
export type CloseLPInfoAction = BaseAction & {
  action: {
    flowId: string;
  };
};

// Azione di ricerca di un LearningPath (LP)
export type SearchForLPAction = BaseAction & {
  action: {
    queryId: string;
    queryText: string;
  };
};

// Azione di mostrare i risultati di una ricerca di LP
export type ShowLPAction = BaseAction & {
  action: {
    queryId: string;
    resultId: string[];
  };
};

// Azioni comuni della pagina di selezione del Learning Path (LP)
// Azione di selezione di un LP
export type SelectLPAction = BaseAction & {
  action: {
    flowId: string;
  };
};

// Azione di rimozione di una selezione
export type RemoveLPSelectionAction = BaseAction & {
  action: {
    flowId: string;
  };
};

//Azione di creazione LP
export type CreateLPAction = BaseAction & {
  action: {
    flowId: string;
  };
};

//Azione di modifica LP
export type ModifyLPAction = BaseAction & {
  action: {
    flowId: string;
    //Any info about the old version of the LP?
  };
};

//Azione di eliminazione LP
export type DeleteLPAction = BaseAction & {
  action: {
    flowId: string;
    //Any info about the old version of the LP?
  };
};

// Azione di invio della risposta fornita
export type SubmitAnswerAction = BaseAction & {
  action: {
    flowId: string;
    nodeId: string;
    exerciseType: ExerciseType;
    answer: string;
    result: string; //boolean? enum{"correct","wrong"}?
  };
};

export type GradeAction = BaseAction & {
  action: {
    flow: string;
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
  | GradeAction;
