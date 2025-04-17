import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useChat } from './useChat';
import './ChatWidget.css';

const ChatWidget = ({ isOpen, onClose }) => {
  const { messages, sendMessage, isLoading } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages.length, scrollToBottom]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="chat-widget">
      <div className="chat-header">
        <h3>AI 观影助手</h3>
        <button type="button" className="close-button" onClick={onClose}>×</button>
      </div>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className={`message ${message.role}`}>
            <div className="message-content">
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message assistant">
            <div className="message-content">
              <div className="typing-indicator">
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form className="chat-input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入您想看的电影类型或风格..."
          className="chat-input"
        />
        <button type="submit" className="send-button" disabled={isLoading}>
          发送
        </button>
      </form>
    </div>
  );
};

export default ChatWidget; 