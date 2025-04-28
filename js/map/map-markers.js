/**
 * 地图标记点管理模块
 * 负责在地图上添加、移除、更新标记点
 */

// 标记点集合，用于管理所有添加的标记点
const markers = {
  items: new Map(), // 存储所有标记点对象
  layer: null       // 标记点图层
};

/**
 * 初始化标记点模块
 * @returns {Promise} - 初始化完成的Promise
 */
function initMarkers() {
  return new Promise((resolve, reject) => {
    try {
      // 获取地图实例
      const map = window.MapCore.getMap();
      if (!map) {
        throw new Error('地图实例未初始化');
      }
      
      // 创建标记点图层
      markers.layer = new AMap.LayerGroup({
        autoRefresh: true // 自动刷新图层
      });
      
      // 添加图层到地图
      markers.layer.setMap(map);
      
      console.log('标记点模块初始化成功');
      resolve(markers);
    } catch (error) {
      console.error('标记点模块初始化失败:', error);
      reject(error);
    }
  });
}

/**
 * 添加标记点
 * @param {Object} options - 标记点选项
 * @param {String} options.id - 标记点唯一ID
 * @param {Array} options.position - 位置坐标 [lng, lat]
 * @param {String} options.title - 标记点标题
 * @param {String} options.content - 自定义HTML内容（可选）
 * @param {Object} options.data - 附加数据（可选）
 * @returns {Object} - 标记点对象
 */
function addMarker(options) {
  if (!options.position || !Array.isArray(options.position)) {
    throw new Error('标记点位置无效');
  }
  
  // 生成唯一ID
  const id = options.id || `marker_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  
  // 检查是否已存在同ID标记点
  if (markers.items.has(id)) {
    console.warn(`标记点ID "${id}" 已存在，将被替换`);
    removeMarker(id);
  }
  
  // 创建标记点
  const marker = new AMap.Marker({
    position: options.position,
    title: options.title || '',
    offset: new AMap.Pixel(-13, -30),
    zIndex: options.zIndex || 100
  });
  
  // 设置自定义内容
  if (options.content) {
    marker.setContent(options.content);
  }
  
  // 添加点击事件
  marker.on('click', () => {
    showInfoWindow(id);
  });
  
  // 存储标记点信息
  const markerInfo = {
    id,
    marker,
    options
  };
  
  // 添加到集合和图层
  markers.items.set(id, markerInfo);
  markers.layer.add(marker);
  
  console.log(`添加标记点 "${id}" 成功`);
  return markerInfo;
}

/**
 * 批量添加标记点
 * @param {Array} markersOptions - 标记点选项数组
 * @returns {Array} - 添加的标记点数组
 */
function addMarkers(markersOptions) {
  if (!Array.isArray(markersOptions)) {
    throw new Error('标记点选项必须是数组');
  }
  
  const addedMarkers = [];
  
  // 批量添加标记点
  markersOptions.forEach(options => {
    try {
      const marker = addMarker(options);
      addedMarkers.push(marker);
    } catch (error) {
      console.error('添加标记点失败:', error);
    }
  });
  
  return addedMarkers;
}

/**
 * 移除标记点
 * @param {String} id - 标记点ID
 * @returns {Boolean} - 是否成功移除
 */
function removeMarker(id) {
  if (!markers.items.has(id)) {
    console.warn(`标记点 "${id}" 不存在`);
    return false;
  }
  
  const markerInfo = markers.items.get(id);
  markers.layer.remove(markerInfo.marker);
  markers.items.delete(id);
  
  console.log(`移除标记点 "${id}" 成功`);
  return true;
}

/**
 * 清空所有标记点
 */
function clearMarkers() {
  markers.layer.clearLayers();
  markers.items.clear();
  console.log('所有标记点已清除');
}

/**
 * 显示标记点信息窗口
 * @param {String} id - 标记点ID
 */
function showInfoWindow(id) {
  if (!markers.items.has(id)) {
    console.warn(`标记点 "${id}" 不存在`);
    return;
  }
  
  const map = window.MapCore.getMap();
  const markerInfo = markers.items.get(id);
  const { options, marker } = markerInfo;
  
  // 构建信息窗口内容
  const content = createInfoWindowContent(options);
  
  // 创建信息窗口
  const infoWindow = new AMap.InfoWindow({
    content,
    offset: new AMap.Pixel(0, -30),
    autoMove: true,
    closeWhenClickMap: true
  });
  
  // 在标记点位置打开信息窗口
  infoWindow.open(map, marker.getPosition());
}

/**
 * 创建信息窗口HTML内容
 * @param {Object} options - 标记点选项
 * @returns {String} - HTML内容
 */
function createInfoWindowContent(options) {
  // 从选项或数据中获取信息
  const { title, data } = options;
  const description = data?.description || '';
  const image = data?.image || '';
  const rating = data?.rating || 0;
  
  // 构建评分星星
  const stars = Array(5)
    .fill(0)
    .map((_, i) => i < Math.floor(rating) ? '★' : '☆')
    .join('');
  
  // 构建HTML
  return `
    <div class="map-popup">
      ${image ? `<img src="${image}" alt="${title}">` : ''}
      <h3>${title}</h3>
      ${rating ? `<div style="color: #f5a623;">${stars} ${rating.toFixed(1)}</div>` : ''}
      <p>${description}</p>
    </div>
  `;
}

/**
 * 将地图中心设置到标记点
 * @param {String} id - 标记点ID
 * @param {Number} zoom - 缩放级别（可选）
 * @param {Boolean} showInfo - 是否显示信息窗口（可选）
 */
function centerOnMarker(id, zoom, showInfo = true) {
  if (!markers.items.has(id)) {
    console.warn(`标记点 "${id}" 不存在`);
    return;
  }
  
  const map = window.MapCore.getMap();
  const markerInfo = markers.items.get(id);
  const position = markerInfo.marker.getPosition();
  
  // 设置地图中心
  map.setCenter(position);
  
  // 设置缩放级别
  if (zoom) {
    map.setZoom(zoom);
  }
  
  // 显示信息窗口
  if (showInfo) {
    showInfoWindow(id);
  }
}

// 导出标记点功能
window.MapMarkers = {
  init: initMarkers,
  add: addMarker,
  addMultiple: addMarkers,
  remove: removeMarker,
  clear: clearMarkers,
  showInfo: showInfoWindow,
  centerOn: centerOnMarker
}; 