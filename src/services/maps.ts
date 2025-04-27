import { Location } from '../types/map';

/**
 * 根据位置数组创建边界框
 */
export function createBoundsForLocations(locations: Location[]): google.maps.LatLngBounds {
  const bounds = new google.maps.LatLngBounds();
  
  locations.forEach(location => {
    bounds.extend(new google.maps.LatLng(location.lat, location.lng));
  });
  
  return bounds;
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
 * 获取两个位置之间的距离（千米）
 */
export function getDistanceBetweenPoints(
  lat1: number, 
  lng1: number, 
  lat2: number, 
  lng2: number
): number {
  const R = 6371; // 地球半径（千米）
  const dLat = deg2rad(lat2 - lat1);
  const dLng = deg2rad(lng2 - lng1);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * 度转弧度
 */
function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
} 