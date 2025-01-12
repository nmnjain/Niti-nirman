import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Minimize2, Maximize2, Monitor } from 'lucide-react';
import { sendMessage } from '../services/chatbotService';

const ChatbotInterface = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isEnlarged, setIsEnlarged] = useState(false);
  const messagesEndRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setInputMessage(''); 
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await sendMessage(userMessage);
      setMessages(prev => [...prev, { role: 'bot', content: response }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { role: 'bot', content: 'Sorry, I encountered an error. Please try again.' }]);
    }

    setIsLoading(false);
  };

  const toggleSize = () => {
    setIsEnlarged(prev => !prev);
  };

  return (
    <div className="fixed bottom-20 right-10 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white rounded-full p-4 shadow-lg transition-all duration-200"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      ) : (
        <div 
          className={`
            bg-white rounded-lg shadow-xl transition-all duration-200 
            ${isMinimized ? 'h-14' : isEnlarged ? 'h-[80vh] w-[600px]' : 'h-[500px] w-[350px]'}
            flex flex-col
          `}
        >
          
          <div className="flex items-center justify-between p-4 border-b bg-amber-600 text-white rounded-t-lg">
            <h3 className="font-semibold">Niti-Mitra</h3>
            <div className="flex gap-2">
              <button 
                onClick={toggleSize}
                className="hover:bg-amber-700 rounded p-1"
                title={isEnlarged ? "Restore size" : "Maximize"}
              >
                <Monitor className="h-4 w-4" />
              </button>
              <button 
                onClick={() => setIsMinimized(!isMinimized)}
                className="hover:bg-amber-700 rounded p-1"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="hover:bg-amber-700 rounded p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              
              <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${isEnlarged ? 'text-base' : 'text-sm'}`}>
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.role === 'user'
                          ? 'bg-amber-600 text-white'
                          : 'bg-amber-50 text-slate-800'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-amber-50 rounded-lg px-4 py-2">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                        <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

            
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className={`flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      isEnlarged ? 'text-base' : 'text-sm'
                    }`}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading}
                    className="bg-amber-600 hover:bg-amber-700 text-white rounded-lg px-4 py-2 disabled:opacity-50"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatbotInterface;