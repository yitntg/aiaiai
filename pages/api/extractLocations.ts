import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { geocodeAddress } from '../../src/services/places';
import { Location } from '../../src/types/map';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: '文本格式不正确' });
    }

    // 使用OpenAI提取地点
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `你是一个专门从文本中提取地点信息的助手。请从以下文本中提取所有提到的地点名称，并以JSON格式返回结果。
只返回JSON数组，不要包含任何其他解释。例如：["北京", "上海", "长城"]`
        },
        {
          role: 'user',
          content: text
        }
      ],
      temperature: 0.3,
    });

    const content = response.choices[0].message.content || '[]';
    let extractedPlaces = [];

    try {
      // 尝试解析AI返回的JSON
      extractedPlaces = JSON.parse(content);
      
      // 确保结果是数组
      if (!Array.isArray(extractedPlaces)) {
        extractedPlaces = [];
      }
    } catch (e) {
      console.error('解析地点失败:', e);
      
      // 如果解析失败，尝试通过正则表达式提取
      const regex = /"([^"]+)"/g;
      const matches = content.match(regex);
      if (matches) {
        extractedPlaces = matches.map(m => m.replace(/"/g, ''));
      }
    }

    // 地理编码：将地点名称转换为坐标
    const locationsPromises = extractedPlaces.map(async (placeName) => {
      try {
        const location = await geocodeAddress(placeName);
        if (location) {
          return {
            id: `place-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: placeName,
            lat: location.lat,
            lng: location.lng
          } as Location;
        }
        return null;
      } catch (error) {
        console.error(`地理编码错误 (${placeName}):`, error);
        return null;
      }
    });

    const locations = (await Promise.all(locationsPromises)).filter(Boolean) as Location[];

    res.status(200).json({ locations });
  } catch (error: any) {
    console.error('提取地点错误:', error);
    res.status(500).json({ error: error.message || '服务器错误', locations: [] });
  }
} 