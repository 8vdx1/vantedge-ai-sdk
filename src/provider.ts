import type {
  LanguageModelV1,
  EmbeddingModelV1,
  ImageModelV1,
} from '@ai-sdk/provider';
import {
  OpenAICompatibleChatLanguageModel,
  OpenAICompatibleCompletionLanguageModel,
  OpenAICompatibleEmbeddingModel,
  OpenAICompatibleImageModel,
} from '@ai-sdk/openai-compatible';
import {
  type FetchFunction,
  loadApiKey,
  withoutTrailingSlash,
} from '@ai-sdk/provider-utils';
import type {
  VantEdgeAIChatSettings,
  VantEdgeAIChatModelId,
} from './chat-settings';
import type {
  VantEdgeAICompletionModelId,
  VantEdgeAICompletionSettings,
} from './completion-settings';
import type {
  VantEdgeAIEmbeddingModelId,
  VantEdgeAIEmbeddingSettings,
} from './embedding-settings';
import type {
  VantEdgeAIImageSettings,
  VantEdgeAIImageModelId,
} from './image-settings';

// Import your model id and settings here.

export interface VantEdgeAIProviderSettings {
  /**
VantEdgeAI API key.
*/
  apiKey?: string;
  /**
Base URL for the API calls.
*/
  baseURL?: string;
  /**
Custom headers to include in the requests.
*/
  headers?: Record<string, string>;
  /**
Optional custom url query parameters to include in request urls.
*/
  queryParams?: Record<string, string>;
  /**
Custom fetch implementation. You can use it as a middleware to intercept requests,
or to provide a custom fetch implementation for e.g. testing.
*/
  fetch?: FetchFunction;
}

export interface VantEdgeAIProvider {
  /**
Creates a model for text generation.
*/
  (
    modelId: VantEdgeAIChatModelId,
    settings?: VantEdgeAIChatSettings,
  ): LanguageModelV1;

  /**
Creates a chat model for text generation.
*/
  chatModel(
    modelId: VantEdgeAIChatModelId,
    settings?: VantEdgeAIChatSettings,
  ): LanguageModelV1;

  /**
Creates a completion model for text generation.
*/
  completionModel(
    modelId: VantEdgeAICompletionModelId,
    settings?: VantEdgeAICompletionSettings,
  ): LanguageModelV1;

  /**
Creates a text embedding model for text generation.
*/
  textEmbeddingModel(
    modelId: VantEdgeAIEmbeddingModelId,
    settings?: VantEdgeAIEmbeddingSettings,
  ): EmbeddingModelV1<string>;

  /**
Creates an image model for image generation.
*/
  imageModel(
    modelId: VantEdgeAIImageModelId,
    settings?: VantEdgeAIImageSettings,
  ): ImageModelV1;
}

// Global threadId context
let globalThreadId: string | null = null;

export function setGlobalThreadId(threadId: string) {
  globalThreadId = threadId;
}

export function createVantEdgeAI(
  options: VantEdgeAIProviderSettings = {},
): VantEdgeAIProvider {
  const baseURL = withoutTrailingSlash(
    options.baseURL ?? `${process.env.NEXT_PUBLIC_API_URL}`,
  );
  const getHeaders = () => ({
    Authorization: `Bearer ${loadApiKey({
      apiKey: options.apiKey ?? '1234567890',
      environmentVariableName: 'VANTEDGEAI_API_KEY',
      description: 'VantEdgeAI API key',
    })}`,
    ...options.headers,
  });

  interface CommonModelConfig {
    provider: string;
    url: ({ path }: { path: string }) => string;
    headers: () => Record<string, string>;
    fetch?: FetchFunction;
  }

  const getCommonModelConfig = (modelType: string): CommonModelConfig => ({
    provider: `vantedgeai.${modelType}`,
    url: ({ path }) => {
      const url = new URL(`${baseURL}${path}`);
      if (options.queryParams) {
        url.search = new URLSearchParams(options.queryParams).toString();
      }
      return url.toString();
    },
    headers: getHeaders,
    fetch: options.fetch,
  });

  const createChatModel = (
    modelId: VantEdgeAIChatModelId,
    settings: VantEdgeAIChatSettings = {},
  ) => {
    // Create a custom fetch function that adds threadId to the request body
    const customFetch: FetchFunction = async (url, options) => {
      if (options?.body && (settings.threadId || globalThreadId)) {
        try {
          const body = JSON.parse(options.body as string);
          body.threadId = settings.threadId || globalThreadId;
          options.body = JSON.stringify(body);
        } catch (error) {
          console.warn(
            'Failed to parse request body for threadId injection:',
            error,
          );
        }
      }

      // Use the original fetch function
      return globalThis.fetch(url, options);
    };

    return new OpenAICompatibleChatLanguageModel(modelId, settings, {
      ...getCommonModelConfig('chat'),
      defaultObjectGenerationMode: 'tool',
      fetch: customFetch,
    });
  };

  const createCompletionModel = (
    modelId: VantEdgeAICompletionModelId,
    settings: VantEdgeAICompletionSettings = {},
  ) =>
    new OpenAICompatibleCompletionLanguageModel(
      modelId,
      settings,
      getCommonModelConfig('completion'),
    );

  const createTextEmbeddingModel = (
    modelId: VantEdgeAIEmbeddingModelId,
    settings: VantEdgeAIEmbeddingSettings = {},
  ) =>
    new OpenAICompatibleEmbeddingModel(
      modelId,
      settings,
      getCommonModelConfig('embedding'),
    );

  const createImageModel = (
    modelId: VantEdgeAIImageModelId,
    settings: VantEdgeAIImageSettings = {},
  ) =>
    new OpenAICompatibleImageModel(
      modelId,
      settings,
      getCommonModelConfig('image'),
    );

  const provider = (
    modelId: VantEdgeAIChatModelId,
    settings?: VantEdgeAIChatSettings,
  ) => createChatModel(modelId, settings);

  provider.completionModel = createCompletionModel;
  provider.chatModel = createChatModel;
  provider.textEmbeddingModel = createTextEmbeddingModel;
  provider.imageModel = createImageModel;

  return provider;
}

// Export default instance
export const vantedgeai = createVantEdgeAI();
