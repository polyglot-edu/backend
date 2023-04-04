import { Request, Response } from "express";
import { Configuration, OpenAIApi } from "openai";

const OPENAI_SECRET_KEY = process.env.OPENAI_SECRET_KEY as string;
const OPENAI_CHAT_MODEL = process.env.OPENAI_CHAT_MODEL as string;

const configuration = new Configuration({
  apiKey: OPENAI_SECRET_KEY
});
const openai = new OpenAIApi(configuration);

async function sendPrompt(input: any){
  const model = OPENAI_CHAT_MODEL;
  const messages = [
    {
      role: "system",
      content:
        "You are a very useful assistant for a teacher that wants to generate material and quizzes for their lessons and exams",
    },
    {
      role: "user",
      content: input,
    },
  ];

  const completion = await openai.createChatCompletion({
    model,
    messages
  });

  return completion.data.choices;
}

export async function chat_to_GPT(req: Request, res: Response){
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const answer = await sendPrompt(prompt);
    console.log(answer);
    return res.status(200).json(answer[0]);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.prompt.completion });
  }
}
