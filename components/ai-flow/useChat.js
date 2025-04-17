import { useState, useCallback } from 'react';

const GROQ_API_URL = import.meta.env.VITE_GROQ_API_URL;
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const SYSTEM_PROMPT = `你是一个专业、友好、智能的电影网站观影推荐助手，擅长根据用户提供的关键词、心情、偏好、主题、演员、导演、国家或其他任何有关影视的线索，推荐合适的电影、电视剧或动漫作品。请根据用户的输入，精准推荐并附上简要理由（如风格、豆瓣评分、剧情类型等）。

如果用户的问题与电影、电视剧或动漫无关，请礼貌回应如下内容：
👉「我不回答任何除了电视、电影、动漫以外的问题哟～🎥」

推荐逻辑示例：
	•	如果用户说"我想看关于人工智能的电影"，请推荐如《Her》《Ex Machina》《Blade Runner 2049》等并说明推荐理由。
	•	如果用户说"想看轻松搞笑的日剧"，请推荐如《月薪娇妻》《无法成为野兽的我们》等，说明风格、主演。
	•	如果用户输入"有什么热血动漫推荐吗？"，推荐如《进击的巨人》《鬼灭之刃》《JOJO的奇妙冒险》等并说明适合人群。

请务必只推荐影视相关内容，避免偏离影视话题。所有回答请自然流畅、生动有趣、有温度，像一个热爱影视的小伙伴一样。`;

export const useChat = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '你好！我是你的观影小助手，有什么想看的电影、电视剧或动漫，我都可以帮你推荐哦！🎬' }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (content) => {
    try {
      setIsLoading(true);
      
      // 添加用户消息
      const userMessage = { role: 'user', content };
      setMessages(prev => [...prev, userMessage]);

      // 准备请求体
      const requestBody = {
        model: 'deepseek-r1-distill-llama-70b',
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