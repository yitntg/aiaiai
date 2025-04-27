import { Location } from '../../../types/map';

/**
 * 生成随机颜色，用于标记点
 */
export function getRandomColor(): string {
  const colors = [
    '#3498db', // 蓝色
    '#e74c3c', // 红色
    '#2ecc71', // 绿色
    '#f39c12', // 橙色
    '#9b59b6', // 紫色
    '#1abc9c', // 青绿色
    '#d35400', // 深橙色
    '#c0392b', // 深红色
    '#16a085', // 深青绿色
    '#8e44ad', // 深紫色
    '#27ae60', // 深绿色
    '#f1c40f', // 黄色
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * 创建自定义标记点图标
 */
export function createMarkerIcon(color: string = '#3498db', selected: boolean = false): google.maps.Symbol {
  return {
    path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
    fillColor: color,
    fillOpacity: 1,
    scale: selected ? 1.5 : 1.2,
    strokeColor: 'white',
    strokeWeight: 2,
    anchor: new google.maps.Point(12, 22),
  };
}

/**
 * 格式化距离
 * @param meters 距离（米）
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}米`;
  } else {
    return `${(meters / 1000).toFixed(1)}公里`;
  }
}

/**
 * 获取两个位置之间的距离（米）
 */
export function getDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371e3; // 地球半径（米）
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * 根据ID查找位置
 */
export function findLocationById(locations: Location[], id: string): Location | undefined {
  return locations.find(loc => loc.id === id);
} 