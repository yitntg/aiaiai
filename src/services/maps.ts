import { LatLngBounds, LatLngBoundsExpression } from 'leaflet';
import { Location } from '../types/map';

/**
 * 根据位置数组创建边界框
 */
export function createBoundsForLocations(locations: Location[]): LatLngBoundsExpression {
  return locations.map(loc => [loc.lat, loc.lng]) as LatLngBoundsExpression;
}

/**
 * 计算两点之间的距离（使用 Haversine 公式）
 */
export function calculateDistanceInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // 地球半径，单位：公里
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/**
 * 按距离范围过滤位置
 */
export function filterLocationsByDistance(
  center: { lat: number, lng: number },
  locations: Location[],
  maxDistanceKm: number
): Location[] {
  return locations.filter(loc => {
    const distance = calculateDistanceInKm(
      center.lat, center.lng,
      loc.lat, loc.lng
    );
    return distance <= maxDistanceKm;
  });
}

/**
 * 将地址转换为坐标（模拟实现）
 */
export async function geocodeAddress(address: string): Promise<Location | null> {
  try {
    // 这里是模拟实现
    // 在实际应用中，可以使用 Nominatim (OpenStreetMap) 的免费 API
    return {
      id: `id-${Date.now()}`,
      lat: 39.9042, // 默认北京坐标
      lng: 116.4074,
      title: address,
      description: `位于 ${address} 的位置`
    };
  } catch (error) {
    console.error('地理编码失败:', error);
    return null;
  }
} 