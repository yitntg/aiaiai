/**
 * API请求基础方法
 */
export async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
  };

  try {
    const response = await fetch(endpoint, mergedOptions);
    
    if (!response.ok) {
      // 如果响应不成功，尝试解析错误信息
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        // 如果解析错误信息失败，使用状态文本
        throw new Error(`API错误: ${response.status} ${response.statusText}`);
      }
      throw new Error(errorData.error || `API错误: ${response.status}`);
    }

    // 解析成功的响应
    const data = await response.json();
    return data as T;
  } catch (error: any) {
    if (error.message === 'Failed to fetch') {
      throw new Error('网络错误，请检查您的连接');
    }
    throw error;
  }
}

/**
 * GET请求封装
 */
export function get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  let url = endpoint;
  
  // 添加查询参数
  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, value);
    });
    url = `${endpoint}?${searchParams.toString()}`;
  }
  
  return fetchAPI<T>(url, { method: 'GET' });
}

/**
 * POST请求封装
 */
export function post<T>(endpoint: string, data: any): Promise<T> {
  return fetchAPI<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
} 