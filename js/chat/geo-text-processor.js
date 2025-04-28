/**
 * 地理文本处理模块
 * 处理文本中的地理信息
 */

// 中国主要城市名称集合（用于快速匹配）
const CITY_NAMES = [
  '北京', '上海', '广州', '深圳', '成都', '杭州', '重庆', 
  '西安', '南京', '武汉', '厦门', '青岛', '大连', '三亚', 
  '昆明', '天津', '长沙', '苏州', '哈尔滨', '济南', '宁波',
  '贵阳', '沈阳', '太原', '郑州', '长春', '福州', '乌鲁木齐'
];

// 地理关键词集合
const GEO_KEYWORDS = {
  景点: ['景点', '景区', '旅游', '名胜', '古迹', '公园', '寺庙', '博物馆', '宫殿'],
  住宿: ['酒店', '旅馆', '住宿', '民宿', '度假村', '客栈', '青旅', '宾馆'],
  餐饮: ['餐厅', '美食', '小吃', '饭店', '菜馆', '特色菜', '早餐', '午餐', '晚餐'],
  交通: ['机场', '火车站', '汽车站', '地铁', '公交', '出租车', '高铁', '轻轨', '交通']
};

/**
 * 提取文本中的城市名称
 * @param {String} text - 输入文本
 * @returns {Array} - 城市名称数组
 */
function extractCities(text) {
  if (!text) return [];
  
  const cities = [];
  
  // 遍历城市名称集合，检查是否出现在文本中
  CITY_NAMES.forEach(city => {
    if (text.includes(city) && !cities.includes(city)) {
      cities.push(city);
    }
  });
  
  return cities;
}

/**
 * 提取文本中的地理关键词
 * @param {String} text - 输入文本
 * @returns {Object} - 分类的地理关键词对象
 */
function extractGeoKeywords(text) {
  if (!text) return {};
  
  const result = {
    景点: [],
    住宿: [],
    餐饮: [],
    交通: []
  };
  
  // 遍历地理关键词集合，检查是否出现在文本中
  Object.keys(GEO_KEYWORDS).forEach(category => {
    GEO_KEYWORDS[category].forEach(keyword => {
      if (text.includes(keyword) && !result[category].includes(keyword)) {
        result[category].push(keyword);
      }
    });
  });
  
  // 过滤掉空数组
  const filteredResult = {};
  Object.keys(result).forEach(key => {
    if (result[key].length > 0) {
      filteredResult[key] = result[key];
    }
  });
  
  return filteredResult;
}

/**
 * 分析文本中的地理查询意图
 * @param {String} text - 输入文本
 * @returns {Object} - 查询意图对象
 */
function analyzeGeoIntent(text) {
  if (!text) return { hasGeoIntent: false };
  
  // 提取城市
  const cities = extractCities(text);
  
  // 提取地理关键词
  const keywords = extractGeoKeywords(text);
  
  // 判断是否包含地理意图
  const hasGeoIntent = cities.length > 0 || Object.keys(keywords).length > 0;
  
  // 确定主要意图
  let primaryIntent = null;
  let intentScore = 0;
  
  if (Object.keys(keywords).length > 0) {
    // 根据关键词数量确定主要意图
    Object.keys(keywords).forEach(intent => {
      const score = keywords[intent].length;
      if (score > intentScore) {
        intentScore = score;
        primaryIntent = intent;
      }
    });
  }
  
  // 查询类型判断
  const isLocationQuery = hasGeoIntent || 
    text.includes('在哪里') || 
    text.includes('怎么去') || 
    text.includes('位置') || 
    text.includes('地址') || 
    text.includes('附近');
  
  return {
    hasGeoIntent,
    isLocationQuery,
    cities,
    keywords,
    primaryIntent
  };
}

/**
 * 获取推荐的地图操作
 * @param {Object} intent - 查询意图对象
 * @returns {Object|null} - 推荐操作对象或null
 */
function getRecommendedMapAction(intent) {
  if (!intent || !intent.hasGeoIntent) {
    return null;
  }
  
  // 如果有城市，则以第一个城市为主
  const city = intent.cities.length > 0 ? intent.cities[0] : null;
  
  // 根据意图生成搜索关键词
  let searchKeyword = '';
  
  if (city) {
    searchKeyword = city;
    
    // 如果有主要意图，添加到搜索关键词中
    if (intent.primaryIntent && intent.keywords[intent.primaryIntent].length > 0) {
      const firstKeyword = intent.keywords[intent.primaryIntent][0];
      searchKeyword += ' ' + firstKeyword;
    }
  }
  
  // 如果没有搜索关键词，则返回null
  if (!searchKeyword) {
    return null;
  }
  
  // 构建推荐操作
  return {
    action: 'search',
    searchKeyword,
    city,
    intent: intent.primaryIntent || '景点'
  };
}

/**
 * 处理文本并提取地理信息
 * @param {String} text - 输入文本
 * @returns {Object} - 处理结果对象
 */
function processText(text) {
  // 分析地理查询意图
  const intent = analyzeGeoIntent(text);
  
  // 获取推荐的地图操作
  const recommendedAction = getRecommendedMapAction(intent);
  
  return {
    original: text,
    intent,
    recommendedAction
  };
}

// 导出地理文本处理功能
window.GeoTextProcessor = {
  extractCities,
  extractGeoKeywords,
  analyzeGeoIntent,
  getRecommendedMapAction,
  processText
}; 