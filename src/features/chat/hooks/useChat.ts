import { useState, useCallback } from 'react';
import { Message } from '../../../types/chat';
import { Location } from '../../../types/map';
import { sendChatMessage, extractLocations } from '../../../services/ai';
import config from '../../../config';

interface UseChatResult {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
}

export default function useChat(
  onNewLocations?: (locations: Location[]) => void
): UseChatResult {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: config.chat.initialMessage }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  // 发送消息
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;
    
    // 添加用户消息
    const userMessage: Message = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // 获取AI回复
      const aiResponse = await sendChatMessage([...messages, userMessage]);
      setMessages(prev => {
        // 限制消息历史记录长度
        const newMessages = [...prev, aiResponse];
        if (newMessages.length > config.chat.maxMessages) {
          // 保留系统消息，移除较早的用户/助手对话
          return [
            newMessages[0], // 系统消息
            ...newMessages.slice(-(config.chat.maxMessages - 1))
          ];
        }
        return newMessages;
      });
      
      // 从回复中提取地点
      if (onNewLocations) {
        const extractedLocations = await extractLocations(aiResponse.content);
        if (extractedLocations.length > 0) {
          onNewLocations(extractedLocations);
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      
      // 添加错误消息
      setMessages(prev => [
        ...prev,
        { 
          role: 'assistant', 
          content: '很抱歉，发生了错误。请再试一次。' 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, onNewLocations]);
  
  // 清除消息历史
  const clearMessages = useCallback(() => {
    setMessages([
      { role: 'assistant', content: config.chat.initialMessage }
    ]);
  }, []);
  
  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages
  };
} 