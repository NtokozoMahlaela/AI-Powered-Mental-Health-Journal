const axios = require('axios');

// Initialize AI services if API keys are available
let openai;
try {
  if (process.env.OPENAI_API_KEY) {
    const OpenAI = require('openai');
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
} catch (error) {
  console.warn('OpenAI initialization failed. AI features will be limited.');
}

const AI_ENABLED = {
  huggingface: !!process.env.HF_API_KEY,
  openai: !!process.env.OPENAI_API_KEY
};

const classifyEmotion = async (text) => {
  if (!AI_ENABLED.huggingface) {
    console.warn('Hugging Face API key not configured. Emotion classification disabled.');
    return {
      emotion: 'neutral',
      score: 1.0,
      warning: 'AI features are disabled. Using default neutral emotion.'
    };
  }

  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/bhadresh-savani/distilbert-base-uncased-emotion',
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
        },
        timeout: 10000 // 10 second timeout
      }
    );

    // Process the response to get the emotion with highest score
    const emotions = response.data[0];
    if (!emotions || !Array.isArray(emotions) || emotions.length === 0) {
      throw new Error('Invalid response from emotion classification service');
    }

    const topEmotion = emotions.reduce((prev, current) => 
      (prev.score > current.score) ? prev : current
    );

    return {
      emotion: topEmotion.label,
      score: topEmotion.score,
    };
  } catch (error) {
    console.error('Error classifying emotion:', error);
    // Return a default response if classification fails
    return {
      emotion: 'neutral',
      score: 1.0,
      error: 'Failed to classify emotion',
      details: error.message
    };
  }
};

const getCopingSuggestion = async (emotion, content) => {
  if (!AI_ENABLED.openai) {
    console.warn('OpenAI API key not configured. Coping suggestions disabled.');
    return 'AI-powered coping suggestions are currently unavailable. Consider talking to a trusted friend or professional about how you\'re feeling.';
  }

  try {
    const prompt = `The user is feeling ${emotion} about: ${content}. Provide a brief, supportive coping suggestion.`;
    
    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a supportive mental health assistant.' },
        { role: 'user', content: prompt }
      ],
      model: 'gpt-3.5-turbo',
      max_tokens: 150,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || 
      'I\'m here to support you. Consider talking to someone about how you\'re feeling.';
  } catch (error) {
    console.error('Error getting coping suggestion:', error);
    return 'I\'m here to support you. Consider talking to a trusted friend or professional about how you\'re feeling.';
  }
};

module.exports = {
  classifyEmotion,
  getCopingSuggestion,
  isEnabled: () => ({
    emotionClassification: AI_ENABLED.huggingface,
    copingSuggestions: AI_ENABLED.openai
  })
};
