# vantedge-ai-sdk

VantEdge AI SDK provider for AI SDK - A custom provider that implements OpenAI-compatible endpoints for AI SDK.

## Installation

```bash
npm install vantedge-ai-sdk
```

## Usage

### Basic Usage

```typescript
import { vantedgeai } from 'vantedge-ai-sdk';
import { generateText } from 'ai';

const { text } = await generateText({
  model: vantedgeai('your-model-id'),
  prompt: 'Hello, how are you?',
});
```

### Chat Model

```typescript
import { vantedgeai } from 'vantedge-ai-sdk';
import { streamText } from 'ai';

const { textStream } = await streamText({
  model: vantedgeai.chatModel('your-chat-model-id'),
  messages: [{ role: 'user', content: 'Hello, how are you?' }],
});
```

### Completion Model

```typescript
import { vantedgeai } from 'vantedge-ai-sdk';
import { generateText } from 'ai';

const { text } = await generateText({
  model: vantedgeai.completionModel('your-completion-model-id'),
  prompt: 'Complete this sentence: The weather today is',
});
```

### Embedding Model

```typescript
import { vantedgeai } from 'vantedge-ai-sdk';
import { embed } from 'ai';

const { embedding } = await embed({
  model: vantedgeai.textEmbeddingModel('your-embedding-model-id'),
  value: 'This is a sample text to embed.',
});
```

### Image Model

```typescript
import { vantedgeai } from 'vantedge-ai-sdk';
import { generateImage } from 'ai';

const { image } = await generateImage({
  model: vantedgeai.imageModel('your-image-model-id'),
  prompt: 'A beautiful sunset over the ocean',
});
```

## Configuration

### Custom Provider Instance

```typescript
import { createVantEdgeAI } from 'vantedge-ai-sdk';

const customProvider = createVantEdgeAI({
  apiKey: 'your-api-key',
  baseURL: 'https://your-api-endpoint.com/v1',
  headers: {
    'Custom-Header': 'custom-value',
  },
  queryParams: {
    version: '2024-01-01',
  },
});

// Use the custom provider
const { text } = await generateText({
  model: customProvider('your-model-id'),
  prompt: 'Hello world',
});
```

### Environment Variables

You can set the API key using environment variables:

```bash
export VANTEDGE_API_KEY="your-api-key"
```

## API Reference

### `createVantEdgeAI(options)`

Creates a custom VantEdge AI provider instance.

#### Options

- `apiKey` (string, optional): Your VantEdge AI API key
- `baseURL` (string, optional): Base URL for API calls (default: environment-specific)
- `headers` (Record<string, string>, optional): Custom headers to include in requests
- `queryParams` (Record<string, string>, optional): Custom query parameters
- `fetch` (FetchFunction, optional): Custom fetch implementation

### `vantedgeai`

Default provider instance with default configuration.

## Model IDs

The package supports various model types:

- **Chat Models**: Use with `vantedgeai()` or `vantedgeai.chatModel()`
- **Completion Models**: Use with `vantedgeai.completionModel()`
- **Embedding Models**: Use with `vantedgeai.textEmbeddingModel()`
- **Image Models**: Use with `vantedgeai.imageModel()`

## Features

- ✅ OpenAI-compatible API endpoints
- ✅ Support for chat, completion, embedding, and image models
- ✅ Customizable headers and query parameters
- ✅ Environment variable support for API keys
- ✅ TypeScript support with full type definitions
- ✅ Custom fetch implementation support
- ✅ Thread ID management for conversation context

## Requirements

- Node.js 18+
- AI SDK 1.0+

## License

Apache 2.0

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
