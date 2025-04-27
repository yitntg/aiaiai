'use client';

import React from 'react';

interface LoadingIndicatorProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
  text?: string;
}

export default function LoadingIndicator({
  size = 'md',
  color = 'blue-500',
  className = '',
  text
}: LoadingIndicatorProps) {
  // 尺寸样式
  const sizeStyles = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };
  
  // 文本尺寸
  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };
  
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`animate-spin rounded-full border-t-2 border-b-2 border-${color} ${sizeStyles[size]}`}></div>
      {text && (
        <p className={`mt-2 text-${color} ${textSizes[size]}`}>{text}</p>
      )}
    </div>
  );
}