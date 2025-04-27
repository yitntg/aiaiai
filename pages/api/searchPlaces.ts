import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const query = req.query.query as string;
  const lat = req.query.lat ? parseFloat(req.query.lat as string) : undefined;
  const lng = req.query.lng ? parseFloat(req.query.lng as string) : undefined;
  const radius = req.query.radius ? parseInt(req.query.radius as string) : 5000;
  
  if (!query) {
    return res.status(400).json({ error: 'query parameter is required' });
  }
  
  try {
    // 构建API请求参数
    const params: any = {
      query: query,
      key: process.env.GOOGLE_PLACES_API_KEY,
      language: 'zh-CN',
    };
    
    // 如果提供了位置，使用附近搜索
    if (lat !== undefined && lng !== undefined) {
      params.location = `${lat},${lng}`;
      params.radius = radius;
    }
    
    // 请求Google Places API
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
      params: params
    });
    
    if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
      return res.status(400).json({
        error: `Places API error: ${response.data.status}`,
        details: response.data.error_message
      });
    }
    
    // 将结果转换为我们期望的格式
    const results = response.data.results.map((place: any) => ({
      place_id: place.place_id,
      name: place.name,
      formatted_address: place.formatted_address,
      geometry: place.geometry,
      rating: place.rating,
      user_ratings_total: place.user_ratings_total,
      photos: place.photos,
      types: place.types,
      price_level: place.price_level,
      opening_hours: place.opening_hours
    }));
    
    res.status(200).json({
      results: results,
      next_page_token: response.data.next_page_token
    });
  } catch (error: any) {
    console.error('Places Search API error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
} 