import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useChat } from './useChat';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ChatWidget = ({ isMinimized, onMinimize, onClose }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const { messages, isLoading, sendMessage } = useChat();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages.length, scrollToBottom]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    await sendMessage(input);
    setInput('');
  };

  // 过滤掉思考过程并处理 markdown
  const processMessage = (content) => {
    // 移除 <think> 标签及其内容
    const withoutThink = content.replace(/<think>[\s\S]*?<\/think>/g, '');
    return withoutThink.trim();
  };

  return (
    <div className={`fixed bottom-20 right-4 w-[90vw] h-[80vh] sm:w-96 sm:h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-xl transition-all duration-300 transform ${
      isMinimized ? 'scale-0' : 'scale-100'
    } md:w-[450px] lg:w-[500px]`}>
      {/* 头部 */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b dark:border-gray-700">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">观影小助手</h3>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={onMinimize}
            className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="最小化"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <title>最小化图标</title>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="关闭"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <title>关闭图标</title>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 h-[calc(100%-7rem)]">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}-${message.content.substring(0, 10)}`}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[80%] rounded-lg p-2 sm:p-3 ${
                message.role === 'user'
                  ? 'bg-yellow-500 text-black'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
              }`}
            >
              {message.role === 'user' ? (
                <div className="whitespace-pre-wrap text-sm sm:text-base">{message.content}</div>
              ) : (
                <div className="prose dark:prose-invert max-w-none prose-sm sm:prose-base">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {processMessage(message.content)}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-2 sm:p-3">
              <div className="flex space-x-2">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-500 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 输入框 */}
      <form onSubmit={handleSubmit} className="p-3 sm:p-4 border-t dark:border-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入您想看的影视类型..."
            className="flex-1 p-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:border-gray-600 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-3 sm:px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 text-sm sm:text-base"
          >
            发送
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWidget; 