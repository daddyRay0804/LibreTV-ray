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
        onClick={toggleChat}
        className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
      >
        <div className="flex items-center space-x-2">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
          >
            <title>AI助手图标</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <span className="hidden sm:inline">AI助手</span>
        </div>
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