import axiosCreate, { AxiosResponse } from "axios";
import {
  AIExerciseType,
  AnalyseType,
  CorrectorType,
  LOType,
  MaterialType,
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

  corrector: (body: CorrectorType): Promise<AxiosResponse> => {
    return AIAPIGeneration.post<{}, AxiosResponse, {}>(`/tasks/evaluate`, body);
  },
};
