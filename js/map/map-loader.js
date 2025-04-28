/**
 * 地图加载模块
 * 负责高德地图SDK的加载和初始化
 */

// 高德地图API配置
const AMAP_API_KEY = '4e2d49ca9a9adf4c8f0d01925b68c501'; // 请替换为您的高德地图API Key
const AMAP_VERSION = '2.0';
const AMAP_PLUGINS = ['AMap.ToolBar', 'AMap.Scale', 'AMap.Geolocation'];

/**
 * 加载高德地图SDK
 * @returns {Promise} - 加载完成的Promise
 */
function loadAMapSDK() {
  return new Promise((resolve, reject) => {
    if (window.AMap) {
      console.log('高德地图SDK已加载');
      resolve(window.AMap);
      return;
    }
    
    console.log('开始加载高德地图SDK...');
    
    // 创建脚本元素
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = `https://webapi.amap.com/maps?v=${AMAP_VERSION}&key=${AMAP_API_KEY}&plugin=${AMAP_PLUGINS.join(',')}`;
    
    // 加载成功回调
    script.onload = () => {
      console.log('高德地图SDK加载成功');
      
      // 配置高德地图
      if (window.AMap) {
        // 禁用部分功能以提高性能
        window.AMap.Config.performanceOn = true; // 开启性能优化
        window.AMap.Config.useTile = true; // 使用瓦片图层
        
        resolve(window.AMap);
      } else {
        reject(new Error('高德地图SDK加载异常'));
      }
    };
    
    // 加载失败回调
    script.onerror = () => {
      console.error('高德地图SDK加载失败');
      reject(new Error('高德地图SDK加载失败'));
    };
    
    // 添加到文档
    document.head.appendChild(script);
  });
}

/**
 * 加载高德地图UI库
 * @returns {Promise} - 加载完成的Promise
 */
function loadAMapUI() {
  return new Promise((resolve, reject) => {
    if (window.AMapUI) {
      console.log('高德地图UI库已加载');
      resolve(window.AMapUI);
      return;
    }
    
    console.log('开始加载高德地图UI库...');
    
    // 创建脚本元素
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://webapi.amap.com/ui/1.1/main.js';
    
    // 加载成功回调
    script.onload = () => {
      console.log('高德地图UI库加载成功');
      
      if (window.AMapUI) {
        resolve(window.AMapUI);
      } else {
        reject(new Error('高德地图UI库加载异常'));
      }
    };
    
    // 加载失败回调
    script.onerror = () => {
      console.error('高德地图UI库加载失败');
      reject(new Error('高德地图UI库加载失败'));
    };
    
    // 添加到文档
    document.head.appendChild(script);
  });
}

/**
 * 加载所有地图资源
 * @returns {Promise} - 所有资源加载完成的Promise
 */
function loadMapResources() {
  return loadAMapSDK()
    .then(() => {
      // 加载UI库（可选）
      return loadAMapUI();
    })
    .then(() => {
      console.log('所有地图资源加载完成');
      return {
        AMap: window.AMap,
        AMapUI: window.AMapUI
      };
    })
    .catch(error => {
      console.error('地图资源加载失败:', error);
      throw error;
    });
}

// 导出地图加载功能
window.MapLoader = {
  loadAMapSDK,
  loadAMapUI,
  loadMapResources
}; 