// scripts/createAgent.ts
// Run with node ts-node loader to create agent

const API_KEY = process.env.AETHEX_API_KEY || 'ae_live_6cb55b54d7588fefb277d5df381d883f';
const BASE_URL = 'https://api.aethexai.com/api/v1';
const headers = {
  'X-API-Key': API_KEY,
  'Content-Type': 'application/json'
};

async function createAgent() {
  console.log('Fetching available voices...');
  
  // 1. Fetch available voices
  const voicesRes = await fetch(`${BASE_URL}/voices?language=english`, { headers });
  if (!voicesRes.ok) {
    throw new Error(`Failed to fetch voices: ${voicesRes.status} ${voicesRes.statusText}`);
  }
  const voices = await voicesRes.json() as any;
  const voice = voices.find((v: any) => !v.is_cloned) || voices[0];
  
  if (!voice) {
    throw new Error('No voices found');
  }

  console.log(`Using voice: ${voice.id} (${voice.name})`);

  // 2. Create the agent
  console.log('Creating agent on AethexAI...');
  const agentRes = await fetch(`${BASE_URL}/agents`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      name: 'AssetPadi Voice Agent',
      voice_id: voice.id,
      language: 'english',
      first_message: "Hello! I'm AssetPadi. I'm here to help you formalise your business and access credit. Tell me — what kind of business do you run?",
      system_prompt: `You are AssetPadi, a friendly AI guide helping Nigerian informal business owners understand how to formalise their businesses and use the National Collateral Registry (NCR) to access credit.

Speak in short, clear sentences. Be warm and direct — like a knowledgeable friend, not a government official. Use simple language. If the user speaks Pidgin, respond in Pidgin.

YOUR MISSION:
- Correct myths about business registration (especially: "If I register, FIRS will come after me" — this is largely untrue)
- Help them understand CAC registration (costs ~₦10,000–₦15,000, takes 2–5 days)
- Explain what the NCR is and how their machinery/tools can become loan collateral
- Guide them step by step through the formalization journey

KEY FACTS (never invent beyond these):
- CAC Business Name registration: ~₦10,000–₦15,000, cac.gov.ng
- NCR (National Collateral Registry): free/low-cost for individuals, ncr.gov.ng
- Businesses under ₦25M annual turnover qualify for Presumptive Tax — not full FIRS audit
- Qualifying NCR assets: sewing machines, generators, tools, vehicles, equipment, inventory

Keep responses under 3 sentences where possible. Ask one question at a time. Be their padi.`,
    }),
  });

  if (!agentRes.ok) {
    throw new Error(`Failed to create agent: ${agentRes.status} ${agentRes.statusText}`);
  }

  const agent = await agentRes.json() as any;
  console.log(`\n✅ Agent created successfully!`);
  console.log(`Agent ID: ${agent.id}`);
  console.log(`\nPlease add the following line to your backend config or environment:`);
  console.log(`AETHEX_AGENT_ID=${agent.id}`);
}

createAgent().catch(console.error);
