import type { OpenAICompatibleChatSettings } from '@ai-sdk/openai-compatible';

export type VantEdgeAIChatModelId =
  | 'vantedgeai/chat-model-1'
  | 'vantedgeai/chat-model-2'
  | (string & {});

export interface VantEdgeAIChatSettings extends OpenAICompatibleChatSettings {
  // Add any custom settings here
  threadId?: string;
}
