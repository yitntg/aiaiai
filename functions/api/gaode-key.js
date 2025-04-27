export async function onRequest(context) {
  // 记录请求信息
  console.log('收到高德地图API密钥请求');
  
  try {
    // 从环境变量获取高德地图API密钥
    const apiKey = context.env.GAODE_API_KEY;
    
    console.log('环境变量检查:', apiKey ? '密钥存在' : '密钥不存在');
    
    if (!apiKey) {
      console.error('错误: 未找到GAODE_API_KEY环境变量');
      return new Response(JSON.stringify({ 
        error: "未找到高德地图API密钥环境变量" 
      }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*' 
        }
      });
    }
    
    // 记录成功
    console.log('成功获取API密钥，返回响应');
    
    // 返回密钥
    return new Response(JSON.stringify({ 
      key: apiKey,
      success: true
    }), {
      headers: { 
        'Content-Type': 'application/json',
        // 允许跨域访问
        'Access-Control-Allow-Origin': '*',
        // 设置缓存控制，防止密钥被缓存
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  } catch (error) {
    // 记录错误
    console.error('获取API密钥时发生错误:', error);
    
    // 返回错误响应
    return new Response(JSON.stringify({ 
      error: "获取API密钥时发生错误: " + error.message,
      success: false
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
} 