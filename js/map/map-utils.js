/**
 * 地图工具函数模块
 * 提供地图相关的辅助工具函数
 */

/**
 * 计算两点之间的距离（米）
 * @param {Array} point1 - 第一个点坐标 [lng, lat]
 * @param {Array} point2 - 第二个点坐标 [lng, lat]
 * @returns {Number} - 距离，单位米
 */
function calculateDistance(point1, point2) {
  if (!point1 || !point2 || !Array.isArray(point1) || !Array.isArray(point2)) {
    console.error('计算距离的点坐标无效');
    return 0;
  }
  
  try {
    const lnglat1 = new AMap.LngLat(point1[0], point1[1]);
    const lnglat2 = new AMap.LngLat(point2[0], point2[1]);
    
    // 使用高德地图API计算距离
    return lnglat1.distance(lnglat2);
  } catch (error) {
    console.error('计算距离时出错:', error);
    return 0;
  }
}

/**
 * 根据地址获取坐标
 * @param {String} address - 地址字符串
 * @param {String} city - 城市名（可选，提高精度）
 * @returns {Promise} - 返回坐标的Promise
 */
function geocodeAddress(address, city = '') {
  return new Promise((resolve, reject) => {
    if (!address) {
      reject(new Error('地址不能为空'));
      return;
    }
    
    try {
      AMap.plugin('AMap.Geocoder', function() {
        const geocoder = new AMap.Geocoder({
          city: city
        });
        
        geocoder.getLocation(address, function(status, result) {
          if (status === 'complete' && result.info === 'OK') {
            const location = result.geocodes[0]?.location;
            if (location) {
              resolve([location.lng, location.lat]);
            } else {
              resolve(null);
            }
          } else {
            console.warn('地址解析失败:', status, result);
            resolve(null);
          }
        });
      });
    } catch (error) {
      console.error('地址解析出错:', error);
      reject(error);
    }
  });
}

/**
 * 根据坐标获取地址
 * @param {Array} lnglat - 经纬度坐标 [lng, lat]
 * @returns {Promise} - 返回地址的Promise
 */
function reverseGeocode(lnglat) {
  return new Promise((resolve, reject) => {
    if (!lnglat || !Array.isArray(lnglat) || lnglat.length !== 2) {
      reject(new Error('坐标无效'));
      return;
    }
    
    try {
      AMap.plugin('AMap.Geocoder', function() {
        const geocoder = new AMap.Geocoder();
        
        geocoder.getAddress(lnglat, function(status, result) {
          if (status === 'complete' && result.info === 'OK') {
            resolve(result.regeocode);
          } else {
            console.warn('逆地址解析失败:', status, result);
            resolve(null);
          }
        });
      });
    } catch (error) {
      console.error('逆地址解析出错:', error);
      reject(error);
    }
  });
}

/**
 * 获取当前位置
 * @returns {Promise} - 返回当前位置的Promise
 */
function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    try {
      AMap.plugin('AMap.Geolocation', function() {
        const geolocation = new AMap.Geolocation({
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
          convert: true
        });
        
        geolocation.getCurrentPosition(function(status, result) {
          if (status === 'complete') {
            const position = [result.position.lng, result.position.lat];
            resolve({
              position: position,
              accuracy: result.accuracy,
              isConverted: result.isConverted,
              info: result.info
            });
          } else {
            console.warn('定位失败:', result.message);
            reject(new Error(result.message));
          }
        });
      });
    } catch (error) {
      console.error('获取当前位置出错:', error);
      reject(error);
    }
  });
}

/**
 * 计算路线规划
 * @param {Array} from - 起点坐标 [lng, lat]
 * @param {Array} to - 终点坐标 [lng, lat]
 * @param {String} type - 路线类型：'walking'|'driving'|'riding'|'transit'
 * @returns {Promise} - 返回路线规划结果的Promise
 */
function calculateRoute(from, to, type = 'walking') {
  return new Promise((resolve, reject) => {
    if (!from || !to || !Array.isArray(from) || !Array.isArray(to)) {
      reject(new Error('起点或终点坐标无效'));
      return;
    }
    
    const plugins = {
      walking: 'AMap.Walking',
      driving: 'AMap.Driving',
      riding: 'AMap.Riding',
      transit: 'AMap.Transfer'
    };
    
    const plugin = plugins[type];
    if (!plugin) {
      reject(new Error('不支持的路线类型'));
      return;
    }
    
    try {
      AMap.plugin(plugin, function() {
        let routePlanner;
        
        switch (type) {
          case 'walking':
            routePlanner = new AMap.Walking({
              map: window.MapCore.getMap(),
              panel: false
            });
            break;
          case 'driving':
            routePlanner = new AMap.Driving({
              map: window.MapCore.getMap(),
              panel: false
            });
            break;
          case 'riding':
            routePlanner = new AMap.Riding({
              map: window.MapCore.getMap(),
              panel: false
            });
            break;
          case 'transit':
            routePlanner = new AMap.Transfer({
              map: window.MapCore.getMap(),
              panel: false
            });
            break;
        }
        
        // 计算路线
        routePlanner.search(
          new AMap.LngLat(from[0], from[1]),
          new AMap.LngLat(to[0], to[1]),
          function(status, result) {
            if (status === 'complete') {
              resolve(result);
            } else {
              console.warn('路线规划失败:', result);
              reject(new Error('路线规划失败'));
            }
          }
        );
      });
    } catch (error) {
      console.error('路线规划出错:', error);
      reject(error);
    }
  });
}

/**
 * 将坐标转换为高德坐标系（GCJ-02）
 * @param {Array} lnglat - 经纬度坐标 [lng, lat]
 * @param {String} from - 源坐标系: 'wgs84'|'baidu'
 * @returns {Promise} - 返回转换后坐标的Promise
 */
function convertCoord(lnglat, from = 'wgs84') {
  return new Promise((resolve, reject) => {
    if (!lnglat || !Array.isArray(lnglat) || lnglat.length !== 2) {
      reject(new Error('坐标无效'));
      return;
    }
    
    const coordsMap = {
      wgs84: 1,
      baidu: 3
    };
    
    const coordType = coordsMap[from.toLowerCase()];
    if (!coordType) {
      reject(new Error('不支持的坐标系类型'));
      return;
    }
    
    try {
      AMap.convertFrom(lnglat, coordType, function(status, result) {
        if (status === 'complete' && result.info === 'ok') {
          const convertedLnglat = [result.locations[0].lng, result.locations[0].lat];
          resolve(convertedLnglat);
        } else {
          console.warn('坐标转换失败:', status, result);
          reject(new Error('坐标转换失败'));
        }
      });
    } catch (error) {
      console.error('坐标转换出错:', error);
      reject(error);
    }
  });
}

// 导出地图工具函数
window.MapUtils = {
  calculateDistance,
  geocodeAddress,
  reverseGeocode,
  getCurrentLocation,
  calculateRoute,
  convertCoord
}; 