import { getStringEnv } from "./EnvVariable";
import { restRequest } from "./request";

/* eslint-disable camelcase */
type ChatGPTResponse = {
  id: string;
  object: "text_completion";
  created: number;
  model: "text-davinci-003";
  choices: {
    text: string;
    index: number;
    logprobs: null;
    finish_reason: "stop"
  }[];
  usage: {
    prompt_token: number;
    completion_tokens: number;
    total_tokens: number;
  }
}

export async function chatWithAI(prompt: string): Promise<string> {
  const response = await restRequest<ChatGPTResponse>(
    "post", "https://api.openai.com/v1/completions", {
      headers: {
        authorization: `Bearer ${getStringEnv("OPEN_AI")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt: prompt,
        temperature: 0.9,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 0.0,
        presence_penalty: 0.6
      })
    }
  );

  if (!response.success || !response.data.choices.length) {
    return "Excusez moi, je ne sais pas comment répondre à votre message.";
  }

  return response.data.choices[0].text;
}