/* eslint-disable camelcase */
import { restJsonRequest } from "../request";
import { env } from "#/configs/env";

export type ChatGPTResponse = {
  id: string;
  object: "chat_completion";
  created: number;
  model: "gpt-3.5-turbo";
  choices: [{
    index: number;
    message: {
      role: "assistant";
      content: string;
    };
    finish_reason: "stop";
  }];
  usage: {
    prompt_token: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export async function chatWithAI(message: string, systemContext?: string): Promise<string> {
  const messages: {
    role: "user" | "system" | "assistant";
    content: string;
  }[] = [];

  if (systemContext) messages.push({ role: "system", content: systemContext });
  messages.push({ role: "user", content: message });

  const response = await restJsonRequest<ChatGPTResponse>(
    "post", "https://api.openai.com/v1/chat/completions", {
      headers: {
        authorization: `Bearer ${env.OPEN_AI}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages,
        temperature: 0.9,
        max_tokens: 1000
      })
    }
  );

  if (!response.ok || !response.value.choices[0]) {
    return "Excusez moi, je ne sais pas comment répondre à votre message.";
  }

  return response.value.choices[0].message.content;
}