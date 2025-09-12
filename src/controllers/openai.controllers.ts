import { Request, Response } from "express";
import {
  GenResProps,
  createResPrompt,
  sendClassicPrompt,
} from "../execution/prompts";
import { genGraphChatGpt } from "../execution/generators";
import { AxiosResponse } from "axios";
import { API } from "../api/api";
import FormDataNode from "form-data";

export async function genResource(
  req: Request<any, any, GenResProps>,
  res: Response,
) {
  const promptOpts = req.body;

  const prompt = createResPrompt(promptOpts);
  console.log(prompt);

  if (!prompt) {
    return res.status(400).json({ error: "Prompt generation failed!" });
  }

  try {
    const answer = await sendClassicPrompt([prompt]);
    console.log(answer);
    const output = JSON.parse(answer);
    return res.status(200).json(output);
  } catch (error: any) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Invalid generated resources, please try again" });
  }
}

export async function genConceptMap(
  req: Request<any, any, { topic: string; depth: number }>,
  res: Response,
) {
  const { topic, depth } = req.body;

  if (!topic) {
    return res.status(400).json({ error: "Prompt generation failed!" });
  }

  try {
    const graph = await genGraphChatGpt(topic, depth);

    return res.status(200).json(graph);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error });
  }
}

export async function analyseMaterial(req: Request, res: Response) {
  try {
    const formData = new FormDataNode();

    if (req.file) {
      formData.append("file", req.file.buffer, req.file.originalname);
    }

    if (req.body.url) {
      formData.append("url", req.body.url);
    }
    if (req.body.model) {
      formData.append("model", req.body.model);
    }

    const response = await API.analyseMaterial(formData);

    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error("error", error);
    return res.status(500).json({ error: error.message });
  }
}

export async function generateLO(req: Request<any, any>, res: Response) {
  try {
    const response = await API.generateLO(req.body);
    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error("error");
    return res.status(500).json({ error: error });
  }
}

export async function generateMaterial(req: Request<any, any>, res: Response) {
  try {
    const response = await API.generateMaterial(req.body);
    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error });
  }
}

export async function summarize(req: Request<any, any>, res: Response) {
  try {
    const response = await API.summarize(req.body);
    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error });
  }
}

export async function activityGenerator(req: Request<any, any>, res: Response) {
  try {
    const response = await API.generateNewExercise(req.body);
    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error });
  }
}

export async function planLesson(req: Request<any, any>, res: Response) {
  try {
    const response = await API.planLesson(req.body);
    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error });
  }
}

export async function planCourse(req: Request<any, any>, res: Response) {
  try {
    const response = await API.planCourse(req.body);
    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error });
  }
}

export async function generateSyllabus(req: Request<any, any>, res: Response) {
  try {
    const response = await API.defineSyllabus(req.body);
    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error });
  }
}

export async function corrector(req: Request<any, any>, res: Response) {
  try {
    const response = await API.corrector(req.body);
    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error });
  }
}

export async function getChatTeacher(req: Request<any, any>, res: Response) {
  try {
    const response: AxiosResponse = await API.getChatTeacher(req.params.id);
    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error });
  }
}

export async function chatTeacher(req: Request<any, any>, res: Response) {
  try {
    const response: AxiosResponse = await API.chatTeacher(
      req.params.id,
      req.body,
    );
    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error });
  }
}

export async function chatFileUpload(req: Request, res: Response) {
  try {
    const chatId = req.params.id;
    const formData = new FormDataNode();

    if (req.file) {
      formData.append("file", req.file.buffer, req.file.originalname);
    }

    const response = await API.chatFileUpload(chatId, formData);

    return res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error("error", error.response?.data || error.message);
    return res.status(500).json({ error: error.message });
  }
}

export async function resetChatTeacher(req: Request<any, any>, res: Response) {
  try {
    const response: AxiosResponse = await API.resetChatTeacher(req.params.id);
    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error });
  }
}
