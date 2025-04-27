import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const placeId = req.query.placeId as string;
  
  if (!placeId) {
    return res.status(400).json({ error: 'placeId parameter is required' });
  }
  
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
      params: {
        place_id: placeId,
        key: process.env.GOOGLE_PLACES_API_KEY,
        language: 'zh-CN',
        fields: 'name,formatted_address,rating,photos,opening_hours,price_level,types,user_ratings_total'
      }
    });
    
    if (response.data.status !== 'OK') {
      return res.status(400).json({
        error: `Place Details API error: ${response.data.status}`,
        details: response.data.error_message
      });
    }
    
    // 处理返回的数据，只返回我们需要的字段
    const result = response.data.result;
    
    res.status(200).json({
      result: {
        name: result.name,
        formatted_address: result.formatted_address,
        rating: result.rating,
        photos: result.photos,
        opening_hours: result.opening_hours,
        price_level: result.price_level,
        types: result.types,
        user_ratings_total: result.user_ratings_total
      }
    });
  } catch (error: any) {
    console.error('Place Details API error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
} 