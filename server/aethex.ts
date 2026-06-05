export const AETHEX_BASE = 'https://api.aethexai.com/api/v1';

export const aethexHeaders = {
  'X-API-Key': process.env.AETHEX_API_KEY || 'ae_live_6cb55b54d7588fefb277d5df381d883f',
  'Content-Type': 'application/json',
};
