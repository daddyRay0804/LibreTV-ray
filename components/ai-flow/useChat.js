import { useState, useCallback } from 'react';

const GROQ_API_URL = import.meta.env.VITE_GROQ_API_URL;
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const SYSTEM_PROMPT = '你是一个优秀的电影动漫电视剧推荐大师，你会根据用户的需求推荐优质的全球动漫电视剧电影，所有的名称均使用黑色高亮简单让用户可以复制';

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (content) => {
    try {
      setIsLoading(true);
      
      // 添加用户消息
      const userMessage = { role: 'user', content };
      setMessages(prev => [...prev, userMessage]);

      // 准备请求体
      const requestBody = {
        model: 'mixtral-8x7b-32768',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
          userMessage
        ],
        stream: true,
        temperature: 0.7,
        max_tokens: 1000,
      };

      // 发送请求
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      // 处理流式响应
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      const assistantMessage = { role: 'assistant', content: '' };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim() !== '');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content || '';
              assistantMessage.content += content;
              setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = { ...assistantMessage };
                return newMessages;
              });
            } catch (e) {
              console.error('Error parsing chunk:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: '抱歉，发生了一些错误。请稍后重试。' }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  return {
    messages,
    isLoading,
    sendMessage,
  };
}; 