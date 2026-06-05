import express from 'express';
import cors from 'cors';
import { AETHEX_BASE, aethexHeaders } from './aethex.ts';

const app = express();
app.use(express.json());
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  process.env.FRONTEND_URL
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const isLocalhost = origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:');
    if (allowedOrigins.includes(origin) || isLocalhost) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'), false);
  }
}));

const AGENT_ID = process.env.AETHEX_AGENT_ID || '9c8d96ca-eabe-455c-9c87-d8f24637e3d7';

// Create a new voice session
app.post('/api/voice/session', async (_req, res) => {
  try {
    console.log('Request to create voice session with agent:', AGENT_ID);
    const response = await fetch(`${AETHEX_BASE}/conversation/connect`, {
      method: 'POST',
      headers: aethexHeaders,
      body: JSON.stringify({ agent_id: AGENT_ID }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('AethexAI connect error response:', errorText);
      throw new Error(`AethexAI connect error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Session successfully established:', data);
    res.json(data); // { session_id, ice_config }
  } catch (err: any) {
    console.error('Connect voice session error:', err);
    res.status(500).json({ error: err.message || 'Failed to connect voice session' });
  }
});

// Forward WebRTC SDP offer, return answer
app.post('/api/voice/session/:sid/offer', async (req, res) => {
  try {
    const { sid } = req.params;
    console.log(`Forwarding WebRTC offer for session: ${sid}`);
    const response = await fetch(`${AETHEX_BASE}/conversation/${sid}/offer`, {
      method: 'POST',
      headers: aethexHeaders,
      body: JSON.stringify(req.body),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('AethexAI offer error response:', errorText);
      throw new Error(`AethexAI offer error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Received SDP answer from AethexAI:', data);
    res.status(response.status).json(data);
  } catch (err: any) {
    console.error('Offer exchange error:', err);
    res.status(500).json({ error: err.message || 'Failed to negotiate SDP offer' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`AssetPadi proxy server running on http://localhost:${PORT}`));
