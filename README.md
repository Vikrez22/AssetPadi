# AssetPadi

> **Formalise. Register. Access Capital.**  
> *Economic & Financial Access (Hackathon MVP)*

---

## Overview

Between **85–92% of informal businesses in Nigeria** avoid formalization because of tax anxiety and bureaucratic complexity. This locking out of over 40 million MSMEs from credit contributes to a massive ₦13 trillion credit gap. 

**AssetPadi** bridges this gap. It is a conversational AI assistant designed to:
1. **Demystify the formalization journey** in plain English and Nigerian Pidgin.
2. **Dispel FIRS tax myths** (e.g., explaining that CAC registration doesn't trigger automatic tax audits for businesses under ₦25M revenue).
3. **Identify movable assets** (like industrial sewing machines, generators, and tools) that qualify as collateral.
4. **Guide users through CAC and the National Collateral Registry (NCR)** to secure capital.

---

## Features

* **Interactive AI Chat**: Powered by `llama-3.3-70b-versatile` via Groq, providing contextual, warm, and highly credible guidance on CAC and NCR.
* **Real-time WebRTC Voice Assistant**: Fully integrated AethexAI voice calling. Talk to the assistant directly in English or Pidgin.
* **Siri-Style Calling UI**: A high-end call overlay featuring:
  * Ambient particle animations and glowing audio rings.
  * Real-time user/agent speech detection via the Web Audio API.
  * Toggles between *"Listening..."* (teal waves) and *"Speaking..."* (green waves) based on live audio analysis.
  * Flatlining waveform visualizer during silence.
* **Guided Onboarding**: A 3-question introduction (name, business type, and primary language selection) to ground the AI conversation context.
* **Personalized Roadmaps**: Dynamic parser extracts a step-by-step PDF-style CAC & NCR registration checklist directly from AI recommendations.
* **Modern Responsive Styling**: Built using an elegant HSL-tailored Teal & Yellow brand design system featuring responsive glassmorphic cards, Outfit/Inter typography, and smooth Framer Motion transitions.

---

## Technology Stack

* **Frontend**: React + Vite + TypeScript + Tailwind CSS + Framer Motion + Lucide Icons
* **Backend Proxy**: Node.js + Express + CORS (handles secure signaling for WebRTC calls)
* **LLM Orchestration**: Groq SDK (`llama-3.3-70b-versatile`)
* **Voice Agent Services**: AethexAI WebRTC Voice Conversation API

---

## Repository Structure

```
assetpadi/
├── public/                 # Static assets & favicons
├── scripts/                # Utility scripts
│   └── createAgent.ts      # Automatic Aethex voice agent setup
├── server/                 # Express backend proxy server
│   ├── aethex.ts           # AethexAI base endpoints & API keys
│   └── index.ts            # Proxy server listening for WebRTC signaling (CORS handled)
├── src/                    # Frontend React code
│   ├── components/         # Reusable UI components
│   │   ├── chat/           # Chat window, Message input & Voice Overlay
│   │   ├── onboarding/     # Onboarding forms
│   │   ├── roadmap/        # Roadmap steps
│   │   └── ui/             # Core UI atoms (Button, Logo, Dropdown)
│   ├── context/            # AppContext (global state: user, messages, roadmap)
│   ├── hooks/              # Custom hooks (useChat, useVoice)
│   ├── pages/              # Landing, Onboarding, Chat, and Roadmap views
│   ├── types/              # Type definitions (Message, User, RoadmapStep)
│   └── index.css           # Styling tokens & Tailwind core system
├── index.html              # Custom SVG brand favicon integration
├── package.json            # Bootscripts, dev-servers & workspaces
└── tsconfig.json           # Type configurations
```

---

## Getting Started

### 1. Prerequisites
Ensure you have **Node.js 18+** installed on your system.

### 2. Installation
Clone the repository and install the dependencies for the application:
```bash
git clone https://github.com/Vikrez22/AssetPadi.git
cd AssetPadi
npm install
```

### 3. Environment Setup
Create a `.env` file at the root of your project:
```env
# AethexAI Voice Agent Keys
AETHEX_API_KEY=ae_live_...
AETHEX_AGENT_ID=9c8d96ca-...

# Port for Backend Proxy
PORT=3001
FRONTEND_URL=http://localhost:5173

# Frontend variables (Vite-prefixed)
VITE_GROQ_API_KEY=gsk_...
VITE_SERVER_URL=http://localhost:3001
```

*(Note: Sensitive configurations are ignored by git in `.gitignore`)*

### 4. Running Locally

Start both the frontend development server and the backend Express proxy in parallel:

**Terminal 1: Start Frontend**
```bash
npm run dev
```
*(Runs by default on http://localhost:5173)*

**Terminal 2: Start Backend Proxy**
```bash
npm run dev:server
```
*(Runs on http://localhost:3001)*

---

## Security & Compliance
* **Ignore Lists**: Build outputs (`dist`), local modules (`node_modules`), and all local environments (`.env`, `.env.local`) are strictly ignored.
* **No Client Secrets**: Private API keys for AethexAI are kept on the Express backend server and never sent to the client browser.
