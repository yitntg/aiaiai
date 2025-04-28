/**
 * 地图加载模块
 * 负责高德地图SDK的加载和初始化
 */

// 高德地图API配置
let AMAP_API_KEY = ''; // 将从Cloudflare Function获取
const AMAP_VERSION = '2.0';
const AMAP_PLUGINS = ['AMap.ToolBar', 'AMap.Scale', 'AMap.Geolocation'];

/**
 * 从Cloudflare Function获取高德地图API密钥
 * @returns {Promise<string>} API密钥
 */
function fetchApiKey() {
  return fetch('/api/gaode-key')
    .then(response => {
      if (!response.ok) {
        throw new Error('获取高德地图API密钥失败');
      }
      return response.json();
    })
    .then(data => {
      if (data.key) {
        console.log('成功获取高德地图API密钥');
        return data.key;
      } else {
        throw new Error('API密钥格式错误');
      }
    });
}

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
    
    // 首先获取API密钥
    const getKey = AMAP_API_KEY ? Promise.resolve(AMAP_API_KEY) : fetchApiKey();
    
    getKey.then(apiKey => {
      AMAP_API_KEY = apiKey; // 保存密钥以便后续使用
      
      // 创建脚本元素
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = `https://webapi.amap.com/maps?v=${AMAP_VERSION}&key=${apiKey}&plugin=${AMAP_PLUGINS.join(',')}`;
      
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
    }).catch(error => {
      console.error('获取API密钥失败:', error);
      reject(error);
    });
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