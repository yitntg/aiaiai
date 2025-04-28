/**
 * 聊天API接口模块
 * 提供与DeepSeek AI服务通信的接口
 */

// API配置
const API_CONFIG = {
  endpointUrl: '/api/deepseek', // Cloudflare Function代理接口
  timeout: 30000            // 请求超时时间（毫秒）
};

// 会话历史记录
let chatHistory = [];

/**
 * 发送聊天消息
 * @param {String} message - 用户消息
 * @param {Object} options - 请求选项
 * @returns {Promise} - 响应Promise
 */
function sendMessage(message, options = {}) {
  return new Promise((resolve, reject) => {
    if (!message || typeof message !== 'string') {
      reject(new Error('消息不能为空'));
      return;
    }
    
    // 添加到历史记录
    chatHistory.push({
      role: 'user',
      content: message
    });
    
    // 检查是否使用模拟响应（本地开发环境）
    if (options.useSimulation) {
      // 使用模拟响应（仅用于开发测试）
      return simulateResponse(message)
        .then(response => {
          // 添加到历史记录
          chatHistory.push({
            role: 'assistant',
            content: response.content
          });
          
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    }
    
    // 使用Cloudflare Function代理调用DeepSeek API
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);
    
    fetch(API_CONFIG.endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message }),
      signal: controller.signal
    })
    .then(response => {
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`API返回错误: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // 处理响应
      const assistantContent = data.content || '';
      
      // 添加到历史记录
      chatHistory.push({
        role: 'assistant',
        content: assistantContent
      });
      
      resolve({
        content: assistantContent,
        metadata: {
          role: data.role || 'assistant'
        }
      });
    })
    .catch(error => {
      clearTimeout(timeoutId);
      console.error('API请求失败:', error);
      
      // 如果API请求失败，回退到模拟响应
      console.log('尝试使用模拟响应作为备选...');
      return simulateResponse(message)
        .then(fallbackResponse => {
          chatHistory.push({
            role: 'assistant',
            content: fallbackResponse.content
          });
          
          resolve({
            ...fallbackResponse,
            metadata: {
              ...fallbackResponse.metadata,
              fallback: true
            }
          });
        });
    });
  });
}

/**
 * 模拟AI响应（仅用于开发测试）
 * @param {String} message - 用户消息
 * @returns {Promise} - 模拟响应Promise
 */
function simulateResponse(message) {
  return new Promise((resolve) => {
    // 模拟网络延迟
    const delay = Math.floor(Math.random() * 1000) + 500;
    
    setTimeout(() => {
      let responseContent = '';
      
      // 基于用户消息生成简单的响应
      if (message.includes('你好') || message.includes('您好') || message.includes('hi') || message.includes('hello')) {
        responseContent = '你好！我是AI旅行助手，有什么可以帮助你的吗？';
      } else if (message.includes('北京') || message.includes('故宫') || message.includes('长城')) {
        responseContent = '北京是中国的首都，拥有众多著名景点，如故宫、长城、天坛等。您想了解哪个景点的具体信息？';
      } else if (message.includes('上海') || message.includes('外滩')) {
        responseContent = '上海是中国最大的城市，著名景点包括外滩、东方明珠、豫园等。您需要了解具体交通信息吗？';
      } else if (message.includes('广州') || message.includes('广东')) {
        responseContent = '广州是广东省的省会，著名景点有白云山、陈家祠、广州塔等。广州的美食也非常出名，如早茶、烧腊等。';
      } else if (message.includes('酒店') || message.includes('住宿')) {
        responseContent = '我可以帮您查询目的地附近的酒店信息。请问您需要什么价位和星级的酒店？';
      } else if (message.includes('餐厅') || message.includes('美食') || message.includes('吃')) {
        responseContent = '每个城市都有其特色美食和餐厅。请告诉我您想去的城市，我可以推荐当地的特色餐厅。';
      } else if (message.includes('谢谢') || message.includes('感谢')) {
        responseContent = '不客气！如果您还有其他问题，随时可以问我。';
      } else {
        responseContent = '作为AI旅行助手，我可以帮助您了解旅游目的地信息、查找酒店和餐厅、规划行程等。您有什么具体需求吗？';
      }
      
      // 返回模拟响应
      resolve({
        content: responseContent,
        metadata: {
          simulated: true,
          processTime: delay
        }
      });
    }, delay);
  });
}

/**
 * 清空聊天历史
 */
function clearHistory() {
  chatHistory = [];
  console.log('聊天历史已清空');
}

/**
 * 获取当前聊天历史
 * @returns {Array} - 聊天历史数组
 */
function getHistory() {
  return [...chatHistory];
}

// 导出聊天API功能
window.ChatAPI = {
  sendMessage,
  clearHistory,
  getHistory
}; 