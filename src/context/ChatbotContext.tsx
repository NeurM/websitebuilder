import React, { createContext, useContext, useState } from 'react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatbotContextType {
  messages: Message[];
  isOpen: boolean;
  isLoading: boolean;
  sendMessage: (content: string) => Promise<void>;
  toggleChat: () => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export const ChatbotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // TODO: Implement actual API call to chatbot service
      const response = await new Promise(resolve => 
        setTimeout(() => resolve('This is a mock response'), 1000)
      );

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response as string,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <ChatbotContext.Provider value={{
      messages,
      isOpen,
      isLoading,
      sendMessage,
      toggleChat,
    }}>
      {children}
    </ChatbotContext.Provider>
  );
};

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
}; 