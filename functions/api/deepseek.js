export async function onRequest(context) {
  // 从环境变量获取API密钥
  const apiKey = context.env.DEEPSEEK_API_KEY;
  
  try {
    // 获取用户输入
    const request = await context.request.json();
    const userMessage = request.message;
    
    // 调用DeepSeek API
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {role: "system", content: "你是一个旅游助手，专长于提供中国城市的旅游信息和景点推荐。提供准确、有用的回答，包括景点、美食、住宿和交通建议。"},
          {role: "user", content: userMessage}
        ]
      })
    });
    
    const data = await response.json();
    
    // 返回API响应
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    // 错误处理
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 