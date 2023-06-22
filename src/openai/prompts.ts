import { ChatMessage } from "@azure/openai";
import { OpenAI } from "./client";

export type CreatePromptProps = {
  num_ex: number;
  type_ex: 'quiz'| 'multiple choice' | 'open ended question' | 'close ended question' | 'true or false' | 'numerical';
  language: string;
  topic: string;
  bloom_lv: 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';
  num_choices?: number;
  num_answer?: number
}

type generateJsonTemplateProps = {
  num_ex: number;
  bloom_lv: 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';
  num_choices: number;
  num_answer: number
}

const generateJsonTemplate = ({num_ex, bloom_lv, num_choices, num_answer}: generateJsonTemplateProps) => {
  const output = []

  const cs = []
  for (let i=0;i<num_answer;i++) {
    cs.push("true")
  }
  for(let i=num_answer;i<num_choices;i++) {
    cs.push("false")
  }

  const c = []
  for(let i=0;i<num_choices;i++) {
    c.push("\"choice" + i + "\"")
  }

  for (let i=0;i<num_ex;i++) {
    output.push(`{
      "choices": [
        ${c.join(",")}
      ],
      "isChoiceCorrect": [
        ${cs.sort( _ => 0.5 - Math.random()).join(",")}
      ],
      "question": "question?",
      "bloom_lvl": "${bloom_lv}"
    }`)
  }

  return `[${output.join(",")}]`
}

export const createResPrompt = ({num_ex, type_ex, language, topic, bloom_lv, num_choices = 4, num_answer = 1}: CreatePromptProps) => {
  const quiz_input: string = `Please, give me ${num_ex} ${type_ex} exercise${num_ex > 1 ? "s" : ""} in ${language} about ${topic} with
                        Bloom's taxonomy level = "${bloom_lv}" with ${num_choices} possible choices per exercise${num_ex > 1 ? "s" : ""} 
                        where every exercise${num_ex > 1 ? "s" : ""} must have ${num_answer} true choices. All the exercises should formatted as following example:
                        ${generateJsonTemplate({num_ex, bloom_lv, num_answer, num_choices})}
                        `;

  const question_input: string = `Please, give me ${num_ex} ${type_ex} exercises in ${language} about ${topic} 
                        with Bloom's taxonomy = "${bloom_lv}" in JSON format following exactly this model without addition of any kind
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
      return null;
  }

  return userInput;

}

export const createSubconceptsPrompt = (concept: string) => {
  const prompt = `give me an array of major subconcept about ${concept} without additions of any kind in the format as follow  ["concept1","concept2"]`

  return prompt;
}

function createGraphPrompt() {
  const topic = "Second world war";

  const prompt = `generate an exaustive list of subconcept about ${topic} and then give me the corrisponding relational tree datastructure with max depth of 1 from root in the exact format without additions or comments of any kind as the following example
  {
    "nodes": [
      {"id": 0, "name": "concept1"},
      {"id": 1, "name": "concept2"},
      {"id": 2, "name": "concept3"},
      {"id": 3, "name": "concept4"}
    ],
    "edges": [
      {"from": 0, "to": 1},
      {"from": 0, "to": 2},
      {"from": 0, "to": 3}
    ]
  }
  `;

  return prompt;

}

export const sendPrompt = async (input: string) => {
  const messages: ChatMessage[] = [
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

  const openai = new OpenAI();
  
  const completion = await openai.listChatCompletion(messages);

  return completion;
}

export const sendClassicPrompt = async (input: string[]) => {

  const openai = new OpenAI();
  
  const completion = await openai.listCompletion(input, {maxTokens: 1000});

  return completion;
}