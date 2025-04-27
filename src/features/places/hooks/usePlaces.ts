import { useState, useCallback } from 'react';
import { PlaceDetails } from '../../../types/place';
import { Location } from '../../../types/map';
import { getPlaceDetails, searchPlaces, geocodeAddress } from '../../../services/places';
import { placeToLocation } from '../utils/placeFormatter';

interface UsePlacesResult {
  searchResults: PlaceDetails[];
  selectedPlace: PlaceDetails | null;
  isLoading: boolean;
  error: string | null;
  searchNearby: (query: string, location?: Location) => Promise<void>;
  getPlaceById: (placeId: string) => Promise<PlaceDetails | null>;
  geocodePlace: (address: string) => Promise<Location | null>;
  clearResults: () => void;
}

export default function usePlaces(): UsePlacesResult {
  const [searchResults, setSearchResults] = useState<PlaceDetails[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<PlaceDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 搜索附近地点
  const searchNearby = useCallback(async (
    query: string,
    location?: Location
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const center = location ? { lat: location.lat, lng: location.lng } : undefined;
      const results = await searchPlaces(query, center);
      
      setSearchResults(results);
      
      // 自动选择第一个结果
      if (results.length > 0) {
        setSelectedPlace(results[0]);
      }
      
      return results;
    } catch (err: any) {
      setError(err.message || '搜索地点时出错');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // 根据ID获取地点详情
  const getPlaceById = useCallback(async (placeId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const place = await getPlaceDetails(placeId);
      
      if (place) {
        setSelectedPlace(place);
      }
      
      return place;
    } catch (err: any) {
      setError(err.message || '获取地点详情时出错');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // 地理编码：将地址转换为坐标
  const geocodePlace = useCallback(async (address: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const coordinates = await geocodeAddress(address);
      
      if (!coordinates) {
        setError('无法找到该地址的坐标');
        return null;
      }
      
      return {
        id: `place-${Date.now()}`,
        lat: coordinates.lat,
        lng: coordinates.lng,
        name: address
      } as Location;
    } catch (err: any) {
      setError(err.message || '地理编码时出错');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // 清除搜索结果
  const clearResults = useCallback(() => {
    setSearchResults([]);
    setSelectedPlace(null);
    setError(null);
  }, []);
  
  return {
    searchResults,
    selectedPlace,
    isLoading,
    error,
    searchNearby,
    getPlaceById,
    geocodePlace,
    clearResults
  };
}