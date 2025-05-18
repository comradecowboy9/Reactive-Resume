import { t } from "@lingui/macro";
import { OpenAI } from "openai";

import { useOpenAiStore } from "@/client/stores/openai";

export const openai = () => {
  const { apiKey, baseURL } = useOpenAiStore.getState();

  if (!apiKey) {
    throw new Error(
      t`Your OpenAI API Key has not been set yet. Please go to your account settings to enable OpenAI Integration.`,
    );
  }  if (baseURL) {
    // For Ollama endpoints, identified by the special API key
    if (apiKey === 'sk-1234567890abcdef') {
      return new OpenAI({
        apiKey,
        baseURL: baseURL.replace('/v1', ''),  // Remove /v1 if present since we'll use /api/generate
        defaultHeaders: { 'Content-Type': 'application/json' },
        dangerouslyAllowBrowser: true,
      });
    }
    
    // For OpenAI endpoints
    return new OpenAI({
      apiKey,
      baseURL,
      dangerouslyAllowBrowser: true,
    });
  }

  // Default to OpenAI
  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true,
  });
};
