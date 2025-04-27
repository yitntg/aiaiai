# AI旅行助手

这是一个基于 Next.js 和 Google Maps API 的旅行助手应用，帮助用户规划旅行并提供目的地信息。

## 功能特点

- AI 聊天界面，可以询问旅行相关问题
- 实时地图显示，自动定位提到的地点
- 响应式设计，适配各种屏幕尺寸

## 开始使用

1. 克隆仓库
   ```bash
   git clone https://github.com/yitntg/aiaiai.git
   cd aiaiai
   ```

2. 安装依赖
   ```bash
   npm install
   ```

3. 创建环境变量文件
   - 创建 `.env.local` 文件在项目根目录
   - 添加 Google Maps API 密钥：
     ```
     NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
     ```

4. 启动开发服务器
   ```bash
   npm run dev
   ```

5. 打开浏览器访问 http://localhost:3000

## 技术栈

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Google Maps API

## 项目状态

- 基本功能已实现
- React 和 TypeScript 配置已完成
- 代码已推送到 GitHub 仓库：[https://github.com/yitntg/aiaiai](https://github.com/yitntg/aiaiai)

## 下一步

- 添加更多旅行相关功能
- 优化 AI 聊天体验
- 添加用户认证

## 许可证

MIT 