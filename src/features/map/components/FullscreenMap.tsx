'use client';

import { useEffect, useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Location } from '../../../types/map';
import { createBoundsForLocations, getDefaultMapOptions } from '../../../services/maps';

interface FullscreenMapProps {
  locations: Location[];
  selectedLocation: Location | null;
  setSelectedLocation: (location: Location | null) => void;
}

export default function FullscreenMap({ 
  locations, 
  selectedLocation, 
  setSelectedLocation 
}: FullscreenMapProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [infoWindowOpen, setInfoWindowOpen] = useState<boolean>(false);

  // 加载Google Maps API
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  // 当加载新位置时，自动调整地图视图
  useEffect(() => {
    if (map && locations.length > 0) {
      const bounds = createBoundsForLocations(locations);
      map.fitBounds(bounds);
      
      // 如果只有一个位置，适当缩放
      if (locations.length === 1) {
        map.setZoom(13);
      }
    }
  }, [map, locations]);

  // 地图加载完成时的回调
  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  // 地图卸载时的回调
  const onMapUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // 点击标记时的回调
  const handleMarkerClick = (location: Location) => {
    setSelectedLocation(location);
    setInfoWindowOpen(true);
  };

  // 关闭信息窗口
  const handleInfoWindowClose = () => {
    setInfoWindowOpen(false);
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={{
        width: '100%',
        height: '100%'
      }}
      options={getDefaultMapOptions()}
      onLoad={onMapLoad}
      onUnmount={onMapUnmount}
    >
      {/* 渲染所有地点标记 */}
      {locations.map((location, index) => (
        <Marker
          key={`${location.lat}-${location.lng}-${index}`}
          position={{ lat: location.lat, lng: location.lng }}
          title={location.name}
          onClick={() => handleMarkerClick(location)}
          animation={google.maps.Animation.DROP}
        />
      ))}

      {/* 显示选中地点的信息窗口 */}
      {selectedLocation && infoWindowOpen && (
        <InfoWindow
          position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
          onCloseClick={handleInfoWindowClose}
        >
          <div className="p-2 max-w-xs">
            <h3 className="font-bold text-lg mb-1">{selectedLocation.name}</h3>
            {selectedLocation.image && (
              <img 
                src={selectedLocation.image} 
                alt={selectedLocation.name}
                className="w-full h-32 object-cover rounded-lg mb-2"
              />
            )}
            {selectedLocation.description && (
              <p className="text-sm text-gray-700">{selectedLocation.description}</p>
            )}
            {selectedLocation.rating && (
              <div className="flex items-center mt-1">
                <span className="text-sm mr-1">评分:</span>
                <span className="font-medium">{selectedLocation.rating}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            )}
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  ) : (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );
} 