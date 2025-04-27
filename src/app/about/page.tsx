'use client';

import React from 'react';
import Link from 'next/link';

export default function About() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-6">关于 AI 旅行助手</h1>
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">项目介绍</h2>
          <p className="text-gray-700 mb-4">
            AI 旅行助手是一个基于 Next.js 和 OpenStreetMap 开发的旅行规划工具。
            通过智能 AI 对话，帮助用户探索中国各地的旅游景点和目的地信息。
          </p>
          <p className="text-gray-700 mb-4">
            本项目利用了现代前端技术，提供了流畅的用户体验和丰富的交互功能。
          </p>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">主要功能</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>通过 AI 聊天界面获取旅游信息</li>
            <li>在地图上显示目的地位置</li>
            <li>查看目的地详情和图片</li>
            <li>响应式设计，适配各种设备</li>
          </ul>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">技术栈</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Next.js + React</li>
            <li>TypeScript</li>
            <li>Tailwind CSS</li>
            <li>Leaflet 地图</li>
            <li>OpenStreetMap 数据</li>
          </ul>
        </div>
        
        <div className="text-center">
          <Link href="/">
            <span className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
              返回首页
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
} 