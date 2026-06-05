import { createContext, useContext, useState, ReactNode } from 'react';
import { AppState, UserProfile, Message, Roadmap } from '../types';

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [isLoading, setLoading] = useState(false);

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  return (
    <AppContext.Provider value={{
      user,
      messages,
      roadmap,
      isLoading,
      setUser,
      addMessage,
      setMessages,
      setRoadmap,
      setLoading
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
