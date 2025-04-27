import { LatLngBounds, LatLngBoundsExpression } from 'leaflet';
import { Location } from '../types/map';

/**
 * 根据位置数组创建边界框
 */
export function createBoundsForLocations(locations: Location[]): LatLngBoundsExpression {
  return locations.map(loc => [loc.lat, loc.lng]) as LatLngBoundsExpression;
}

/**
 * 获取默认的谷歌地图选项
 */
export function getDefaultMapOptions(): google.maps.MapOptions {
  return {
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: true,
    scaleControl: true,
    streetViewControl: true,
    rotateControl: true,
    fullscreenControl: true,
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'on' }]
      },
      {
        featureType: 'transit',
        elementType: 'labels',
        stylers: [{ visibility: 'on' }]
      }
    ]
  };
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
 * 将地址转换为坐标（这需要您自己实现，或使用第三方服务）
 */
export async function geocodeAddress(address: string): Promise<Location | null> {
  try {
    // 这里应该实现地理编码逻辑
    // 由于我们不使用 Google Maps API，您可以使用其他服务如 Nominatim (OpenStreetMap)
    // 下面是一个模拟示例
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