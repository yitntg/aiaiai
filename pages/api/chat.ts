import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: '消息格式不正确' });
    }

    // 添加系统消息，使AI更好地理解旅行助手的角色
    const systemMessage = {
      role: 'system',
      content: `你是一个友好的旅行助手，可以提供有关旅游目的地、景点、文化和实用旅行建议的信息。
回答应当简洁明了，重点强调有用的事实和建议。
回答中应该包括地点名称，以便系统能够提取并标记在地图上。
当被问及特定城市或地区时，请推荐几个值得参观的景点、餐厅或住宿选择。
保持友好和鼓励的语气，并随时准备提供后续信息。`
    };

    const messagesWithSystem = [systemMessage, ...messages];

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messagesWithSystem,
      temperature: 0.7,
      max_tokens: 1000,
    });

    const aiMessage = response.choices[0].message;

    res.status(200).json({
      message: {
        role: 'assistant',
        content: aiMessage.content || '对不起，我无法生成回复。'
      }
    });
  } catch (error: any) {
    console.error('OpenAI API error:', error);
    
    res.status(500).json({
      message: {
        role: 'assistant',
        content: '很抱歉，发生了错误。请再试一次。'
      }
    });
  }
} 