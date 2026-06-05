import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useChat } from '../hooks/useChat';
import { ArrowLeft, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import MessageBubble from '../components/chat/MessageBubble';
import TypingIndicator from '../components/chat/TypingIndicator';
import MessageInput from '../components/chat/MessageInput';
import VoiceCallOverlay from '../components/chat/VoiceCallOverlay';
import { cn } from '../lib/utils';

interface ElegantShapeProps {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
}

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-brand-teal/[0.08]",
}: ElegantShapeProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -50,
        rotate: rotate - 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2.0,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96] as any,
        opacity: { duration: 1.0 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 10 + Math.random() * 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          width,
          height,
        }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border border-black/[0.02]",
            "shadow-[0_8px_32px_0_rgba(0,0,0,0.01)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.3),transparent_70%)]"
          )}
        />
      </motion.div>
    </motion.div>
  );
}

export default function Chat() {
  const navigate = useNavigate();
  const { user, messages, isLoading, setUser } = useApp();
  const { sendMessage } = useChat();

  const [voiceActive, setVoiceActive] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Guard route
  useEffect(() => {
    if (!user) {
      navigate('/onboard');
    }
  }, [user, navigate]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!user) return null;

  const handleLanguageToggle = () => {
    const nextLang = user.language === 'english' ? 'pidgin' : 'english';
    setUser({
      ...user,
      language: nextLang,
    });
    
    const switchNotice = nextLang === 'pidgin'
      ? "[SYSTEM NOTE: The user has switched to Nigerian Pidgin English. Continue the conversation in Pidgin.]"
      : "[SYSTEM NOTE: The user has switched to English. Continue the conversation in English.]";
    
    sendMessage(switchNotice);
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-brand-bg text-brand-dark relative overflow-hidden transition-colors duration-300">
      
      {/* Background Animated Geometric Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <ElegantShape
          delay={0.1}
          width={350}
          height={95}
          rotate={12}
          gradient="from-brand-teal/[0.04]"
          className="left-[-10%] top-[15%]"
        />
        <ElegantShape
          delay={0.3}
          width={300}
          height={80}
          rotate={-15}
          gradient="from-brand-yellow/[0.04]"
          className="right-[-8%] top-[55%]"
        />
        <ElegantShape
          delay={0.2}
          width={180}
          height={48}
          rotate={-8}
          gradient="from-indigo-500/[0.03]"
          className="left-[5%] bottom-[20%]"
        />
        <ElegantShape
          delay={0.4}
          width={120}
          height={32}
          rotate={20}
          gradient="from-green-500/[0.03]"
          className="right-[15%] top-[10%]"
        />
      </div>

      {/* Header */}
      <header className="bg-white/50 backdrop-blur-md border-b border-gray-200/50 px-4 py-3 flex items-center justify-between flex-shrink-0 z-20 shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="text-brand-muted hover:text-brand-dark p-2 rounded-2xl bg-black/5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold leading-none text-brand-dark">AssetPadi</h2>
              <span className="w-2 h-2 rounded-full bg-brand-success inline-block animate-pulse" />
            </div>
            <span className="text-[10px] sm:text-xs text-brand-muted">Ask anything</span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2">
          {/* Language Toggle Switcher */}
          <button
            onClick={handleLanguageToggle}
            className="flex items-center gap-1.5 px-3 py-2 bg-black/5 hover:bg-black/10 rounded-xl border border-gray-200/50 text-xs font-bold transition-all cursor-pointer text-brand-dark"
          >
            <Globe className="w-3.5 h-3.5 text-brand-teal" />
            <span>{user.language === 'english' ? 'EN' : 'PID'}</span>
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-4 scrollbar-thin relative z-10">
        {messages.map((msg) => {
          if (msg.content.startsWith('[SYSTEM NOTE:')) return null;
          return <MessageBubble key={msg.id} message={msg} />;
        })}
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Bar */}
      <div className="flex-shrink-0 relative z-20">
        <MessageInput
          onSend={sendMessage}
          onVoiceStart={() => setVoiceActive(true)}
          disabled={isLoading}
        />
      </div>

      {/* Voice Call Overlay */}
      {voiceActive && (
        <VoiceCallOverlay
          userName={user.name}
          onClose={() => setVoiceActive(false)}
        />
      )}
    </div>
  );
}
