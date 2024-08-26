const OpenAI = require('openai');

// Initialize the OpenAI SDK with OpenRouter's base URL and your API key
const openai = new OpenAI({
  apiKey: process.env.TEST_OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

async function callChat() {
  try {
    console.log('Chat started');

    const completion = await openai.chat.completions.create({
      model: 'google/gemini-pro-1.5',
      //model: 'openai/gpt-4o-mini', // this works
      messages: [
        { role: 'system', content: 'You are a helpful AI assistant.' },
        { role: 'user', content: [
          { type: 'text', text: 'Hello! Can you tell me a brief joke?' },
          { type: 'text', text: 'Now, can you explain the joke you just told?' }
        ]}
      ],
    });

    console.log('Gemini response:', completion, "\n", completion.choices);
    console.log('Conversation ended.');
  } catch (error) {
    console.error('Error:', error);
  }
}

module.exports = {
  callChat
};