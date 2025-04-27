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
          {role: "system", content: "你是一个强大的AI助手，可以回答各种问题。当问到旅游相关内容时，你会提供详细的景点、美食、住宿和交通建议。但你也可以回答其他任何类型的问题，包括但不限于科学、历史、技术、日常生活等领域。"},
          {role: "user", content: userMessage}
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });
    
    const data = await response.json();
    console.log("DeepSeek API Response:", JSON.stringify(data));
    
    // 确保响应格式正确
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      // 处理响应格式不符合预期的情况
      console.error("Unexpected API response format:", data);
      return new Response(JSON.stringify({ 
        error: "API响应格式不符合预期",
        details: data 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    // 错误处理
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 