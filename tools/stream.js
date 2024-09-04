const OpenAI = require('openai');

// Initialize the OpenAI SDK with OpenRouter's base URL and your API key
const openai = new OpenAI({
  apiKey: process.env.TEST_OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

// Ping tool function
function pingTool() {
  return "pong";
}

async function callStream() {
  const tools = [
    {
      type: "function",
      function: {
        name: "ping",
        description: "A test tool that always responds with 'pong'",
        parameters: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "The message to send to the tool"
            }
          },
          required: ["message"]
        }
      }
    }
  ];


  // For testing, can switch between the two:
  // Working
  //const model = 'openai/gpt-4o-mini';

  // Not working
  const model = 'anthropic/claude-3.5-sonnet';

  try {
    console.log('Stream started: Using Model', model);

    const stream = await openai.beta.chat.completions.stream({
      model,
      messages: [
        { role: 'system', content: 'You are a helpful AI assistant with access to a "ping" tool. When asked to use the ping tool, respond with the tool\'s output and then end the conversation.' },
        { role: 'user', content: 'Please use the ping tool.' }
      ],
      tools: tools,
      tool_choice: "auto"
    });

    console.log('Stream is ongoing');

    const { contentChunks, toolCalls } = await readStream(stream);

    console.log('contentChunks', contentChunks);
    console.log('toolCalls', toolCalls);

    const response = await stream.finalContent();
    console.log('Stream ended');

    console.log('Stream final content response:', response);

    // Check if the model wants to use the tool
    if (toolCalls.length > 0) {
      const toolCall = toolCalls[0];
      const toolUseId = toolCall.id;

      if (toolCall.function.name === "ping") {
        const pingResponse = pingTool();
        console.log('Ping tool response:', pingResponse);

        const messages = [
          { role: 'system', content: 'You are a helpful AI assistant with access to a "ping" tool. When asked to use the ping tool, respond with the tool\'s output and then end the conversation.' },
          { role: 'user', content: 'Please use the ping tool.' },
          { role: 'assistant',
            content: "",
            tool_calls: [ toolCall ],
          },
          { role: 'tool',
            content: pingResponse,
            name: "ping",
            tool_call_id: toolUseId,
          },
        ];

        console.log('messages', messages);

        // Send the tool response back to Claude
        const finalStream = await openai.beta.chat.completions.stream({
          model,
          messages,
          tools: tools,
          tool_choice: "auto"
        });

        const { finalContentChunks, finalToolCalls } = await readStream(finalStream);

        console.log('finalContentChunks', finalContentChunks);
        console.log('finalToolCalls', finalToolCalls);

        const finalResponse = await finalStream.finalContent();
        console.log('Stream final content response:', finalResponse);
      }
    }

    console.log('Conversation ended.');
  } catch (error) {
    console.error('Error:', error);
  }
}

async function readStream(stream) {
  let contentChunks = [];
  let toolCalls = [];
  for await (const chunk of stream) {
    const delta = chunk.choices[0].delta;
    const content = delta.content;

    // Check for tool calls
    if ("tool_calls" in delta && delta.tool_calls.length > 0) {
      const tool_calls = delta.tool_calls;

      for (const tool_call of tool_calls) {
        if (tool_call.index in toolCalls) {
          toolCalls[tool_call.index].function.arguments += tool_call.function.arguments;
        } else {
          toolCalls[tool_call.index] = {
            id: tool_call.id,
            type: "function",
            function: {
              name: tool_call.function.name,
              arguments: tool_call.function.arguments,
            },
          };
        }
      }

      continue;
    }

    if (content === undefined || content === null || content.length === 0) {
      continue;
    }

    contentChunks.push(content);
  }

  return { contentChunks, toolCalls };
}

module.exports = {
  callStream
};