import { Message } from '../types/chat';
import { Location } from '../types/map';

/**
 * 向AI发送聊天消息
 */
export async function sendChatMessage(messages: Message[]): Promise<Message> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error('AI响应错误');
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error('AI服务错误:', error);
    return {
      role: 'assistant',
      content: '很抱歉，我无法连接到AI服务。请检查您的网络连接或稍后再试。'
    };
  }
}

/**
 * 从AI回复中提取地点信息
 */
export async function extractLocations(text: string): Promise<Location[]> {
  try {
    const response = await fetch('/api/extractLocations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error('提取地点失败');
    }

    const data = await response.json();
    return data.locations;
  } catch (error) {
    console.error('地点提取错误:', error);
    return [];
  }
} 