import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Límites por tipo de usuario
export const MESSAGE_LIMITS = {
  trial: 5,
  active: 50,
  free: 0,
};