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
          {role: "system", content: "你是一个强大的AI助手，可以回答各种问题。当问到旅游相关内容时，你会提供详细的景点、美食、住宿和交通建议。但你也可以回答其他任何类型的问题，包括但不限于科学、历史、技术、日常生活等领域。请以简洁明了的方式回答，避免过多的格式化内容，使回答自然流畅。不要使用markdown格式，直接使用普通文本回答。"},
          {role: "user", content: userMessage}
        ],
        temperature: 0.7,
        max_tokens: 2000,
        stream: false
      })
    });
    
    const data = await response.json();
    console.log("DeepSeek API Response:", JSON.stringify(data));
    
    // 确保响应格式正确
    if (data.choices && data.choices[0] && data.choices[0].message) {
      // 获取原始内容
      let content = data.choices[0].message.content;
      
      // 简单处理格式，移除可能的markdown标记和多余空行
      content = content
        // 移除markdown标题
        .replace(/#+\s+/g, '')
        // 移除markdown列表符号
        .replace(/^\s*[\-\*]\s+/gm, '• ')
        // 移除markdown代码块
        .replace(/```[\s\S]*?```/g, '')
        // 移除多余的空行
        .replace(/\n{3,}/g, '\n\n')
        // 移除markdown链接，保留链接文本
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
      
      // 直接返回处理后的消息内容
      return new Response(JSON.stringify({
        content: content,
        role: data.choices[0].message.role
      }), {
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