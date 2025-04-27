'use client';

import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="text-6xl font-bold text-blue-500 mb-4">404</div>
      <h1 className="text-2xl font-semibold mb-4">页面未找到</h1>
      <p className="text-gray-600 mb-6">抱歉，您访问的页面不存在。</p>
      <Link href="/">
        <span className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
          返回首页
        </span>
      </Link>
    </div>
  );
} 