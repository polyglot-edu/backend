import axiosCreate, { AxiosResponse } from "axios";
import {
  AIExerciseType,
  AIPlanLesson,
  AIPlanCourse,
  AnalyseType,
  CorrectorType,
  LOType,
  MaterialType,
  OutdatedCorrectorType,
  SummerizerBody,
} from "../types/AIGenerativeTypes";

export type aiAPIResponse = {
  Date: string;
  Question: string;
  CorrectAnswer: string;
};

const AIAPIGeneration = axiosCreate.create({
  baseURL: "http://131.114.22.98:8000",
  headers: {
    "Content-Type": "application/json",
    withCredentials: true,
    Access: "*",
    "access-key": "7hXzB9w4r1",
  },
});
const OutDatedAPIGeneration = axiosCreate.create({
  baseURL: "https://skapi.polyglot-edu.com",
  headers: {
    "Content-Type": "application/json",
    withCredentials: true,
    Access: "*",
    ApiKey: process.env.APIKEY,
    SetupModel:
      '{"secretKey": "' +
      process.env.SECRETKEY +
      '","modelName": "GPT-4o-MINI","endpoint": "https://ai4edu.openai.azure.com/"}',
  },
});

export const API = {
  analyseMaterial: (body: AnalyseType): Promise<AxiosResponse> => {
    return AIAPIGeneration.post<{}, AxiosResponse, {}>(
      `/tasks/analyse_material`,
      body,
    );
  },

  generateLO: (body: LOType): Promise<AxiosResponse> => {
    return AIAPIGeneration.post<{}, AxiosResponse, {}>(
      `/LearningObjectiveGenerator/generateLearningObjective`,
      body,
    );
  },

  generateMaterial: (body: MaterialType): Promise<AxiosResponse> => {
    return AIAPIGeneration.post<{}, AxiosResponse, {}>(
      `/tasks/generate_material`,
      body,
    );
  },

  summarize: (body: SummerizerBody): Promise<AxiosResponse> => {
    return AIAPIGeneration.post<{}, AxiosResponse, {}>(
      `/tasks/summarize`,
      body,
    );
  },

  generateNewExercise: (body: AIExerciseType): Promise<AxiosResponse> => {
    return AIAPIGeneration.post<{}, AxiosResponse, {}>(
      `/tasks/generate_activity`,
      body,
    );
  },

  planLesson: (body: AIPlanLesson): Promise<AxiosResponse> => {
    return AIAPIGeneration.post<{}, AxiosResponse, {}>(
      `/tasks/plan_lesson`,
      body,
    );
  },
  planCourse: (body: AIPlanCourse): Promise<AxiosResponse> => {
    return AIAPIGeneration.post<{}, AxiosResponse, {}>(
      `/tasks/plan_course`,
      body,
    );
  },

  corrector: (body: OutdatedCorrectorType): Promise<AxiosResponse> => {
    return OutDatedAPIGeneration.post<{}, AxiosResponse, {}>(
      `/Corrector/evaluate`,
      body,
    );
  },
};
