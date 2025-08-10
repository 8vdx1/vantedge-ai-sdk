import type { OpenAICompatibleImageSettings } from '@ai-sdk/openai-compatible';

export type VantEdgeAIImageModelId =
  | 'vantedgeai/image-model-1'
  | 'vantedgeai/image-model-2'
  | (string & {});

export interface VantEdgeAIImageSettings extends OpenAICompatibleImageSettings {
  // Add any custom settings here
}
