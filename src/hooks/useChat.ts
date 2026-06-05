import { useApp } from '../context/AppContext';
import { groqClient, GROQ_MODEL } from '../lib/groq';
import { buildSystemPrompt } from '../lib/systemPrompt';
import { parseRoadmapFromResponse } from '../lib/roadmapParser';
import { Message } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

export function useChat() {
  const { user, messages, addMessage, setLoading, setRoadmap } = useApp();
  const navigate = useNavigate();

  const sendMessage = async (content: string) => {
    if (!content.trim() || !user) return;

    // 1. Create and add user message
    const userMsg: Message = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    addMessage(userMsg);
    setLoading(true);

    // Prepare current messages conversation log for the API call
    // Note: React state update is batched, so "messages" state doesn't have "userMsg" yet in this execution context scope. We must add it manually.
    const apiMessages = [
      ...messages.map(m => ({ role: m.role, content: m.content })),
      { role: userMsg.role, content: userMsg.content }
    ];

    try {
      const response = await groqClient.chat.completions.create({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: buildSystemPrompt(user) },
          ...apiMessages,
        ],
        max_tokens: 1024,
        temperature: 0.7,
      });

      const aiContent = response.choices[0]?.message?.content ?? '';

      // Check if LLM response indicates a roadmap should be generated
      const generatedRoadmap = parseRoadmapFromResponse(aiContent, user, [...messages, userMsg]);

      // Strip [GENERATE_ROADMAP] tag before displaying message to user
      const cleanContent = aiContent.replace('[GENERATE_ROADMAP]', '').trim();

      const aiMsg: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: cleanContent || (user.language === 'pidgin' ? "I go prepare your roadmap now..." : "I will prepare your roadmap now..."),
        timestamp: new Date(),
      };
      addMessage(aiMsg);

      if (generatedRoadmap) {
        setRoadmap(generatedRoadmap);
        // Navigate with a small delay so the user sees the final text response before redirect
        setTimeout(() => {
          navigate('/roadmap');
        }, 1500);
      }
    } catch (err) {
      console.error('Groq error:', err);
      addMessage({
        id: uuidv4(),
        role: 'assistant',
        content: user.language === 'pidgin' 
          ? 'Sorry o, my network get small issue. Abeg try send your message again!'
          : 'Sorry, I am having trouble connecting right now. Please try sending your message again.',
        timestamp: new Date(),
      });
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage };
}
