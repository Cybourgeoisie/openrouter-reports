const OpenAI = require('openai');

// Initialize the OpenAI SDK with OpenRouter's base URL and your API key
const openai = new OpenAI({
  apiKey: process.env.TEST_OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

async function callStream() {
  try {
    console.log('Stream started - First request (with reasoning)');

    // First stream - with include_reasoning
    const stream1 = await openai.beta.chat.completions.stream({
      model: 'openai/gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'can you create a new file called numbers1to10.txt and put the numbers 1 to 10 in it one line at a time',
              protocraft: {
                type: 'prompt'
              }
            }
          ]
        }
      ],
      temperature: 0.5,
      top_p: 1,
      stream: true,
      tools: [
        {
          type: 'function',
          function: {
            name: 'create_file',
            description: 'Create a new file on the file system.',
            parameters: {
              type: 'object',
              properties: {
                filepath: {
                  type: 'string',
                  description: 'The relative path to the file to create'
                },
                content: {
                  type: 'string',
                  description: 'The content to write to the file'
                }
              },
              required: [
                'filepath',
                'content'
              ]
            }
          }
        }
      ],
      tool_choice: 'auto',
      parallel_tool_calls: true,
      include_reasoning: true
    });

    const { contentChunks: chunks1, toolCalls: tools1 } = await readStream(stream1);
    console.log('First stream chunks:', chunks1);
    console.log('First stream tool calls:', tools1);

    const response1 = await stream1.finalContent();
    console.log('First stream final response:', response1);

    console.log('Stream started - Second request (without reasoning)');

    // Second stream - without include_reasoning
    const stream2 = await openai.beta.chat.completions.stream({
      model: 'openai/gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'can you create a new file called numbers1to10.txt and put the numbers 1 to 10 in it one line at a time',
              protocraft: {
                type: 'prompt'
              }
            }
          ]
        }
      ],
      temperature: 0.5,
      top_p: 1,
      stream: true,
      tools: [
        {
          type: 'function',
          function: {
            name: 'create_file',
            description: 'Create a new file on the file system.',
            parameters: {
              type: 'object',
              properties: {
                filepath: {
                  type: 'string',
                  description: 'The relative path to the file to create'
                },
                content: {
                  type: 'string',
                  description: 'The content to write to the file'
                }
              },
              required: [
                'filepath',
                'content'
              ]
            }
          }
        }
      ],
      tool_choice: 'auto',
      parallel_tool_calls: true
    });

    const { contentChunks: chunks2, toolCalls: tools2 } = await readStream(stream2);
    console.log('Second stream chunks:', chunks2);
    console.log('Second stream tool calls:', tools2);

    const response2 = await stream2.finalContent();
    console.log('Second stream final response:', response2);

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