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
  
  try {
    console.log('Stream started');

    const stream = await openai.beta.chat.completions.stream({
      model: 'anthropic/claude-3.5-sonnet-20240620',
      messages: [
        { role: 'system', content: 'You are a helpful AI assistant with access to a "ping" tool. When asked to use the ping tool, respond with the tool\'s output and then end the conversation.' },
        { role: 'user', content: 'Please use the ping tool.' }
      ],
      tools: tools,
      tool_choice: "auto"
    });

    console.log('Stream is ongoing');

    const response = await stream.finalContent();
    console.log('Stream ended');

    console.log('Claude response:', response);

    // Check if the model wants to use the tool
    const toolCalls = await stream.toolCalls();
    if (toolCalls.length > 0) {
      const toolCall = toolCalls[0];
      const toolUseId = toolCall.id;
      if (toolCall.function.name === "ping") {
        const pingResponse = pingTool();
        console.log('Ping tool response:', pingResponse);

        // Send the tool response back to Claude
        const finalStream = await openai.beta.chat.completions.stream({
          model: 'anthropic/claude-3.5-sonnet-20240620',
          messages: [
            { role: 'system', content: 'You are a helpful AI assistant with access to a "ping" tool. When asked to use the ping tool, respond with the tool\'s output and then end the conversation.' },
            { role: 'user', content: 'Please use the ping tool.' },
            { role: 'assistant', content: response },
            { role: 'tool',
              content: pingResponse,
              name: "ping",
              tool_call_id: toolUseId,
            },
          ],
          tools: tools,
          tool_choice: "auto"
        });

        const finalResponse = await finalStream.finalContent();
        console.log('Final Claude response:', finalResponse);
      }
    }

    console.log('Conversation ended.');
  } catch (error) {
    console.error('Error:', error);
  }
}

module.exports = {
  callStream
};