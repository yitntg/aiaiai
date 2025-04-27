import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const address = req.query.address as string;
  
  if (!address) {
    return res.status(400).json({ error: 'address parameter is required' });
  }
  
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: address,
        key: process.env.GOOGLE_PLACES_API_KEY
      }
    });
    
    if (response.data.status !== 'OK') {
      return res.status(400).json({
        error: `Geocoding API error: ${response.data.status}`,
        details: response.data.error_message
      });
    }
    
    if (response.data.results.length === 0) {
      return res.status(404).json({ error: 'No location found for this address' });
    }
    
    const location = response.data.results[0].geometry.location;
    const formattedAddress = response.data.results[0].formatted_address;
    
    res.status(200).json({
      location: {
        lat: location.lat,
        lng: location.lng
      },
      formatted_address: formattedAddress
    });
  } catch (error: any) {
    console.error('Geocode API error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
} 