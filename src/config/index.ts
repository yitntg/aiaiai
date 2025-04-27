/**
 * 应用配置
 */
const config = {
  // 地图默认配置
  map: {
    defaultCenter: {
      lat: 39.9042,  // 北京中心坐标
      lng: 116.4074
    },
    defaultZoom: 10,
    minZoom: 3,
    maxZoom: 20
  },
  
  // 聊天配置
  chat: {
    initialMessage: '你好！我是你的AI旅行助手。告诉我你想去哪里旅行，我可以提供相关信息。',
    maxMessages: 100,
    apiEndpoint: '/api/chat'
  },
  
  // 地点搜索配置
  places: {
    maxResults: 10,
    defaultRadius: 5000,  // 默认搜索半径（米）
    apiEndpoints: {
      details: '/api/placeDetails',
      photos: '/api/placePhoto',
      search: '/api/searchPlaces',
      geocode: '/api/geocode',
      extractLocations: '/api/extractLocations'
    }
  },
  
  // 常用目的地坐标
  commonDestinations: {
    beijing: { lat: 39.9042, lng: 116.4074, name: '北京' },
    shanghai: { lat: 31.2304, lng: 121.4737, name: '上海' },
    guangzhou: { lat: 23.1291, lng: 113.2644, name: '广州' },
    shenzhen: { lat: 22.5431, lng: 114.0579, name: '深圳' },
    hangzhou: { lat: 30.2741, lng: 120.1551, name: '杭州' },
    chengdu: { lat: 30.5728, lng: 104.0668, name: '成都' },
    xian: { lat: 34.3416, lng: 108.9398, name: '西安' }
  }
};

export default config; 