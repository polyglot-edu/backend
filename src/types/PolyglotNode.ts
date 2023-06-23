// TODO: FIXME: share types between projects

export type PolyglotNode = {
    _id: string;
    type: string;
    title: string;
    description: string;
    difficulty: number;
    runtimeData: any;
    data: any;
    reactFlow: any;
};

export type PolyglotNodeValidation = PolyglotNode & {
    validation: {
      id: string;
      title: string;
      code: string;
      data: any;
      type: string;
    }[]
}