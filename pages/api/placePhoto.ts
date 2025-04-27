import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const photoRef = req.query.photoRef as string;
  const maxWidth = req.query.maxWidth || 400;
  
  if (!photoRef) {
    return res.status(400).json({ error: 'photoRef parameter is required' });
  }
  
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/photo', {
      params: {
        photoreference: photoRef,
        maxwidth: maxWidth,
        key: process.env.GOOGLE_PLACES_API_KEY
      },
      responseType: 'arraybuffer'
    });
    
    // 获取内容类型
    const contentType = response.headers['content-type'];
    
    // 设置正确的内容类型
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400'); // 缓存24小时
    
    // 返回图片二进制数据
    res.status(200).send(response.data);
  } catch (error: any) {
    console.error('Photo API error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
} 