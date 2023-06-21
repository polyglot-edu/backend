import { AzureKeyCredential, ChatMessage, GetChatCompletionsOptions, GetCompletionsOptions, OpenAIClient } from "@azure/openai";
import { OPENAI_ENDPOINT, OPENAI_SECRET_KEY } from "../utils/secrets";

export class OpenAI {
  private client: OpenAIClient

  private GPT_MODEL = "polyglot__gpt35"
  private DAVINCI_MODEL = "polyglot_davinci003"
  private ADA_MODEL = "polyglot_text_ada_001"
  private CURIE_MODEL = "polyglot_curie_001"

  constructor() {
    this.client = new OpenAIClient(OPENAI_ENDPOINT, new AzureKeyCredential(OPENAI_SECRET_KEY));
  }

  public async listCompletion(prompt: string[], options?: GetCompletionsOptions) {
    const events = await this.client.listCompletions(this.DAVINCI_MODEL, prompt, options);
  
    let output = ""
    for await (const event of events) {
      for (const choice of event.choices) {
        output += choice.text;
      }
    }

    return output
  }

  public async listChatCompletion(messages: ChatMessage[], options?: GetChatCompletionsOptions) {
    const events = await this.client.listChatCompletions(this.GPT_MODEL, messages, options);
  
    let output = ""
    for await (const event of events) {
      for (const choice of event.choices) {
        const delta = choice.delta?.content;
        if (delta !== undefined) {
          output += delta
        }
      }
    }

    return output
  }
}