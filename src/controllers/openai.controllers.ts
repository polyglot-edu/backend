import { Request, Response } from "express";
import { GenResProps, createResPrompt, sendClassicPrompt } from "../execution/prompts";
import { genGraphChatGpt } from "../openai/generators";

export async function genResource(req: Request<any, any, GenResProps>, res: Response){
  const promptOpts = req.body;

  const prompt = createResPrompt(promptOpts);
  console.log(prompt)

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
    return res.status(500).json({ error: "Invalid generated resources, please try again" });
  }
}

export async function genConceptMap(req: Request<any, any, {topic: string; depth: number}>, res: Response){
  const {topic, depth} = req.body;

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
