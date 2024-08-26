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

async function callChat() {
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
    const completion = await openai.chat.completions.create({
      model: 'anthropic/claude-3.5-sonnet-20240620',
      messages: [
        { role: 'system', content: 'You are a helpful AI assistant with access to a "ping" tool. When asked to use the ping tool, respond with the tool\'s output and then end the conversation.' },
        { role: 'user', content: 'Please use the ping tool.' }
      ],
      tools: tools,
      tool_choice: "auto"
    });

    console.log('Claude response:', completion.choices[0].message);

    // Check if the model wants to use the tool
    if (completion.choices[0].message.tool_calls) {
      const toolCall = completion.choices[0].message.tool_calls[0];
      const toolUseId = toolCall.id;
      if (toolCall.function.name === "ping") {
        const pingResponse = pingTool();
        console.log('Ping tool response:', pingResponse);

        // Send the tool response back to Claude
        const finalCompletion = await openai.chat.completions.create({
          model: 'anthropic/claude-3.5-sonnet-20240620',
          messages: [
            { role: 'system', content: 'You are a helpful AI assistant with access to a "ping" tool. When asked to use the ping tool, respond with the tool\'s output and then end the conversation.' },
            { role: 'user', content: 'Please use the ping tool.' },
            completion.choices[0].message,
            { role: 'tool',
              content: pingResponse,
              name: "ping",
              tool_calls: [ toolCall ],
              tool_call_id: toolUseId,
            },
          ],
          tools: tools,
          tool_choice: "auto"
      });

        console.log('Final Claude response:', finalCompletion);
      }
    }

    console.log('Conversation ended.');
  } catch (error) {
    console.error('Error:', error);
  }
}

module.exports = {
  callChat
};