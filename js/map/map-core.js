/**
 * 地图核心模块
 * 负责地图的初始化、配置和基本操作
 */

// 地图实例
let map = null;
let mapReady = false;

/**
 * 初始化地图
 * @param {String} containerId - 地图容器ID
 * @returns {Promise} - 返回地图初始化的Promise
 */
function initMap(containerId = 'map') {
  return new Promise((resolve, reject) => {
    try {
      console.log('创建地图实例...');
      // 创建地图实例
      map = new AMap.Map(containerId, {
        zoom: 4,
        center: [105.0, 35.0], // 中国中心点
        viewMode: '2D',
        resizeEnable: true,
        pitchEnable: false,  // 禁用俯仰，减少WebGL负担
        rotateEnable: false, // 禁用旋转，减少WebGL负担
        buildingAnimation: false, // 禁用建筑物动画
        showBuildingBlock: false  // 不显示建筑物块体
      });
      
      // 设置Canvas属性函数 - 解决Canvas2D警告
      function setCanvasProperties() {
        console.log('设置Canvas属性以优化性能...');
        if (map && map.getContainer()) {
          const allCanvas = map.getContainer().getElementsByTagName('canvas');
          for (let i = 0; i < allCanvas.length; i++) {
            try {
              // 设置属性
              allCanvas[i].setAttribute('willReadFrequently', 'true');
              
              // 重新获取上下文并设置属性
              const ctx = allCanvas[i].getContext('2d', { willReadFrequently: true });
              if (ctx) {
                console.log('Canvas属性设置成功');
              }
            } catch (e) {
              console.warn('设置canvas属性失败:', e);
            }
          }
        }
      }
      
      // 立即设置Canvas属性
      setCanvasProperties();
      
      console.log('地图实例创建成功，添加控件...');
      // 添加控件
      map.plugin(['AMap.ToolBar', 'AMap.Scale'], function() {
        // 添加工具条
        const toolBar = new AMap.ToolBar({
          position: 'RT'
        });
        map.addControl(toolBar);
        
        // 添加比例尺
        const scale = new AMap.Scale();
        map.addControl(scale);
        
        console.log('地图控件添加完成');
      });
      
      // 添加地图加载完成事件
      map.on('complete', function() {
        console.log('地图渲染完成事件触发');
        
        // 标记地图已就绪
        mapReady = true;
        console.log('地图已就绪，可以使用');
        
        // 触发自定义事件
        window.dispatchEvent(new CustomEvent('mapReady'));
        
        // 地图完成时，再次设置canvas属性（确保处理所有画布）
        setTimeout(setCanvasProperties, 1000);
        
        resolve(map);
      });
      
    } catch (error) {
      console.error('地图初始化失败:', error);
      
      // 显示错误信息
      document.getElementById(containerId).innerHTML = `
        <div style="padding: 20px; text-align: center;">
          <h3>地图加载失败</h3>
          <p>${error.message}</p>
          <button onclick="location.reload()">重新加载</button>
        </div>
      `;
      
      reject(error);
    }
  });
}

/**
 * 等待地图准备就绪
 * @param {Number} timeout - 超时时间（毫秒）
 * @returns {Promise} - 返回地图就绪的Promise
 */
function waitForMap(timeout = 10000) {
  return new Promise((resolve, reject) => {
    if (mapReady && map) {
      resolve(map);
      return;
    }
    
    let timeoutId;
    
    const readyHandler = () => {
      clearTimeout(timeoutId);
      window.removeEventListener('mapReady', readyHandler);
      resolve(map);
    };
    
    window.addEventListener('mapReady', readyHandler);
    
    timeoutId = setTimeout(() => {
      window.removeEventListener('mapReady', readyHandler);
      reject(new Error('地图加载超时'));
    }, timeout);
  });
}

/**
 * 获取地图实例
 * @returns {Object|null} - 返回地图实例或null
 */
function getMap() {
  return map;
}

/**
 * 检查地图是否已就绪
 * @returns {Boolean} - 地图是否就绪
 */
function isMapReady() {
  return mapReady;
}

/**
 * 设置地图中心点
 * @param {Array} center - 中心点坐标 [lng, lat]
 * @param {Boolean} immediately - 是否立即设置中心点
 */
function setMapCenter(center, immediately = true) {
  if (!map) return;
  
  if (immediately) {
    map.setCenter(center);
  } else {
    map.panTo(center);
  }
}

/**
 * 设置地图缩放级别
 * @param {Number} zoom - 缩放级别
 * @param {Boolean} immediately - 是否立即设置缩放级别
 */
function setMapZoom(zoom, immediately = true) {
  if (!map) return;
  
  if (immediately) {
    map.setZoom(zoom);
  } else {
    map.animateZoom(zoom);
  }
}

// 导出地图核心功能
window.MapCore = {
  initMap,
  waitForMap,
  getMap,
  isMapReady,
  setMapCenter,
  setMapZoom
}; 