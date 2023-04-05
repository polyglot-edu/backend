import { Request, Response } from "express";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import { OPENAI_SECRET_KEY, OPENAI_CHAT_MODEL } from "../utils/secrets";

if (!OPENAI_SECRET_KEY || !OPENAI_CHAT_MODEL) {
  console.log("Please provide OPENAI_SECRET_KEY and OPENAI_CHAT_MODEL as environment variables");
  process.exit(1);
};

const configuration = new Configuration({
  apiKey: OPENAI_SECRET_KEY
});
const openai = new OpenAIApi(configuration);

function createPrompt(): string {

  const num_ex: number = 10;
  const type_ex: string = "multiple choice";      //quiz, multiple choice, open ended question, close ended question, true or false, numerical
  const language: string = "english";
  const topic: string = "UML Class Diagram";            
  const bloom_lvl: string = "remember";   // remember, understand, apply, analyze, evaluate, create
  let num_choices: number = 4;          // number of possible choices for exercise
  let num_answer: number = 1;           // number of correct answer for exercise

  const quiz_input: string = `Please, give me ${num_ex} ${type_ex} exercises in ${language} about ${topic} 
                        Bloom's taxonomy = "${bloom_lvl}" with ${num_choices} possible choices per exercises 
                        and where every exercise must have ${num_answer} correct answers following exactly this JSON format
                        {
                            "choices": [
                            
                            ],
                            "isChoiceCorrect": [
                            
                            ],
                            "question": "",
                            "bloom_lvl": ""
                        }, 
                        {
                            "choices": [
                            
                            ],
                            "isChoiceCorrect": [
                            
                            ],
                            "question": "",
                            "bloom_lvl": ""
                        } `;

  const question_input: string = `Please, give me ${num_ex} ${type_ex} exercises in ${language} about ${topic} 
                        with Bloom's taxonomy = "${bloom_lvl}" in JSON format following exactly this model
                        {
                            "question": "",
                            "correctAnswer: [],
                            "bloom_lvl": ""
                        }, 
                        {
                            "question": "",
                            "correctAnswer: [],
                            "bloom_lvl": ""
                        } `;

  let userInput: string = ``;

  switch(type_ex) {
    case 'quiz': 
        userInput = quiz_input;
        break;
    case 'multiple choice': 
        userInput = quiz_input;
        break;
    case 'open ended question': 
        userInput = question_input;
        break;
    case 'close ended question': 
        userInput = question_input;
        break;
    case 'true or false': 
        num_choices = 2;
        num_answer = 1;
        userInput = quiz_input;
        break;
    case 'numerical': 
        userInput = quiz_input;
        break;
    default:
        console.log("ERROR! Type of exercise not found!");
  }

  return userInput;

}

async function sendPrompt(input: any){
  const model = OPENAI_CHAT_MODEL;
  const messages: ChatCompletionRequestMessage[] = [
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
  //const { prompt } = req.body;
  const prompt = createPrompt();

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
