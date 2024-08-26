const OpenAI = require('openai');

// Initialize the OpenAI SDK with OpenRouter's base URL and your API key
const openai = new OpenAI({
  apiKey: process.env.TEST_OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

async function callChat() {
  try {
    console.log('Starting chat');

    const response = await openai.chat.completions.create({
      model: '01-ai/yi-large-turbo',
      //model: 'google/gemini-pro-1.5-exp', // This causes a 404
      messages: [
        { role: 'system', content: 'You are a helpful AI assistant.' },
        { role: 'user', content: 'Hello! Can you tell me a brief joke?' }
      ],
    });

    console.log('Chat completed');
    console.log('Yi response:', response.choices[0].message.content);

    console.log('Conversation ended.');
  } catch (error) {
    console.error('Error:', error);
  }
}

module.exports = {
  callChat
};