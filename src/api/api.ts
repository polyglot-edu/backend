import axiosCreate, { AxiosResponse } from "axios";
import {
  AIExerciseType,
  AIPlanLesson,
  AIPlanCourse,
  AnalyseType,
  LOType,
  MaterialType,
  OutdatedCorrectorType,
  SummerizerBody,
  AIDefineSyllabus,
  AIChatMessage,
} from "../types";

export type aiAPIResponse = {
  Date: string;
  Question: string;
  CorrectAnswer: string;
};
import FormData = require("form-data"); 
import FormDataNode from "form-data";

const AIAPIGeneration = axiosCreate.create({
  baseURL: "http://131.114.22.98:8000",
  headers: {
    "Content-Type": "application/json",
    withCredentials: true,
    Access: "*",
    "access-key": "7hXzB9w4r1",
  },
});

const AIChatAPITeacher = axiosCreate.create({
  baseURL: "http://131.114.22.98:8000",
  headers: {
    "Content-Type": "application/json",
    withCredentials: true,
    Access: "*",
    access_key: "9hXzB9w4r1",
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJUZWFjaGVyIiwiZXhwIjoxNzU4NjQ3OTcyfQ.PLt7H_tVYDHXsdAT76MsRzskkycj1jQz2E6jYf_FH2M",
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
  analyseMaterial: (formData: FormDataNode): Promise<AxiosResponse> => {
    return AIAPIGeneration.post(`/tasks/analyse_material`, formData, {
      headers: formData.getHeaders(),
    });
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

  defineSyllabus: (body: AIDefineSyllabus): Promise<AxiosResponse> => {
    return AIAPIGeneration.post<{}, AxiosResponse, {}>(
      `/tasks/define_syllabus`,
      body,
    );
  },

  corrector: (body: OutdatedCorrectorType): Promise<AxiosResponse> => {
    return OutDatedAPIGeneration.post<{}, AxiosResponse, {}>(
      `/Corrector/evaluate`,
      body,
    );
  },

  getChatTeacher: (chatId: string): Promise<AxiosResponse> => {
    return AIChatAPITeacher.get<{}, AxiosResponse, {}>(`/user/chat/` + chatId);
  },

  chatTeacher: (
    chatId: string,
    body: AIChatMessage,
  ): Promise<AxiosResponse> => {
    return AIChatAPITeacher.post<{}, AxiosResponse, {}>(
      `/user/chat/` + chatId,
      body,
    );
  },

chatFileUpload: (
  chatId: string,
  formData: FormData
): Promise<AxiosResponse> => {
  return AIChatAPITeacher.post(
    `/user/chat/${chatId}/upload`,
    formData,
    {
      headers: formData.getHeaders(),
    }
  );
},
  resetChatTeacher: (chatId: string): Promise<AxiosResponse> => {
    return AIChatAPITeacher.put<{}, AxiosResponse, {}>(
      `/user/chat/` + chatId + `/reset`,
    );
  },
};
