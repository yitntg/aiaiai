import { PlaceDetails } from '../../../types/place';
import { Location } from '../../../types/map';

/**
 * 将PlaceDetails转换为Location对象
 */
export function placeToLocation(place: PlaceDetails, placeId: string): Location {
  return {
    id: placeId,
    lat: place.geometry?.location.lat ?? 0,
    lng: place.geometry?.location.lng ?? 0,
    name: place.name,
    description: place.formatted_address,
    rating: place.rating
  };
}

/**
 * 格式化价格级别
 * @param priceLevel 价格级别（0-4）
 */
export function formatPriceLevel(priceLevel?: number): string {
  if (priceLevel === undefined) return '价格信息不可用';
  
  const symbols = ['¥', '¥¥', '¥¥¥', '¥¥¥¥', '¥¥¥¥¥'];
  return priceLevel >= 0 && priceLevel < symbols.length
    ? symbols[priceLevel]
    : symbols[0];
}

/**
 * 格式化评分
 */
export function formatRating(rating?: number, totalRatings?: number): string {
  if (rating === undefined) return '无评分';
  
  const ratingText = rating.toFixed(1);
  return totalRatings
    ? `${ratingText} (${formatTotalRatings(totalRatings)})`
    : ratingText;
}

/**
 * 格式化总评分数量
 */
export function formatTotalRatings(total: number): string {
  if (total >= 1000) {
    return `${(total / 1000).toFixed(1)}k+`;
  }
  return `${total}`;
}

/**
 * 格式化营业状态
 */
export function formatOpenStatus(openNow?: boolean): { text: string; color: string } {
  if (openNow === undefined) {
    return { text: '营业信息不可用', color: 'text-gray-500' };
  }
  
  return openNow
    ? { text: '营业中', color: 'text-green-600' }
    : { text: '休息中', color: 'text-red-600' };
}

/**
 * 格式化地点类型为用户友好的文本
 */
export function formatPlaceType(type: string): string {
  // 替换下划线为空格
  const withSpaces = type.replace(/_/g, ' ');
  
  // 首字母大写
  return withSpaces
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
} 