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
 * @returns {Promise} 初始化完成的Promise
 */
function initMapComponent() {
  return new Promise((resolve, reject) => {
    console.log('开始初始化地图组件...');
    
    // 首先加载地图资源
    MapLoader.loadMapResources()
      .then(resources => {
        console.log('地图资源加载完成，初始化地图...');
        return MapCore.initMap('map');
      })
      .then(map => {
        console.log('地图初始化成功');
        resolve();
      })
      .catch(error => {
        console.error('地图组件初始化失败:', error);
        reject(error);
      });
  });
}

/**
 * 初始化聊天组件
 * @returns {Promise} 初始化完成的Promise
 */
function initChatComponent() {
  return new Promise((resolve, reject) => {
    try {
      console.log('初始化聊天组件...');
      
      // 初始化聊天UI
      const chatUI = window.ChatUI;
      if (!chatUI) {
        throw new Error('聊天UI模块未加载');
      }
      
      chatUI.init();
      
      // 检查当前环境
      const isLocalDevelopment = window.location.hostname === 'localhost' || 
                                window.location.hostname === '127.0.0.1';
      
      // 在本地开发环境或无DeepSeek API密钥时使用模拟响应
      // 在生产环境将通过Cloudflare Pages Functions调用DeepSeek API
      window.useSimulation = isLocalDevelopment;
      
      console.log('聊天组件初始化成功，' + 
                 (window.useSimulation ? '使用模拟响应' : '使用DeepSeek API'));
      resolve();
    } catch (error) {
      console.error('聊天组件初始化失败:', error);
      reject(error);
    }
  });
}

/**
 * 检查所有组件是否就绪
 */
function checkAllComponentsReady() {
  if (appState.mapReady && appState.chatReady) {
    console.log('所有组件已就绪');
    hideLoadingState();
  }
}

/**
 * 显示加载状态
 */
function showLoadingState() {
  console.log('显示加载状态...');
}

/**
 * 隐藏加载状态
 */
function hideLoadingState() {
  console.log('隐藏加载状态...');
  document.querySelector('.map-loading').style.display = 'none';
}

/**
 * 显示错误状态
 * @param {String} title - 错误标题
 * @param {String} message - 错误消息
 */
function showErrorState(title, message) {
  console.error(`错误: ${title} - ${message}`);
  document.getElementById('map').innerHTML = `
    <div style="padding: 20px; text-align: center;">
      <h3>${title}</h3>
      <p>${message}</p>
      <button onclick="location.reload()">重新加载</button>
    </div>
  `;
}

/**
 * 处理聊天消息
 * @param {CustomEvent} event - 聊天消息事件
 */
function handleChatMessage(event) {
  const message = event.detail;
  console.log('收到聊天消息:', message);
  
  // 检查是否为地点相关查询
  const geoProcessor = window.GeoTextProcessor;
  if (geoProcessor) {
    const geoInfo = geoProcessor.processText(message);
    if (geoInfo && geoInfo.places.length > 0) {
      console.log('检测到地点相关查询:', geoInfo);
      
      // 在地图上标记地点
      const mapMarkers = window.MapMarkers;
      if (mapMarkers && appState.mapReady) {
        // 获取第一个地点并标记
        const place = geoInfo.places[0];
        MapCore.waitForMap().then(() => {
          const cityData = window.CitiesData && window.CitiesData.getCityByName 
            ? window.CitiesData.getCityByName(place) 
            : null;
          
          if (cityData) {
            mapMarkers.addMarker(cityData.coords, cityData.name, cityData);
            MapCore.setMapCenter(cityData.coords);
            MapCore.setMapZoom(10, false);
          } else {
            // 如果没有找到城市数据，尝试搜索
            const mapSearch = window.MapSearch;
            if (mapSearch) {
              mapSearch.searchPlace(place);
            }
          }
        });
      }
    }
  }
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

// 在DOM加载完成后初始化应用
document.addEventListener('DOMContentLoaded', initApp); 