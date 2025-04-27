import { Message } from '../types/chat';
import { Location } from '../types/map';

/**
 * 向AI发送聊天消息
 */
export async function sendChatMessage(messages: Message[]): Promise<Message> {
  // 这里应该是实际的 AI 服务调用
  // 现在我们只是返回一个模拟的响应
  return new Promise((resolve) => {
    setTimeout(() => {
      const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || '';
      let response = '';
      
      if (lastUserMessage.includes('北京')) {
        response = '北京是中国的首都，有许多著名景点，如故宫、天安门广场和长城。';
      } else if (lastUserMessage.includes('上海')) {
        response = '上海是中国最大的城市，是一个国际化大都市，有外滩、东方明珠等著名景点。';
      } else if (lastUserMessage.includes('旅游') || lastUserMessage.includes('景点')) {
        response = '中国有许多著名的旅游景点，例如北京的长城、西安的兵马俑、桂林的山水等。您想了解哪个地区的景点呢？';
      } else {
        response = '您好！我是您的旅行助手。请问您想了解哪个城市或景点的信息？';
      }
      
      resolve({
        role: 'assistant',
        content: response
      });
    }, 1000);
  });
}

/**
 * 从AI回复中提取地点信息
 */
export async function extractLocations(text: string): Promise<Location[]> {
  // 我们使用简单的模式匹配来提取地点
  // 在实际应用中，应该使用更复杂的NLP技术
  const locations: Location[] = [];
  
  // 中国主要城市的简单数据库
  const citiesData = [
    { name: '北京', lat: 39.9042, lng: 116.4074, 
      description: '中国首都，拥有丰富的历史文化遗产', 
      image: 'https://images.unsplash.com/photo-1584283367830-7875dd39f6e7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGJlaWppbmd8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
      rating: 4.8
    },
    { name: '上海', lat: 31.2304, lng: 121.4737, 
      description: '中国最大的城市和全球金融中心之一', 
      image: 'https://images.unsplash.com/photo-1548919973-5cef591cdbc9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8c2hhbmdoYWl8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
      rating: 4.7
    },
    { name: '广州', lat: 23.1291, lng: 113.2644, 
      description: '中国南方的商业和文化中心', 
      image: 'https://images.unsplash.com/photo-1583591424399-7d3167fda79d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fGd1YW5nemhvdXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
      rating: 4.5
    },
    { name: '深圳', lat: 22.5431, lng: 114.0579, 
      description: '中国创新科技的前沿城市', 
      image: 'https://images.unsplash.com/photo-1546382102-368825d3a4fd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c2hlbnpoZW58ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
      rating: 4.6
    },
    { name: '西安', lat: 34.3416, lng: 108.9398, 
      description: '中国古代文明的摇篮之一，拥有兵马俑等文化遗产', 
      image: 'https://images.unsplash.com/photo-1619852742746-51f6dab01733?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8eGlhbiUyMGNoaW5hfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
      rating: 4.7
    },
    { name: '成都', lat: 30.5728, lng: 104.0668, 
      description: '中国西南地区的中心城市，以熊猫和美食闻名', 
      image: 'https://images.unsplash.com/photo-1585211969224-3e992986159d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8Y2hlbmdkdXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
      rating: 4.8
    }
  ];
  
  // 检查文本中是否包含已知城市名称
  citiesData.forEach(city => {
    if (text.includes(city.name)) {
      locations.push({
        id: `loc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        lat: city.lat,
        lng: city.lng,
        name: city.name,
        description: city.description,
        image: city.image,
        rating: city.rating
      });
    }
  });
  
  return locations;
} 