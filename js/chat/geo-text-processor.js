/**
 * 地理文本处理模块
 * 处理文本中的地理信息
 */

// 中国城市名称列表（部分）
const knownCities = [
  '北京', '上海', '广州', '深圳', '杭州', '南京', '成都', '重庆', '武汉',
  '西安', '天津', '苏州', '厦门', '青岛', '大连', '长沙', '宁波', '郑州',
  '济南', '沈阳', '哈尔滨', '长春', '福州', '合肥', '昆明', '贵阳', '南宁',
  '石家庄', '太原', '南昌', '兰州', '海口', '乌鲁木齐', '拉萨', '银川', '西宁'
];

// 地点相关关键词（如景点、地标等）
const placeKeywords = [
  '故宫', '长城', '外滩', '西湖', '黄山', '长江', '黄河', '珠江', '泰山',
  '颐和园', '天坛', '圆明园', '天安门', '鸟巢', '水立方', '东方明珠',
  '布达拉宫', '九寨沟', '张家界', '桂林山水', '三亚', '香格里拉'
];

// 旅游相关关键词
const travelKeywords = [
  '旅游', '旅行', '景点', '景区', '游玩', '参观', '打卡', '行程',
  '酒店', '民宿', '住宿', '机票', '火车', '高铁', '交通', '攻略',
  '美食', '特产', '小吃', '购物', '纪念品', '自由行', '跟团', '导游'
];

// 地理操作相关关键词
const geoOpKeywords = [
  '在哪里', '怎么去', '如何到达', '距离', '附近', '周边', '位置',
  '地址', '地图', '导航', '路线', '路程', '多远', '多久'
];

/**
 * 处理文本并提取地理信息
 * @param {String} text - 输入文本
 * @returns {Object} - 提取的地理信息
 */
function processText(text) {
  if (!text || typeof text !== 'string') {
    return { isGeoQuery: false, places: [], keywords: [] };
  }
  
  // 转为小写以便不区分大小写匹配
  const lowerText = text.toLowerCase();
  
  // 提取城市名称
  const extractedCities = extractCities(text);
  
  // 提取地点关键词
  const extractedPlaces = extractPlaceKeywords(text);
  
  // 提取旅游关键词
  const extractedTravelKeywords = extractTravelKeywords(text);
  
  // 提取地理操作关键词
  const extractedGeoOpKeywords = extractGeoOpKeywords(text);
  
  // 合并所有地点
  const allPlaces = [...new Set([...extractedCities, ...extractedPlaces])];
  
  // 合并所有关键词
  const allKeywords = [...new Set([...extractedTravelKeywords, ...extractedGeoOpKeywords])];
  
  // 判断是否是地理相关查询
  const isGeoQuery = allPlaces.length > 0 || allKeywords.length > 0;
  
  return {
    isGeoQuery,
    places: allPlaces,
    keywords: allKeywords,
    intent: analyzeGeoIntent(text, allPlaces, allKeywords)
  };
}

/**
 * 从文本中提取城市名称
 * @param {String} text - 输入文本
 * @returns {Array} - 提取的城市名称
 */
function extractCities(text) {
  if (!text) return [];
  
  const cities = [];
  
  // 检查每个已知城市名称
  for (const city of knownCities) {
    if (text.includes(city)) {
      cities.push(city);
    }
  }
  
  return cities;
}

/**
 * 从文本中提取地点关键词
 * @param {String} text - 输入文本
 * @returns {Array} - 提取的地点关键词
 */
function extractPlaceKeywords(text) {
  if (!text) return [];
  
  const places = [];
  
  // 检查每个地点关键词
  for (const place of placeKeywords) {
    if (text.includes(place)) {
      places.push(place);
    }
  }
  
  return places;
}

/**
 * 从文本中提取旅游关键词
 * @param {String} text - 输入文本
 * @returns {Array} - 提取的旅游关键词
 */
function extractTravelKeywords(text) {
  if (!text) return [];
  
  const keywords = [];
  
  // 检查每个旅游关键词
  for (const keyword of travelKeywords) {
    if (text.includes(keyword)) {
      keywords.push(keyword);
    }
  }
  
  return keywords;
}

/**
 * 从文本中提取地理操作关键词
 * @param {String} text - 输入文本
 * @returns {Array} - 提取的地理操作关键词
 */
function extractGeoOpKeywords(text) {
  if (!text) return [];
  
  const keywords = [];
  
  // 检查每个地理操作关键词
  for (const keyword of geoOpKeywords) {
    if (text.includes(keyword)) {
      keywords.push(keyword);
    }
  }
  
  return keywords;
}

/**
 * 分析文本中的地理查询意图
 * @param {String} text - 输入文本
 * @param {Array} places - 提取的地点
 * @param {Array} keywords - 提取的关键词
 * @returns {String} - 查询意图
 */
function analyzeGeoIntent(text, places, keywords) {
  if (!text || places.length === 0) {
    return 'unknown';
  }
  
  // 检查意图类型
  if (text.includes('怎么去') || text.includes('如何到达') || text.includes('路线')) {
    return 'route';
  } else if (text.includes('在哪里') || text.includes('位置') || text.includes('地址')) {
    return 'location';
  } else if (text.includes('附近') || text.includes('周边')) {
    return 'nearby';
  } else if (text.includes('景点') || text.includes('景区') || text.includes('游玩')) {
    return 'attractions';
  } else if (text.includes('酒店') || text.includes('住宿')) {
    return 'accommodation';
  } else if (text.includes('美食') || text.includes('餐厅') || text.includes('小吃')) {
    return 'food';
  } else {
    return 'general';
  }
}

// 导出地理文本处理模块
window.GeoTextProcessor = {
  processText,
  extractCities,
  analyzeGeoIntent
}; 