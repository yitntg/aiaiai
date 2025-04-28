# AI 旅行助手项目

基于高德地图和AI的智能旅行助手应用，提供地图查询、旅游信息和智能对话功能。

## 目录结构

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

## 功能模块

### 1. 地图模块

- 高德地图集成
- 位置搜索和标记
- 路线规划
- 兴趣点展示

### 2. 聊天模块

- AI旅行助手对话
- 基于地理位置的智能回复
- 旅游信息查询

### 3. 数据模块

- 城市信息数据
- 热门景点数据
- 用户历史数据

## 使用说明

1. 在地图上搜索目的地
2. 与AI助手对话获取旅游建议
3. 查看景点详情和路线规划

## 技术栈

- 前端: HTML5, CSS3, JavaScript (ES6+)
- 地图: 高德地图 JavaScript API
- AI对话: 基于大型语言模型的对话系统
- 数据存储: LocalStorage, JSON 