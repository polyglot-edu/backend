import axiosCreate, { AxiosResponse } from "axios";
import {
  AIExerciseType,
  AIPlanLesson,
  AIPlanCourse,
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
  baseURL: "https://edu-pal-api.createlab-univaq.it",
  headers: {
    "Content-Type": "application/json",
    withCredentials: true,
    Access: "*",
    "access-key": "Jwk70doGZF_EjX3o_-yHOJP9YD2Cbhr_x60bNmRjc1w",
  },
});

const AIChatAPITeacher = axiosCreate.create({
  baseURL: "https://edu-pal-api.createlab-univaq.it",
  headers: {
    "Content-Type": "application/json",
    withCredentials: true,
    Access: "*",
    access_key: "Jwk70doGZF_EjX3o_-yHOJP9YD2Cbhr_x60bNmRjc1w",
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJUZWFjaGVyIiwiZXhwIjoxNzU4NjQ3OTcyfQ.PLt7H_tVYDHXsdAT76MsRzskkycj1jQz2E6jYf_FH2M",
  },
});

//used to split the llm_token from the body to the header
function splitLlmToken<T extends { llm_token?: string }>(
  body: T,
): { body: Omit<T, "llm_token">; headers: Record<string, string> } {
  const { llm_token, ...rest } = body;
  return {
    body: rest,
    headers: llm_token ? { llm_token } : {},
  };
}


export const API = {
  analyseMaterial: (
    formData: FormDataNode,
    llm_token?: string,
  ): Promise<AxiosResponse> => {
    return AIAPIGeneration.post(`/tasks/analyse_material`, formData, {
      headers: {
        ...formData.getHeaders(),
        ...(llm_token ? { llm_token } : {}),
      },
    });
  },

  generateMaterial: (body: MaterialType): Promise<AxiosResponse> => {
    const { body: rest, headers } = splitLlmToken(body);
    return AIAPIGeneration.post<{}, AxiosResponse, {}>(
      `/tasks/generate_material`,
      rest,
      { headers },
    );
  },

  summarize: (body: SummerizerBody): Promise<AxiosResponse> => {
    const { body: rest, headers } = splitLlmToken(body);
    return AIAPIGeneration.post<{}, AxiosResponse, {}>(
      `/tasks/summarize`,
      rest,
      { headers },
    );
  },

  generateNewExercise: (body: AIExerciseType): Promise<AxiosResponse> => {
    const { body: rest, headers } = splitLlmToken(body);
    return AIAPIGeneration.post<{}, AxiosResponse, {}>(
      `/tasks/generate_activity`,
      rest,
      { headers },
    );
  },

  planLesson: (body: AIPlanLesson): Promise<AxiosResponse> => {
    const { body: rest, headers } = splitLlmToken(body);
    return AIAPIGeneration.post<{}, AxiosResponse, {}>(
      `/tasks/plan_lesson`,
      rest,
      { headers },
    );
  },

  planCourse: (body: AIPlanCourse): Promise<AxiosResponse> => {
    const { body: rest, headers } = splitLlmToken(body);
    return AIAPIGeneration.post<{}, AxiosResponse, {}>(
      `/tasks/plan_course`,
      rest,
      { headers },
    );
  },

  defineSyllabus: (body: AIDefineSyllabus): Promise<AxiosResponse> => {
    const { body: rest, headers } = splitLlmToken(body);
    return AIAPIGeneration.post<{}, AxiosResponse, {}>(
      `/tasks/define_syllabus`,
      rest,
      { headers },
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
