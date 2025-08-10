import type { OpenAICompatibleCompletionSettings } from '@ai-sdk/openai-compatible';

export type VantEdgeAICompletionModelId =
  | 'vantedgeai/completion-model-1'
  | 'vantedgeai/completion-model-2'
  | (string & {});

export interface VantEdgeAICompletionSettings
  extends OpenAICompatibleCompletionSettings {
  // Add any custom settings here
  threadId?: string;
}
