/**
 * 聊天UI模块
 * 负责聊天界面的交互和显示
 */

// DOM元素引用
let chatContainer;
let chatMessages;
let chatForm;
let chatInput;
let sendButton;
let minimizeButton;
let chatBubble;

// 聊天状态
let isChatMinimized = false;

/**
 * 初始化聊天UI
 */
function initChatUI() {
  // 获取DOM元素引用
  chatContainer = document.getElementById('chatContainer');
  chatMessages = document.getElementById('chatMessages');
  chatForm = document.getElementById('chatForm');
  chatInput = document.getElementById('chatInput');
  sendButton = document.getElementById('sendBtn');
  minimizeButton = document.getElementById('minimizeBtn');
  chatBubble = document.getElementById('chatBubble');
  
  // 添加事件监听器
  chatForm.addEventListener('submit', handleChatSubmit);
  minimizeButton.addEventListener('click', toggleChatMinimize);
  chatBubble.addEventListener('click', toggleChatMinimize);
  
  // 聊天输入框自动获取焦点
  chatInput.focus();
  
  console.log('聊天UI初始化完成');
}

/**
 * 处理聊天表单提交
 * @param {Event} event - 提交事件
 */
function handleChatSubmit(event) {
  event.preventDefault();
  
  const userMessage = chatInput.value.trim();
  if (!userMessage) return;
  
  // 显示用户消息
  addUserMessage(userMessage);
  
  // 清空输入框
  chatInput.value = '';
  
  // 触发自定义事件，让其他模块处理消息
  const customEvent = new CustomEvent('chatMessage', {
    detail: { message: userMessage, type: 'user' }
  });
  document.dispatchEvent(customEvent);
  
  // 显示正在输入的指示器
  showTypingIndicator();
}

/**
 * 添加用户消息到聊天界面
 * @param {String} message - 用户消息文本
 */
function addUserMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', 'user-message');
  messageElement.textContent = message;
  
  chatMessages.appendChild(messageElement);
  scrollToBottom();
}

/**
 * 添加AI助手消息到聊天界面
 * @param {String} message - 助手消息文本
 */
function addAssistantMessage(message) {
  // 移除正在输入指示器（如果存在）
  removeTypingIndicator();
  
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', 'assistant-message');
  messageElement.textContent = message;
  
  chatMessages.appendChild(messageElement);
  scrollToBottom();
}

/**
 * 显示正在输入指示器
 */
function showTypingIndicator() {
  // 移除已存在的指示器
  removeTypingIndicator();
  
  // 创建新的指示器
  const indicator = document.createElement('div');
  indicator.classList.add('message', 'assistant-message', 'typing-indicator-container');
  indicator.innerHTML = `
    <div class="typing-indicator">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>
  `;
  indicator.id = 'typingIndicator';
  
  chatMessages.appendChild(indicator);
  scrollToBottom();
}

/**
 * 移除正在输入指示器
 */
function removeTypingIndicator() {
  const indicator = document.getElementById('typingIndicator');
  if (indicator) {
    indicator.remove();
  }
}

/**
 * 切换聊天界面的最小化/最大化状态
 */
function toggleChatMinimize() {
  if (isChatMinimized) {
    // 最大化聊天界面
    chatContainer.style.display = 'flex';
    chatBubble.style.display = 'none';
    setTimeout(() => chatInput.focus(), 100);
  } else {
    // 最小化聊天界面
    chatContainer.style.display = 'none';
    chatBubble.style.display = 'flex';
  }
  
  isChatMinimized = !isChatMinimized;
}

/**
 * 滚动聊天窗口到底部
 */
function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 初始化聊天UI
document.addEventListener('DOMContentLoaded', initChatUI);

// 导出聊天UI功能
window.ChatUI = {
  addUserMessage,
  addAssistantMessage,
  showTypingIndicator,
  removeTypingIndicator,
  toggleChatMinimize
}; 