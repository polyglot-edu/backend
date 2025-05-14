export type XAPIActor = {
  userId: string;
  name: string;
  mbox: string;
};

export type XAPIVerb = {
  id: string;
  display: { "en-US": string };
};

export type XAPIObject = {
  id: string;     //Identifier for this particular question instance
  definition?: {  //metadata about the question
    name?: { "en-US": string };   //question text
    description?: { "en-US": string };  //extended description/context
    interactionType?: string;   //interaction type supported by XAPI spec (choice, fill in, matching)
    choices?: any[];    //choices provided to the student
    correctResponsesPattern?: string[]; 
    extensions?: Record<string, any>; //type of question being answered (custom extension) -> campo per dati extra non previsti dalo standard
  };
};

export type XAPIResult = {  //student interaction details and outcomes
  success?: boolean;
  completion?: boolean;
  score?: {
    scaled?: number;  //partial credits possible
    raw?: number; //se non uso scaled, metto punteggio numerico qui, poi min e max
    min?: number;
    max?: number;
  };
  response?: string;  //actual response from the student
};

export type XAPIContext = { //additional contextual information
  platform?: string;
  language?: string;
  extensions?: Record<string, any>; //content reference metadata (links assessment to content database)
};

export type XAPIMetadata = {
  contentId?: string;
  instructorId?: string;
  courseId?: string;
  lessonId?: string;
};

export type XAPIStatement = {
  actor: XAPIActor;
  verb: XAPIVerb;
  object: XAPIObject;
  result?: XAPIResult;
  context?: XAPIContext;
  timestamp: string;
  metadata?: XAPIMetadata;
};
