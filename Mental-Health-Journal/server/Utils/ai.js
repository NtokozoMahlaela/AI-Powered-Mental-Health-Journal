const axios = require('axios');
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const classifyEmotion = async (text) => {
  const response = await axios.post(
    'https://api-inference.huggingface.co/models/bhadresh-savani/distilbert-base-uncased-emotion',
    { inputs: text },
    {
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
      },
    }
  );

  const sorted = response.data[0].sort((a, b) => b.score - a.score);
  return {
    emotion: sorted[0].label,
    score: sorted[0].score,
  };
};

const getCopingSuggestion = async (emotion, content) => {
  const prompt = `
You are a mental wellness assistant. The user is feeling ${emotion}.
Here is their journal entry: "${content}"

Give one short, friendly and supportive coping strategy for them.
`;

  const response = await openai.createChatCompletion({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 100,
  });

  return response.data.choices[0].message.content.trim();
};

module.exports = {
  classifyEmotion,
  getCopingSuggestion,
};
