const OpenAI = require('openai');

// Initialize the OpenAI SDK with OpenRouter's base URL and your API key
const openai = new OpenAI({
  apiKey: process.env.TEST_OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

async function callChat() {
  try {
    // First request - with include_reasoning
    const completion1 = await openai.chat.completions.create({
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

    console.log('First response (with reasoning):')
    console.log(JSON.stringify(completion1, null, 2));

    // Second request - without include_reasoning
    const completion2 = await openai.chat.completions.create({
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

    console.log('\nSecond response (without reasoning):')
    console.log(JSON.stringify(completion2, null, 2));

  } catch (error) {
    console.error('Error:', error);
  }
}

module.exports = {
  callChat
};