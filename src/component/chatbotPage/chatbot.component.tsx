import React, { useState, useEffect, useRef } from 'react';
import '../chatbotPage/chatbot.css';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
};

const ChatbotPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const chatBoxRef = useRef<HTMLDivElement | null>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage: Message = { role: 'user', content: input };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    setInput('');

    try {
      const response = await fetch('http://localhost:4000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: 'unique_user_id', message: input }),
      });

      const data = await response.json();
      const aiMessage: Message = { role: 'assistant', content: data.reply };

      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('Error communicating with the AI:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: 'Error communicating with the AI.' },
      ]);
    }
  };

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="chat-box" ref={chatBoxRef}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`chat-bubble ${
              message.role === 'user' ? 'user-bubble' : 'assistant-bubble'
            }`}
          >
            {message.content}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatbotPage;
