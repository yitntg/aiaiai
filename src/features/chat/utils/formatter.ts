import { Message } from '../../../types/chat';

/**
 * 简单的链接识别和格式化
 * 将文本中的URL转换为HTML链接标签
 */
export function formatLinks(text: string): string {
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlPattern, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">$1</a>');
}

/**
 * 格式化消息时间戳
 */
export function formatMessageTime(date?: Date): string {
  const messageDate = date || new Date();
  
  return new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(messageDate);
}

/**
 * 标记消息中的地点名称
 * @param text 消息文本
 * @param placeNames 地点名称数组
 */
export function highlightPlaceNames(text: string, placeNames: string[]): string {
  if (!placeNames.length) return text;
  
  // 按名称长度降序排序，避免短名称替换长名称的一部分
  const sortedNames = [...placeNames].sort((a, b) => b.length - a.length);
  
  let result = text;
  sortedNames.forEach(name => {
    // 使用正则表达式，只匹配独立的词
    const regex = new RegExp(`(^|\\s|[,.!?;:()"'-])${name}(?=$|\\s|[,.!?;:()"'-])`, 'g');
    result = result.replace(regex, `$1<span class="font-semibold text-blue-600">${name}</span>`);
  });
  
  return result;
}

/**
 * 将消息对象格式化为可显示的文本
 */
export function formatMessage(message: Message): string {
  let content = message.content;
  
  // 添加其他格式化处理方法
  content = formatLinks(content);
  
  return content;
} 