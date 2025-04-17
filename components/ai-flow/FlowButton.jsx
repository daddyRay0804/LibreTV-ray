import React, { useState } from 'react';
import ChatWidget from './ChatWidget';

const FlowButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* 浮动按钮 */}
      <button
        type="button"
        className="flow-button"
        onClick={toggleChat}
        style={{
          position: 'fixed',
          right: '20px',
          bottom: '20px',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: '#1890ff',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          transition: 'all 0.3s ease',
          zIndex: 1000,
        }}
      >
        <span style={{ fontSize: '24px' }}>AI</span>
      </button>

      {/* 聊天窗口 */}
      {isOpen && (
        <ChatWidget
          isMinimized={isMinimized}
          onMinimize={handleMinimize}
          onClose={handleClose}
        />
      )}
    </div>
  );
};

export default FlowButton; 