/**
 * 模态框UI组件
 * 提供通用的模态框功能
 */

// 模态框状态
const modalState = {
  activeModal: null,
};

/**
 * 创建模态框
 * @param {Object} options - 模态框配置选项
 * @param {String} options.id - 模态框ID
 * @param {String} options.title - 模态框标题
 * @param {String} options.content - 模态框内容HTML
 * @param {Function} options.onClose - 关闭回调
 * @returns {HTMLElement} - 模态框元素
 */
function createModal(options) {
  const { id, title, content, onClose } = options;
  
  // 检查是否已存在
  let existingModal = document.getElementById(id);
  if (existingModal) {
    return existingModal;
  }
  
  // 创建模态框容器
  const modalContainer = document.createElement('div');
  modalContainer.id = id;
  modalContainer.classList.add('modal');
  modalContainer.style.display = 'none';
  
  // 创建模态框内容
  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');
  
  // 添加标题
  const modalTitle = document.createElement('h2');
  modalTitle.classList.add('modal-title');
  modalTitle.textContent = title;
  modalContent.appendChild(modalTitle);
  
  // 添加内容
  const contentWrapper = document.createElement('div');
  contentWrapper.innerHTML = content;
  modalContent.appendChild(contentWrapper);
  
  // 添加关闭按钮
  const closeButton = document.createElement('button');
  closeButton.classList.add('modal-button');
  closeButton.textContent = '关闭';
  closeButton.addEventListener('click', () => {
    hideModal(id);
    if (typeof onClose === 'function') {
      onClose();
    }
  });
  modalContent.appendChild(closeButton);
  
  // 点击外部区域关闭
  modalContainer.addEventListener('click', (event) => {
    if (event.target === modalContainer) {
      hideModal(id);
      if (typeof onClose === 'function') {
        onClose();
      }
    }
  });
  
  // 添加到DOM
  modalContainer.appendChild(modalContent);
  document.body.appendChild(modalContainer);
  
  return modalContainer;
}

/**
 * 显示模态框
 * @param {String} modalId - 要显示的模态框ID
 */
function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) {
    console.error(`模态框 ${modalId} 不存在`);
    return;
  }
  
  // 隐藏当前活跃的模态框
  if (modalState.activeModal && modalState.activeModal !== modalId) {
    hideModal(modalState.activeModal);
  }
  
  // 显示模态框
  modal.style.display = 'flex';
  modalState.activeModal = modalId;
  
  // 禁用页面滚动
  document.body.style.overflow = 'hidden';
  
  // 触发显示事件
  const event = new CustomEvent('modalShow', { 
    detail: { modalId } 
  });
  document.dispatchEvent(event);
}

/**
 * 隐藏模态框
 * @param {String} modalId - 要隐藏的模态框ID
 */
function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) {
    console.error(`模态框 ${modalId} 不存在`);
    return;
  }
  
  // 隐藏模态框
  modal.style.display = 'none';
  
  // 如果是当前活跃的模态框，清除状态
  if (modalState.activeModal === modalId) {
    modalState.activeModal = null;
    
    // 恢复页面滚动
    document.body.style.overflow = '';
  }
  
  // 触发隐藏事件
  const event = new CustomEvent('modalHide', { 
    detail: { modalId } 
  });
  document.dispatchEvent(event);
}

/**
 * 更新模态框内容
 * @param {String} modalId - 模态框ID
 * @param {Object} updates - 要更新的内容
 * @param {String} updates.title - 新标题
 * @param {String} updates.content - 新内容HTML
 */
function updateModal(modalId, updates) {
  const modal = document.getElementById(modalId);
  if (!modal) {
    console.error(`模态框 ${modalId} 不存在`);
    return;
  }
  
  const modalContent = modal.querySelector('.modal-content');
  
  // 更新标题
  if (updates.title) {
    const titleElement = modalContent.querySelector('.modal-title');
    if (titleElement) {
      titleElement.textContent = updates.title;
    }
  }
  
  // 更新内容
  if (updates.content) {
    const contentWrapper = modalContent.querySelector('.modal-content > div:not(.modal-title)');
    if (contentWrapper) {
      contentWrapper.innerHTML = updates.content;
    }
  }
}

// 导出模态框功能
window.Modal = {
  create: createModal,
  show: showModal,
  hide: hideModal,
  update: updateModal
}; 