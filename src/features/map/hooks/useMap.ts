import { useState, useCallback, useEffect } from 'react';
import { Location } from '../../../types/map';
import { createBoundsForLocations } from '../../../services/maps';
import config from '../../../config';

interface UseMapResult {
  map: google.maps.Map | null;
  setMap: (map: google.maps.Map | null) => void;
  selectedLocation: Location | null;
  setSelectedLocation: (location: Location | null) => void;
  centerMap: (location: Location) => void;
  fitBounds: (locations: Location[]) => void;
  isInfoWindowOpen: boolean;
  openInfoWindow: () => void;
  closeInfoWindow: () => void;
}

export default function useMap(initialLocations: Location[] = []): UseMapResult {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isInfoWindowOpen, setIsInfoWindowOpen] = useState(false);
  
  // 地图上的标记点变化时，自动适应边界
  useEffect(() => {
    if (map && initialLocations.length > 0) {
      fitBounds(initialLocations);
    }
  }, [map, initialLocations]);
  
  // 将地图中心设置到指定位置
  const centerMap = useCallback((location: Location) => {
    if (!map) return;
    
    map.setCenter({
      lat: location.lat,
      lng: location.lng
    });
    
    // 设置适当的缩放级别
    map.setZoom(14);
  }, [map]);
  
  // 调整地图边界以包含所有标记
  const fitBounds = useCallback((locations: Location[]) => {
    if (!map || !locations.length) return;
    
    const bounds = createBoundsForLocations(locations);
    map.fitBounds(bounds);
    
    // 如果只有一个位置，额外设置缩放级别
    if (locations.length === 1) {
      map.setZoom(14);
    }
  }, [map]);
  
  // 打开信息窗口
  const openInfoWindow = useCallback(() => {
    setIsInfoWindowOpen(true);
  }, []);
  
  // 关闭信息窗口
  const closeInfoWindow = useCallback(() => {
    setIsInfoWindowOpen(false);
  }, []);
  
  return {
    map,
    setMap,
    selectedLocation,
    setSelectedLocation,
    centerMap,
    fitBounds,
    isInfoWindowOpen,
    openInfoWindow,
    closeInfoWindow
  };
} 