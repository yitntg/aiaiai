export async function onRequest(context) {
  // 从环境变量获取高德地图API密钥
  const apiKey = context.env.GAODE_API_KEY;
  
  if (!apiKey) {
    return new Response(JSON.stringify({ 
      error: "未找到高德地图API密钥环境变量" 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // 返回密钥
  return new Response(JSON.stringify({ 
    key: apiKey 
  }), {
    headers: { 
      'Content-Type': 'application/json',
      // 设置缓存控制，防止密钥被缓存
      'Cache-Control': 'no-store, max-age=0'
    }
  });
} 