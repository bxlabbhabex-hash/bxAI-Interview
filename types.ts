
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Agent {
  id: string;
  name: string;
  voice: string;
  description: string;
  status: 'online' | 'offline';
}

export interface CallLog {
  id: string;
  agentName: string;
  duration: string;
  date: string;
  sentiment: 'positive' | 'neutral' | 'negative';
}
