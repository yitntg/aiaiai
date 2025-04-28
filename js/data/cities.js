/**
 * 城市数据模块
 * 提供中国主要城市的基础数据
 */

// 中国主要城市数据
const citiesData = [
  {
    name: '北京',
    pinyin: 'beijing',
    coords: [116.4074, 39.9042],
    description: '中国的首都，拥有丰富的历史文化遗产，如故宫、长城等。',
    image: 'https://images.unsplash.com/photo-1584454797851-6daf2d9098b7',
    rating: 4.8
  },
  {
    name: '上海',
    pinyin: 'shanghai',
    coords: [121.4737, 31.2304],
    description: '中国最大的城市和全球金融中心之一，以现代化摩天大楼和殖民时期建筑并存而著名。',
    image: 'https://images.unsplash.com/photo-1548919973-5cef591cb423',
    rating: 4.7
  },
  {
    name: '广州',
    pinyin: 'guangzhou',
    coords: [113.2644, 23.1291],
    description: '华南地区的经济中心，拥有悠久的历史和丰富的饮食文化。',
    image: 'https://images.unsplash.com/photo-1546982623-e87b6d0c8ca4',
    rating: 4.5
  },
  {
    name: '深圳',
    pinyin: 'shenzhen',
    coords: [114.0579, 22.5431],
    description: '中国改革开放的窗口，从小渔村发展成为全球科技创新中心。',
    image: 'https://images.unsplash.com/photo-1522642888367-f4151c5d5f2a',
    rating: 4.6
  },
  {
    name: '成都',
    pinyin: 'chengdu',
    coords: [104.0668, 30.5728],
    description: '四川省省会，以熊猫、火锅和休闲生活方式而闻名。',
    image: 'https://images.unsplash.com/photo-1556783295-6fddef774289',
    rating: 4.9
  },
  {
    name: '杭州',
    pinyin: 'hangzhou',
    coords: [120.1551, 30.2741],
    description: '浙江省省会，以西湖美景和电子商务产业而闻名。',
    image: 'https://images.unsplash.com/photo-1599831013079-1a36a3ac233c',
    rating: 4.8
  },
  {
    name: '重庆',
    pinyin: 'chongqing',
    coords: [106.5516, 29.5630],
    description: '中国直辖市之一，以山城特色、火锅和长江三峡而著名。',
    image: 'https://images.unsplash.com/photo-1545546782-59858428657c',
    rating: 4.7
  },
  {
    name: '西安',
    pinyin: 'xian',
    coords: [108.9402, 34.3416],
    description: '古都之一，拥有兵马俑等历史遗迹，是古丝绸之路的起点。',
    image: 'https://images.unsplash.com/photo-1626605867949-3dfdb1a14502',
    rating: 4.7
  },
  {
    name: '南京',
    pinyin: 'nanjing',
    coords: [118.7969, 32.0603],
    description: '江苏省省会，六朝古都，拥有丰富的历史文化遗产。',
    image: 'https://images.unsplash.com/photo-1537210249814-b9a10a161ae4',
    rating: 4.6
  },
  {
    name: '武汉',
    pinyin: 'wuhan',
    coords: [114.3055, 30.5928],
    description: '湖北省省会，长江和汉江交汇处，是中国重要的教育和工业基地。',
    image: 'https://images.unsplash.com/photo-1567271252086-84fc31740f29',
    rating: 4.5
  },
  {
    name: '厦门',
    pinyin: 'xiamen',
    coords: [118.0894, 24.4798],
    description: '福建省沿海城市，以鼓浪屿、海滨风光和温暖气候而著名。',
    image: 'https://images.unsplash.com/photo-1603784850816-1886e906af3d',
    rating: 4.8
  },
  {
    name: '青岛',
    pinyin: 'qingdao',
    coords: [120.3826, 36.0671],
    description: '山东省沿海城市，以啤酒、海滩和欧式建筑而闻名。',
    image: 'https://images.unsplash.com/photo-1589996448606-27d38c70f3bc',
    rating: 4.6
  },
  {
    name: '大连',
    pinyin: 'dalian',
    coords: [121.6147, 38.9140],
    description: '辽宁省沿海城市，以海滨风光和现代化港口而著名。',
    image: 'https://images.unsplash.com/photo-1604324741918-e0fe762d04f1',
    rating: 4.5
  },
  {
    name: '三亚',
    pinyin: 'sanya',
    coords: [109.5082, 18.2478],
    description: '海南省南部的热带海滨城市，是著名的旅游胜地。',
    image: 'https://images.unsplash.com/photo-1570977777401-03ab28cc979c',
    rating: 4.9
  },
  {
    name: '昆明',
    pinyin: 'kunming',
    coords: [102.8329, 24.8801],
    description: '云南省省会，四季如春，拥有丰富的自然和民族文化资源。',
    image: 'https://images.unsplash.com/photo-1622381553660-09c2f44edc76',
    rating: 4.7
  }
];

/**
 * 获取所有城市数据
 * @returns {Array} - 城市数据数组
 */
function getAllCities() {
  return citiesData;
}

/**
 * 根据城市名称查找城市
 * @param {String} cityName - 城市名称
 * @returns {Object|null} - 城市数据或null
 */
function getCityByName(cityName) {
  return citiesData.find(city => 
    city.name === cityName || 
    city.pinyin === cityName.toLowerCase()
  ) || null;
}

/**
 * 根据坐标查找最近的城市
 * @param {Array} coords - 坐标 [lng, lat]
 * @returns {Object} - 最近的城市数据
 */
function getNearestCity(coords) {
  if (!coords || !Array.isArray(coords) || coords.length !== 2) {
    return null;
  }
  
  // 计算两点之间的距离（简化版，不考虑地球曲率）
  function calcDistance(point1, point2) {
    const [lng1, lat1] = point1;
    const [lng2, lat2] = point2;
    return Math.sqrt(Math.pow(lng1 - lng2, 2) + Math.pow(lat1 - lat2, 2));
  }
  
  let nearestCity = null;
  let minDistance = Infinity;
  
  citiesData.forEach(city => {
    const distance = calcDistance(coords, city.coords);
    if (distance < minDistance) {
      minDistance = distance;
      nearestCity = city;
    }
  });
  
  return nearestCity;
}

/**
 * 根据评分筛选城市
 * @param {Number} minRating - 最低评分
 * @returns {Array} - 符合条件的城市数组
 */
function getCitiesByRating(minRating = 4.0) {
  return citiesData.filter(city => city.rating >= minRating);
}

// 导出城市数据功能
window.CitiesData = {
  getAllCities,
  getCityByName,
  getNearestCity,
  getCitiesByRating
}; 