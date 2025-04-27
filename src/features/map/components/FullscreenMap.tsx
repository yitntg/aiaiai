'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Location } from '../../../types/map';
import 'leaflet/dist/leaflet.css';
import { divIcon, icon } from 'leaflet';
import { createPortal } from 'react-dom';

// 解决 Leaflet 默认图标问题
const defaultIcon = icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface FullscreenMapProps {
  locations: Location[];
  selectedLocation: Location | null;
  setSelectedLocation: (location: Location | null) => void;
}

// 用于调整地图视图的组件
function MapUpdater({ locations }: { locations: Location[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (locations.length > 0) {
      // 创建边界
      const bounds = locations.map(loc => [loc.lat, loc.lng]);
      map.fitBounds(bounds as any);
      
      // 如果只有一个位置，设置适当的缩放级别
      if (locations.length === 1) {
        map.setView([locations[0].lat, locations[0].lng], 13);
      }
    }
  }, [locations, map]);
  
  return null;
}

export default function FullscreenMap({ 
  locations, 
  selectedLocation, 
  setSelectedLocation 
}: FullscreenMapProps) {
  // 默认中国中心位置
  const defaultCenter = { lat: 35.0, lng: 105.0 };
  const defaultZoom = 4;
  
  // 处理标记点击
  const handleMarkerClick = (location: Location) => {
    setSelectedLocation(location);
  };
  
  // 确保客户端渲染
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <MapContainer
      center={[defaultCenter.lat, defaultCenter.lng]}
      zoom={defaultZoom}
      style={{ width: '100%', height: '100%' }}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {locations.map((location, index) => (
        <Marker
          key={`${location.lat}-${location.lng}-${index}`}
          position={[location.lat, location.lng]}
          icon={defaultIcon}
          eventHandlers={{
            click: () => handleMarkerClick(location),
          }}
        >
          {selectedLocation && 
           selectedLocation.lat === location.lat && 
           selectedLocation.lng === location.lng && (
            <Popup>
              <div className="p-2 max-w-xs">
                <h3 className="font-bold text-lg mb-1">{location.name || location.title}</h3>
                {location.image && (
                  <img 
                    src={location.image} 
                    alt={location.name || location.title || '位置图片'}
                    className="w-full h-32 object-cover rounded-lg mb-2"
                  />
                )}
                {location.description && (
                  <p className="text-sm text-gray-700">{location.description}</p>
                )}
                {location.rating && (
                  <div className="flex items-center mt-1">
                    <span className="text-sm mr-1">评分:</span>
                    <span className="font-medium">{location.rating}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                )}
              </div>
            </Popup>
          )}
        </Marker>
      ))}
      
      <MapUpdater locations={locations} />
    </MapContainer>
  );
} 