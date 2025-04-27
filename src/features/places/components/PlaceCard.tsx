'use client';

import React, { useState, useEffect } from 'react';
import { PlaceDetails } from '../../../types/place';
import { getPlaceDetails, getPlacePhotoUrl } from '../../../services/places';

interface PlaceCardProps {
  placeId: string;
  onClose?: () => void;
}

export default function PlaceCard({ placeId, onClose }: PlaceCardProps) {
  const [place, setPlace] = useState<PlaceDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function loadPlaceDetails() {
      try {
        setLoading(true);
        const details = await getPlaceDetails(placeId);
        setPlace(details);
      } catch (err) {
        setError('无法加载地点信息');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    loadPlaceDetails();
  }, [placeId]);
  
  // 格式化价格级别为人民币符号
  const formatPriceLevel = (level?: number) => {
    if (level === undefined) return '价格信息不可用';
    return '¥'.repeat(level) + '·'.repeat(4 - level);
  };
  
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-md">
        <div className="animate-pulse">
          <div className="h-48 bg-gray-300 rounded-md mb-4"></div>
          <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        </div>
      </div>
    );
  }
  
  if (error || !place) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-md">
        <p className="text-red-500">
          {error || '无法加载地点信息'}
        </p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          关闭
        </button>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-md">
      {/* 图片区域 */}
      {place.photos && place.photos.length > 0 ? (
        <div className="relative h-48">
          <img
            src={getPlacePhotoUrl(place.photos[0].photo_reference)}
            alt={place.name}
            className="w-full h-full object-cover"
          />
          {place.rating && (
            <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full flex items-center shadow">
              <span className="text-yellow-500 mr-1">★</span>
              <span className="font-medium">{place.rating}</span>
              <span className="text-gray-500 text-xs ml-1">({place.user_ratings_total})</span>
            </div>
          )}
        </div>
      ) : (
        <div className="h-32 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">无图片</span>
        </div>
      )}
      
      {/* 内容区域 */}
      <div className="p-4">
        <h2 className="text-xl font-bold mb-1">{place.name}</h2>
        <p className="text-gray-600 mb-3">{place.formatted_address}</p>
        
        {/* 营业状态 */}
        {place.opening_hours && (
          <div className="mb-2">
            <span className={`inline-block px-2 py-1 rounded text-sm ${
              place.opening_hours.open_now 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {place.opening_hours.open_now ? '营业中' : '休息中'}
            </span>
          </div>
        )}
        
        {/* 价格级别 */}
        {place.price_level !== undefined && (
          <div className="mb-2">
            <span className="text-gray-700">{formatPriceLevel(place.price_level)}</span>
          </div>
        )}
        
        {/* 类型标签 */}
        {place.types && place.types.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {place.types.slice(0, 4).map(type => (
              <span key={type} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                {type.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        )}
        
        {/* 按钮区域 */}
        <div className="mt-4 flex justify-between">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${place.name}&query_place_id=${placeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            在Google地图中查看
          </a>
          
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              关闭
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 