# OpenRouter Bug Reports

## Environment Setup

- `TEST_OPENROUTER_API_KEY`: OpenRouter API key

## Issues:

### messages-multi-user-content (Issue with Multi-User Content)
- Gemini throws an error when the user sends multiple content rows under a single user message, but works fine when the user sends two user messages in a row.
- Occurs in both `chat.js` & `stream.js`
- *Note:* The `messages-multi-user` folder serves as a counter-example to `messages-multi-user-content`, in which two user messages are sent in a row, instead of multiple content rows under a single user message.

### tools (Issue with Tool Usage in Streaming)
- Anthropic response breaks in the OpenAI NodeJS SDK for beta streaming. (Tries to access a sub-property of an parent property that doesn't exist - `tool_calls`.)
- Occurs in `stream.js`
- `chat.js` works as expected here, the issue is only in streaming

### Unavailable Endpoints (503 or 404)
- Providers or endpoints are down / not available.
- Occurs in both `chat.js` & `stream.js`
- In the above, the LLM has no available endpoint. The model used, '01-ai/*', is notable because it shows up first alphabetically in the list of available models, so I filter the top few out so that the user has a good first experience.
- This issue also occurs with google/gemini-pro-1.5-exp.

## Running the Examples

```
npm run start [folder-name] [chat | stream]

e.g.
npm run start messages-multi-user-content chat
npm run start messages-multi-user-content stream

npm run start tools stream

npm run start unavailable chat
npm run start unavailable stream
```
