const OpenAI = require('openai');

// Initialize the OpenAI SDK with OpenRouter's base URL and your API key
const openai = new OpenAI({
  apiKey: process.env.TEST_OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

async function callStream() {
  try {
    console.log('Stream started');

    const stream = await openai.chat.completions.create({
      model: '01-ai/yi-large-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful AI assistant.' },
        { role: 'user', content: 'Hello! Can you tell me a brief joke?' }
      ],
      stream: true,
    });

    console.log('Stream is ongoing');

    let fullResponse = '';
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      fullResponse += content;
      process.stdout.write(content);
    }

    console.log('\nStream ended');
    console.log('Full Yi response:', fullResponse);

    console.log('Conversation ended.');
  } catch (error) {
    console.error('Error:', error);
  }
}

module.exports = {
  callStream
};