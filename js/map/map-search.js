/**
 * 地图搜索模块
 * 负责地图位置搜索功能
 */

/**
 * 初始化搜索功能
 * @returns {Promise} - 初始化完成的Promise
 */
function initSearch() {
  return new Promise((resolve, reject) => {
    try {
      console.log('初始化地图搜索功能...');
      
      // 检查地图和插件是否已加载
      if (!window.AMap) {
        throw new Error('高德地图SDK未加载');
      }
      
      if (!window.AMap.PlaceSearch) {
        console.log('加载搜索插件...');
        window.AMap.plugin(['AMap.PlaceSearch', 'AMap.Autocomplete'], function() {
          console.log('搜索插件加载成功');
          resolve(true);
        });
      } else {
        resolve(true);
      }
    } catch (error) {
      console.error('搜索功能初始化失败:', error);
      reject(error);
    }
  });
}

/**
 * 搜索地点
 * @param {String} keyword - 搜索关键词
 * @param {Object} options - 搜索选项
 * @param {Array} options.city - 限定城市
 * @param {Number} options.pageSize - 结果数量
 * @param {Number} options.pageIndex - 页码
 * @returns {Promise} - 搜索结果的Promise
 */
function searchPlace(keyword, options = {}) {
  return new Promise((resolve, reject) => {
    if (!keyword) {
      reject(new Error('搜索关键词不能为空'));
      return;
    }
    
    const defaultOptions = {
      city: '全国',
      pageSize: 10,
      pageIndex: 1
    };
    
    const searchOptions = { ...defaultOptions, ...options };
    
    try {
      // 创建搜索实例
      const placeSearch = new AMap.PlaceSearch({
        city: searchOptions.city,
        pageSize: searchOptions.pageSize,
        pageIndex: searchOptions.pageIndex,
        extensions: 'all'
      });
      
      // 执行搜索
      placeSearch.search(keyword, function(status, result) {
        if (status === 'complete' && result.info === 'OK') {
          console.log(`搜索"${keyword}"成功，找到 ${result.poiList?.pois?.length || 0} 个结果`);
          resolve(result.poiList?.pois || []);
        } else {
          console.warn('地点搜索失败:', status, result);
          resolve([]);
        }
      });
    } catch (error) {
      console.error('执行搜索时出错:', error);
      reject(error);
    }
  });
}

/**
 * 搜索并在地图上标记结果
 * @param {String} keyword - 搜索关键词
 * @param {Object} options - 搜索选项
 * @returns {Promise} - 搜索并标记后的Promise
 */
function searchAndMark(keyword, options = {}) {
  // 检查地图和标记点模块是否就绪
  if (!window.MapCore || !window.MapCore.isMapReady() || !window.MapMarkers) {
    return Promise.reject(new Error('地图或标记点模块未就绪'));
  }
  
  // 清除之前的标记
  window.MapMarkers.clear();
  
  // 执行搜索
  return searchPlace(keyword, options)
    .then(pois => {
      if (!pois.length) {
        console.log('未找到搜索结果');
        return [];
      }
      
      // 添加标记点
      const markers = pois.map(poi => {
        return window.MapMarkers.add({
          position: [poi.location.lng, poi.location.lat],
          title: poi.name,
          data: {
            description: poi.address || '暂无地址信息',
            type: poi.type,
            tel: poi.tel || '暂无电话信息',
            rating: poi.rating || 0
          }
        });
      });
      
      // 自适应显示所有标记点
      const map = window.MapCore.getMap();
      if (markers.length && map) {
        // 获取所有标记点的位置
        const positions = markers.map(m => m.marker.getPosition());
        
        // 设置地图视图以包含所有标记点
        if (positions.length === 1) {
          map.setCenter(positions[0]);
          map.setZoom(15);
        } else {
          map.setFitView(markers.map(m => m.marker));
        }
        
        // 显示第一个结果的信息窗口
        window.MapMarkers.showInfo(markers[0].id);
      }
      
      return markers;
    });
}

/**
 * 获取输入提示
 * @param {String} keyword - 输入关键词
 * @param {String} city - 限定城市
 * @returns {Promise} - 提示结果的Promise
 */
function getInputTips(keyword, city = '全国') {
  return new Promise((resolve, reject) => {
    if (!keyword) {
      resolve([]);
      return;
    }
    
    try {
      // 创建自动完成实例
      const autoComplete = new AMap.Autocomplete({
        city: city,
        citylimit: true
      });
      
      // 获取提示
      autoComplete.search(keyword, function(status, result) {
        if (status === 'complete' && result.info === 'OK') {
          resolve(result.tips || []);
        } else {
          console.warn('获取输入提示失败:', status, result);
          resolve([]);
        }
      });
    } catch (error) {
      console.error('获取输入提示时出错:', error);
      reject(error);
    }
  });
}

/**
 * 根据城市名获取城市编码
 * @param {String} cityName - 城市名称
 * @returns {Promise} - 城市编码的Promise
 */
function getCityCode(cityName) {
  return new Promise((resolve, reject) => {
    try {
      AMap.plugin('AMap.DistrictSearch', function() {
        const districtSearch = new AMap.DistrictSearch({
          level: 'city',
          subdistrict: 0
        });
        
        districtSearch.search(cityName, function(status, result) {
          if (status === 'complete' && result.info === 'OK') {
            const district = result.districtList[0];
            if (district) {
              resolve(district.adcode);
            } else {
              resolve(null);
            }
          } else {
            console.warn('城市编码查询失败:', status, result);
            resolve(null);
          }
        });
      });
    } catch (error) {
      console.error('获取城市编码时出错:', error);
      reject(error);
    }
  });
}

// 导出搜索功能
window.MapSearch = {
  init: initSearch,
  searchPlace,
  searchAndMark,
  getInputTips,
  getCityCode
}; 