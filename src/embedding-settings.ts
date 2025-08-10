import type { OpenAICompatibleEmbeddingSettings } from '@ai-sdk/openai-compatible';

export type VantEdgeAIEmbeddingModelId =
  | 'vantedgeai/embedding-model-1'
  | 'vantedgeai/embedding-model-2'
  | (string & {});

export interface VantEdgeAIEmbeddingSettings
  extends OpenAICompatibleEmbeddingSettings {
  // Add any custom settings here
}
