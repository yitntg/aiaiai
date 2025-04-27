'use client';

import { useState } from 'react';
import ChatBox from '../features/chat/components/ChatBox';
import FullscreenMap from '../features/map/components/FullscreenMap';
import { Location } from '../types/map';

export default function Home() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  
  // 处理新地点添加到地图
  const handleNewLocations = (newLocations: Location[]) => {
    setLocations(prev => {
      // 过滤掉已有的位置，避免重复
      const uniqueLocations = newLocations.filter(newLoc => 
        !prev.some(loc => loc.lat === newLoc.lat && loc.lng === newLoc.lng)
      );
      return [...prev, ...uniqueLocations];
    });
    
    // 如果有新地点，选中第一个
    if (newLocations.length > 0) {
      setSelectedLocation(newLocations[0]);
    }
  };
  
  return (
    <div className="h-screen w-screen overflow-hidden relative">
      {/* 全屏地图背景 */}
      <FullscreenMap 
        locations={locations} 
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
      />
      
      {/* 悬浮对话框 */}
      <div className={`absolute transition-all duration-300 ease-in-out ${
        isMinimized 
          ? 'bottom-5 right-5 w-16 h-16' 
          : 'bottom-5 right-5 w-96 max-w-[calc(100vw-2rem)] h-[500px] max-h-[calc(100vh-7rem)]'
      }`}>
        {isMinimized ? (
          <button 
            onClick={() => setIsMinimized(false)}
            className="w-full h-full rounded-full bg-blue-500 shadow-lg flex items-center justify-center text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </button>
        ) : (
          <ChatBox 
            onNewLocations={handleNewLocations} 
            onMinimize={() => setIsMinimized(true)}
          />
        )}
      </div>
    </div>
  );
} 