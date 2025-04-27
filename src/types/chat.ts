export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatOptions {
  initialMessage?: string;
  maxMessages?: number;
  apiEndpoint?: string;
}

export interface ChatBoxProps {
  onNewLocations: (locations: any[]) => void;
  onMinimize: () => void;
} 