import React, { useState } from 'react';
import { Send, Mic } from 'lucide-react';

interface MessageInputProps {
  onSend: (message: string) => void;
  onVoiceStart: () => void;
  disabled?: boolean;
}

export default function MessageInput({
  onSend,
  onVoiceStart,
  disabled = false
}: MessageInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onSend(text);
    setText('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/60 dark:bg-brand-darkSurface/50 backdrop-blur-md border-t border-gray-200/50 dark:border-white/5 px-4 py-3.5 flex items-center gap-3 w-full"
    >
      {/* Microphone Button */}
      <button
        type="button"
        onClick={onVoiceStart}
        className="w-11 h-11 rounded-2xl bg-white/50 dark:bg-white/5 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/10 transition-colors border border-gray-200/50 dark:border-white/5 active:scale-95 flex-shrink-0 cursor-pointer"
        title="Start voice call with AssetPadi"
      >
        <Mic className="w-5 h-5 text-brand-teal dark:text-brand-purple" />
      </button>

      {/* Input Field */}
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ask AssetPadi anything about CAC or NCR..."
        disabled={disabled}
        className="flex-1 bg-white/50 dark:bg-brand-darkBg/30 focus:bg-white dark:focus:bg-brand-darkBg/60 rounded-2xl px-5 py-3 text-[15px] sm:text-base outline-none border border-gray-200/80 dark:border-brand-darkBorder/60 focus:border-brand-teal dark:focus:border-brand-purple focus:ring-2 focus:ring-brand-teal/10 dark:focus:ring-brand-purple/10 text-brand-dark dark:text-brand-darkText placeholder-gray-400 dark:placeholder-gray-500 transition-all disabled:opacity-50"
      />

      {/* Send Button */}
      <button
        type="submit"
        disabled={disabled || !text.trim()}
        className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-teal to-cyan-600 dark:from-brand-purple dark:to-indigo-600 disabled:from-gray-100 disabled:to-gray-100 dark:disabled:from-white/5 dark:disabled:to-white/5 disabled:text-brand-muted dark:disabled:text-brand-darkMuted flex items-center justify-center text-white transition-all active:scale-95 flex-shrink-0 cursor-pointer shadow-md shadow-brand-teal/10 dark:shadow-brand-purple/20"
      >
        <Send className="w-4 h-4" />
      </button>
    </form>
  );
}
