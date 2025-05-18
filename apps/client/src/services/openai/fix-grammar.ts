/* eslint-disable lingui/text-restrictions */

import { t } from "@lingui/macro";

import { DEFAULT_MAX_TOKENS, DEFAULT_MODEL } from "@/client/constants/llm";
import { useOpenAiStore } from "@/client/stores/openai";

import { openai } from "./client";

const PROMPT = `You are an AI writing assistant specialized in writing copy for resumes.
Do not return anything else except the text you improved. It should not begin with a newline. It should not have any prefix or suffix text.
Just fix the spelling and grammar of the following paragraph, do not change the meaning and returns in the language of the text:

Text: """{input}"""

Revised Text: """`;

export const fixGrammar = async (text: string) => {
  const prompt = PROMPT.replace("{input}", text);
  const { model, maxTokens, apiKey } = useOpenAiStore.getState();
  
  // If using Ollama
  if (apiKey === 'sk-1234567890abcdef') {
    const result = await openai().post('/api/generate', {
      model: model ?? DEFAULT_MODEL,
      prompt,
      max_tokens: maxTokens ?? DEFAULT_MAX_TOKENS,
      temperature: 0,
      stop: ['"""'],
      stream: false,
    });
    return result.data.response;
  }

  // Using OpenAI
  const result = await openai().chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: model ?? DEFAULT_MODEL,
    max_tokens: maxTokens ?? DEFAULT_MAX_TOKENS,
    temperature: 0,
    stop: ['"""'],
    stream: false,
    n: 1,
  });

  if (result.choices.length === 0) {
    throw new Error(t`OpenAI did not return any choices for your text.`);
  }

  return result.choices[0].message.content ?? text;
};
