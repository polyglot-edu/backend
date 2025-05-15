import { Request, Response } from "express";
import {
  GenResProps,
  createResPrompt,
  sendClassicPrompt,
} from "../execution/prompts";
import { genGraphChatGpt } from "../execution/generators";
import { AxiosResponse } from "axios";
import { API } from "../api/api";

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

export async function analyseMaterial(req: Request<any, any>, res: Response) {
  try {
    const response = await API.analyseMaterial(req.body);
    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error("error");
    return res.status(500).json({ error: error });
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

export async function corrector(req: Request<any, any>, res: Response) {
  try {
    const response = await API.corrector(req.body);
    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error });
  }
}
