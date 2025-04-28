# AI 旅行助手

一个基于高德地图和AI的智能旅行助手应用，提供地图查询、旅游信息和智能对话功能。

## 项目结构

项目采用模块化结构，按功能将代码分为以下几个部分：

### 目录结构

```
├── css/                     # 样式文件
│   └── main.css             # 主样式表
├── js/                      # JavaScript代码目录
│   ├── app.js               # 主应用入口
│   ├── chat/                # 聊天相关模块
│   │   ├── chat-api.js      # 聊天API接口
│   │   ├── chat-ui.js       # 聊天界面交互
│   │   └── geo-text-processor.js  # 地理文本处理
│   ├── data/                # 数据模块
│   │   └── cities.js        # 城市数据
│   ├── map/                 # 地图相关模块
│   │   ├── map-core.js      # 地图核心功能
│   │   ├── map-loader.js    # 地图加载器
│   │   ├── map-markers.js   # 地图标记管理
│   │   ├── map-search.js    # 地图搜索功能
│   │   └── map-utils.js     # 地图工具函数
│   ├── ui/                  # UI组件
│   │   └── modal.js         # 模态框组件
│   └── utils/               # 工具函数
│       └── common.js        # 通用工具函数
└── index.html               # 主页面
```

## 功能模块说明

### 1. 地图模块 (js/map/)

- **map-loader.js**: 负责高德地图SDK的加载和初始化
- **map-core.js**: 地图的核心功能，包括地图实例创建、配置和基本操作
- **map-markers.js**: 管理地图上的标记点，提供添加、删除、展示信息窗等功能
- **map-search.js**: 提供地图位置搜索功能
- **map-utils.js**: 地图相关的辅助工具函数

### 2. 聊天模块 (js/chat/)

- **chat-ui.js**: 负责聊天界面的交互和显示
- **chat-api.js**: 提供与AI服务通信的API接口
- **geo-text-processor.js**: 处理文本中的地理信息

### 3. 数据模块 (js/data/)

- **cities.js**: 提供中国主要城市的数据，包括坐标、描述、图片等

### 4. UI组件 (js/ui/)

- **modal.js**: 通用的模态框组件，用于显示弹出信息

### 5. 工具函数 (js/utils/)

- **common.js**: 提供常用的工具函数，如防抖、节流、日期格式化等

### 6. 主应用 (js/app.js)

- 负责整个应用的初始化和协调不同模块间的交互

## 使用方法

1. 在`js/map/map-loader.js`中设置高德地图API密钥
2. 打开`index.html`即可使用应用

## 技术栈

- HTML5/CSS3/JavaScript
- 高德地图API
- DeepSeek AI API
- Cloudflare Pages Functions

## 功能特性

- 智能对话界面，可回答各类问题
- 旅游景点可视化展示
- 地点查询和信息展示
- 响应式设计，适配各种设备 