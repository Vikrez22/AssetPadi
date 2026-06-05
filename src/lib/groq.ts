import Groq from 'groq-sdk';

export const groqClient = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true, // Required for frontend-only usage
});

export const GROQ_MODEL = 'llama-3.3-70b-versatile';
