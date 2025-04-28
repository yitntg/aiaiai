/**
 * 聊天UI模块
 * 负责聊天界面的交互和显示
 */

// 聊天UI组件
const ChatUI = {
  // DOM元素
  elements: {
    container: null,
    messages: null,
    form: null,
    input: null,
    sendBtn: null,
    bubble: null,
    minimizeBtn: null
  },
  
  // 聊天状态
  state: {
    minimized: false,
    sending: false
  },
  
  /**
   * 初始化聊天UI
   */
  init: function() {
    console.log('初始化聊天UI...');
    
    // 获取DOM元素
    this.elements.container = document.getElementById('chatContainer');
    this.elements.messages = document.getElementById('chatMessages');
    this.elements.form = document.getElementById('chatForm');
    this.elements.input = document.getElementById('chatInput');
    this.elements.sendBtn = document.getElementById('sendBtn');
    this.elements.bubble = document.getElementById('chatBubble');
    this.elements.minimizeBtn = document.getElementById('minimizeBtn');
    
    // 检查元素是否存在
    if (!this.elements.container || !this.elements.messages || 
        !this.elements.form || !this.elements.input || 
        !this.elements.sendBtn || !this.elements.bubble || 
        !this.elements.minimizeBtn) {
      console.error('聊天UI初始化失败：未找到必要的DOM元素');
      return;
    }
    
    // 绑定事件
    this.bindEvents();
    
    console.log('聊天UI初始化完成');
  },
  
  /**
   * 绑定事件处理器
   */
  bindEvents: function() {
    // 提交表单发送消息
    this.elements.form.addEventListener('submit', (event) => {
      event.preventDefault();
      this.sendMessage();
    });
    
    // 最小化按钮
    this.elements.minimizeBtn.addEventListener('click', () => {
      this.toggleMinimize();
    });
    
    // 聊天气泡点击
    this.elements.bubble.addEventListener('click', () => {
      this.toggleMinimize();
    });
    
    // 监听输入框回车键
    this.elements.input.addEventListener('keypress', (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        this.sendMessage();
      }
    });
  },
  
  /**
   * 发送消息
   */
  sendMessage: function() {
    const message = this.elements.input.value.trim();
    
    if (!message || this.state.sending) {
      return;
    }
    
    // 添加用户消息到UI
    this.addUserMessage(message);
    
    // 清空输入框
    this.elements.input.value = '';
    
    // 设置发送状态
    this.state.sending = true;
    this.elements.sendBtn.disabled = true;
    
    // 触发聊天消息事件
    document.dispatchEvent(new CustomEvent('chatMessage', { detail: message }));
    
    // 使用ChatAPI发送消息
    if (window.ChatAPI) {
      // 根据全局设置决定是否使用模拟响应
      const options = { useSimulation: window.useSimulation === true };
      
      ChatAPI.sendMessage(message, options)
        .then(response => {
          // 添加助手消息到UI
          this.addAssistantMessage(response.content);
        })
        .catch(error => {
          console.error('发送消息失败:', error);
          this.addAssistantMessage('很抱歉，我遇到了一些问题。请稍后再试。');
        })
        .finally(() => {
          // 重置发送状态
          this.state.sending = false;
          this.elements.sendBtn.disabled = false;
        });
    } else {
      console.error('ChatAPI未找到');
      this.addAssistantMessage('很抱歉，聊天功能暂时不可用。');
      this.state.sending = false;
      this.elements.sendBtn.disabled = false;
    }
  },
  
  /**
   * 添加用户消息
   * @param {String} message - 用户消息内容
   */
  addUserMessage: function(message) {
    const messageEl = document.createElement('div');
    messageEl.className = 'message user-message';
    messageEl.textContent = message;
    
    this.elements.messages.appendChild(messageEl);
    this.scrollToBottom();
  },
  
  /**
   * 添加助手消息
   * @param {String} message - 助手消息内容
   */
  addAssistantMessage: function(message) {
    const messageEl = document.createElement('div');
    messageEl.className = 'message assistant-message';
    
    // 支持简单的Markdown格式显示
    messageEl.innerHTML = this.formatMessage(message);
    
    this.elements.messages.appendChild(messageEl);
    this.scrollToBottom();
  },
  
  /**
   * 格式化消息内容，支持简单的Markdown
   * @param {String} message - 原始消息
   * @returns {String} - 格式化后的HTML
   */
  formatMessage: function(message) {
    if (!message) return '';
    
    // 转义HTML特殊字符
    let formatted = message
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    
    // 支持加粗
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // 支持斜体
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // 支持换行
    formatted = formatted.replace(/\n/g, '<br>');
    
    return formatted;
  },
  
  /**
   * 滚动到底部
   */
  scrollToBottom: function() {
    this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
  },
  
  /**
   * 切换最小化状态
   */
  toggleMinimize: function() {
    this.state.minimized = !this.state.minimized;
    
    if (this.state.minimized) {
      this.elements.container.style.display = 'none';
      this.elements.bubble.style.display = 'flex';
    } else {
      this.elements.container.style.display = 'flex';
      this.elements.bubble.style.display = 'none';
      this.scrollToBottom();
    }
  }
};

// 导出聊天UI模块
window.ChatUI = ChatUI; 