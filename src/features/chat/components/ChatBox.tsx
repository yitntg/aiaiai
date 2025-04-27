'use client';

import { useState, useEffect, useRef } from 'react';
import { Message } from '../../../types/chat';
import { Location } from '../../../types/map';
import { sendChatMessage, extractLocations } from '../../../services/ai';

interface ChatBoxProps {
  onNewLocations: (locations: Location[]) => void;
  onMinimize: () => void;
}

export default function ChatBox({ onNewLocations, onMinimize }: ChatBoxProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '你好！我是你的AI旅行助手。告诉我你想去哪里旅行，我可以提供相关信息。' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    // 添加用户消息
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setInput('');
    
    try {
      // 获取AI回复
      const aiResponse = await sendChatMessage([...messages, userMessage]);
      setMessages(prev => [...prev, aiResponse]);
      
      // 从回复中提取地点信息并添加到地图
      const extractedLocations = await extractLocations(aiResponse.content);
      if (extractedLocations.length > 0) {
        onNewLocations(extractedLocations);
      }
    } catch (error) {
      console.error('Error in chat:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '很抱歉，发生了错误。请再试一次。' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-white bg-opacity-95 rounded-lg shadow-lg flex flex-col h-full border border-gray-200">
      {/* 标题栏 */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-blue-500 text-white rounded-t-lg">
        <h3 className="font-medium">AI旅行助手</h3>
        <button 
          onClick={onMinimize}
          className="p-1 rounded-full hover:bg-blue-400 focus:outline-none"
          title="最小化"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* 消息显示区域 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] rounded-lg px-4 py-2 ${
                msg.role === 'user' 
                  ? 'bg-blue-500 text-white rounded-br-none' 
                  : 'bg-gray-100 text-gray-800 rounded-bl-none shadow-sm'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 rounded-lg rounded-bl-none px-4 py-2 shadow-sm">
              <div className="flex space-x-2">
                <div className="h-3 w-3 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="h-3 w-3 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="h-3 w-3 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* 输入区域 */}
      <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="问我关于旅行的问题..."
          disabled={isLoading}
          className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
        >
          发送
        </button>
      </form>
    </div>
  );
} 