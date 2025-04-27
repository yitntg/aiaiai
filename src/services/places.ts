import { PlaceDetails, PlacePhoto } from '../types/place';

/**
 * 获取地点详情
 * @param placeId Google Place ID
 */
export async function getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
  try {
    const response = await fetch(`/api/placeDetails?placeId=${placeId}`);
    
    if (!response.ok) {
      throw new Error('获取地点详情失败');
    }
    
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('地点详情服务错误:', error);
    return null;
  }
}

/**
 * 获取地点照片URL
 * @param photoReference 照片引用ID
 * @param maxWidth 最大宽度
 */
export function getPlacePhotoUrl(photoReference: string, maxWidth: number = 400): string {
  return `/api/placePhoto?photoRef=${photoReference}&maxWidth=${maxWidth}`;
}

/**
 * 搜索地点
 * @param query 搜索关键词
 * @param location 搜索中心位置
 * @param radius 搜索半径（米）
 */
export async function searchPlaces(
  query: string, 
  location?: { lat: number, lng: number }, 
  radius: number = 5000
): Promise<PlaceDetails[]> {
  try {
    const locationParam = location ? `&lat=${location.lat}&lng=${location.lng}` : '';
    const response = await fetch(`/api/searchPlaces?query=${encodeURIComponent(query)}${locationParam}&radius=${radius}`);
    
    if (!response.ok) {
      throw new Error('地点搜索失败');
    }
    
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('地点搜索服务错误:', error);
    return [];
  }
}

/**
 * 地理编码：将地址转换为坐标
 * @param address 地址文本
 */
export async function geocodeAddress(address: string): Promise<{ lat: number, lng: number } | null> {
  try {
    const response = await fetch(`/api/geocode?address=${encodeURIComponent(address)}`);
    
    if (!response.ok) {
      throw new Error('地理编码失败');
    }
    
    const data = await response.json();
    return data.location;
  } catch (error) {
    console.error('地理编码服务错误:', error);
    return null;
  }
} 