/**
 * 主应用脚本
 * 负责初始化应用程序和协调不同模块间的交互
 */

// 应用程序状态
let appState = {
  mapReady: false,
  chatReady: false
};

/**
 * 应用程序初始化
 */
function initApp() {
  console.log('初始化应用程序...');
  
  // 显示加载状态
  showLoadingState();
  
  // 初始化地图
  initMapComponent()
    .then(() => {
      console.log('地图组件初始化成功');
      appState.mapReady = true;
      checkAllComponentsReady();
    })
    .catch(error => {
      console.error('地图组件初始化失败:', error);
      showErrorState('地图加载失败', error.message);
    });
  
  // 初始化聊天功能
  initChatComponent()
    .then(() => {
      console.log('聊天组件初始化成功');
      appState.chatReady = true;
      checkAllComponentsReady();
    })
    .catch(error => {
      console.error('聊天组件初始化失败:', error);
    });
  
  // 初始化关于模态框功能
  initAboutModal();
  
  // 添加聊天消息处理器
  document.addEventListener('chatMessage', handleChatMessage);
}

/**
 * 初始化地图组件
 * @returns {Promise} - 地图初始化Promise
 */
function initMapComponent() {
  return MapLoader.loadMapResources()
    .then(() => MapCore.initMap('map'))
    .then(map => {
      // 可以在这里初始化其他地图相关功能
      return map;
    });
}

/**
 * 初始化聊天组件
 * @returns {Promise} - 聊天初始化Promise
 */
function initChatComponent() {
  return Promise.resolve()
    .then(() => {
      // 聊天组件已经通过DOM内容加载事件初始化了
      return true;
    });
}

/**
 * 初始化关于模态框
 */
function initAboutModal() {
  window.showAbout = function() {
    document.getElementById('aboutModal').style.display = 'flex';
  };
  
  window.hideAbout = function() {
    document.getElementById('aboutModal').style.display = 'none';
  };
}

/**
 * 处理聊天消息
 * @param {CustomEvent} event - 聊天消息事件
 */
function handleChatMessage(event) {
  const { message, type } = event.detail;
  
  if (type === 'user') {
    console.log('收到用户消息:', message);
    
    // 这里应该调用ChatAPI发送消息到后端
    // 模拟API调用延迟
    setTimeout(() => {
      // 判断是否是地点相关的查询
      const isLocationQuery = checkIfLocationQuery(message);
      
      if (isLocationQuery) {
        // 处理地点相关查询
        handleLocationQuery(message);
      } else {
        // 处理普通查询
        handleGeneralQuery(message);
      }
    }, 1000);
  }
}

/**
 * 检查是否是地点相关的查询
 * @param {String} message - 用户消息
 * @returns {Boolean} - 是否是地点查询
 */
function checkIfLocationQuery(message) {
  // 简单的关键词检测，实际项目中可以使用更复杂的NLP处理
  const locationKeywords = ['在哪里', '怎么去', '地址', '位置', '附近', '旅游', '景点', '酒店', '餐厅'];
  return locationKeywords.some(keyword => message.includes(keyword));
}

/**
 * 处理地点相关的查询
 * @param {String} message - 用户消息
 */
function handleLocationQuery(message) {
  // 模拟地理文本处理
  const mockResponse = '北京是中国的首都，位于华北平原北部。';
  ChatUI.addAssistantMessage(mockResponse);
  
  // 模拟在地图上标记位置
  if (MapCore.isMapReady()) {
    const beijingCoords = [116.4074, 39.9042]; // 北京坐标
    
    // 设置地图中心并添加标记
    MapCore.setMapCenter(beijingCoords);
    MapCore.setMapZoom(12, false);
    
    // 这里应该调用MapMarkers模块添加标记
    console.log('在地图上标记位置:', beijingCoords);
  }
}

/**
 * 处理一般性查询
 * @param {String} message - 用户消息
 */
function handleGeneralQuery(message) {
  // 模拟通用查询响应
  const mockResponse = '作为AI助手，我可以回答您的各种问题。需要了解更多信息吗？';
  ChatUI.addAssistantMessage(mockResponse);
}

/**
 * 检查所有组件是否准备就绪
 */
function checkAllComponentsReady() {
  if (appState.mapReady && appState.chatReady) {
    console.log('所有组件已准备就绪');
    hideLoadingState();
  }
}

/**
 * 显示加载状态
 */
function showLoadingState() {
  // 应用程序加载中的UI状态
  console.log('应用程序加载中...');
}

/**
 * 隐藏加载状态
 */
function hideLoadingState() {
  // 隐藏加载指示器
  console.log('加载完成，应用程序已就绪');
}

/**
 * 显示错误状态
 * @param {String} title - 错误标题
 * @param {String} message - 错误消息
 */
function showErrorState(title, message) {
  console.error(`${title}: ${message}`);
  // 这里可以添加错误UI展示
}

// 在DOM内容加载完成后初始化应用程序
document.addEventListener('DOMContentLoaded', initApp); 