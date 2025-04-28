/**
 * 通用工具函数模块
 * 提供项目中通用的辅助函数
 */

/**
 * 防抖函数
 * @param {Function} func - 要执行的函数
 * @param {Number} wait - 等待时间（毫秒）
 * @returns {Function} - 防抖处理后的函数
 */
function debounce(func, wait = 300) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

/**
 * 节流函数
 * @param {Function} func - 要执行的函数
 * @param {Number} limit - 限制时间（毫秒）
 * @returns {Function} - 节流处理后的函数
 */
function throttle(func, limit = 300) {
  let inThrottle;
  return function(...args) {
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * 格式化日期
 * @param {Date|String|Number} date - 日期对象、字符串或时间戳
 * @param {String} format - 格式化模板，如 'YYYY-MM-DD HH:mm:ss'
 * @returns {String} - 格式化后的日期字符串
 */
function formatDate(date, format = 'YYYY-MM-DD') {
  const d = new Date(date);
  
  if (isNaN(d.getTime())) {
    return 'Invalid Date';
  }
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

/**
 * 生成唯一ID
 * @param {String} prefix - ID前缀
 * @returns {String} - 唯一ID
 */
function generateUniqueId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

/**
 * 深拷贝对象
 * @param {*} obj - 要拷贝的对象
 * @returns {*} - 深拷贝后的对象
 */
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item));
  }
  
  if (obj instanceof Object) {
    const copy = {};
    Object.keys(obj).forEach(key => {
      copy[key] = deepClone(obj[key]);
    });
    return copy;
  }
  
  return obj;
}

/**
 * 从URL获取查询参数
 * @param {String} name - 参数名
 * @returns {String|null} - 参数值或null
 */
function getUrlParam(name) {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get(name);
}

/**
 * 检测设备类型
 * @returns {Object} - 设备类型信息
 */
function detectDevice() {
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile = /iphone|ipod|android|blackberry|opera mini|opera mobi|skyfire|maemo|windows phone|palm|iemobile|symbian|symbianos|fennec/i.test(userAgent);
  const isTablet = /ipad|tablet|playbook|silk/i.test(userAgent);
  const isDesktop = !isMobile && !isTablet;
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    isIOS: /iphone|ipad|ipod/i.test(userAgent),
    isAndroid: /android/i.test(userAgent)
  };
}

/**
 * 格式化数字，添加千位分隔符
 * @param {Number} num - 要格式化的数字
 * @returns {String} - 格式化后的字符串
 */
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// 导出工具函数
window.Utils = {
  debounce,
  throttle,
  formatDate,
  generateUniqueId,
  deepClone,
  getUrlParam,
  detectDevice,
  formatNumber
}; 