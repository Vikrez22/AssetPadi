export type MessageRole = 'user' | 'assistant';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

export interface UserProfile {
  name: string;
  businessType: string;
  location: string;
  language: 'english' | 'pidgin';
}

export interface RoadmapStep {
  id: number;
  title: string;
  description: string;
  institution: string;
  institutionUrl: string;
  estimatedCost: string;
  estimatedTime: string;
  completed: boolean;
}

export interface Roadmap {
  generatedAt: Date;
  userProfile: UserProfile;
  steps: RoadmapStep[];
  qualifyingAssets: string[];
}

export interface AppState {
  user: UserProfile | null;
  messages: Message[];
  roadmap: Roadmap | null;
  isLoading: boolean;
  setUser: (user: UserProfile | null) => void;
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  setRoadmap: (roadmap: Roadmap | null) => void;
  setLoading: (loading: boolean) => void;
}
