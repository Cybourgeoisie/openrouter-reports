const OpenAI = require('openai');

// Initialize the OpenAI SDK with OpenRouter's base URL and your API key
const openai = new OpenAI({
  apiKey: process.env.TEST_OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

async function callChat() {
  try {
    console.log('Chat started');

    const chatCompletion = await openai.chat.completions.create({
      model: 'google/gemini-pro-1.5',
      messages: [
        { role: 'system', content: 'You are a helpful AI assistant.' },
        { role: 'user', content: 'Hello! Can you tell me a brief joke?' },
        { role: 'user', content: 'Now, can you explain the joke you just told?' }
      ],
    });

    console.log('Gemini response:', chatCompletion.choices[0].message.content);

    console.log('Chat ended');
  } catch (error) {
    console.error('Error:', error);
  }
}

module.exports = {
  callChat
};