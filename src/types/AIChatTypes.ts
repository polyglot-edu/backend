export type AIChatMessage = {
  role: string;
  content: string;
  timestamp: Date;
  in_memory: boolean;
  system_instructions: string;
  resources: any[];
  model?: string;
};
