
import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage, Store } from '../types';
import { X, Send, User, Globe, ExternalLink, Sparkles, Navigation, MapPin, Bot } from 'lucide-react';

interface ChatAssistantProps {
  onNavigate?: (store: Store) => void;
  showIcon?: boolean;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ onNavigate, showIcon = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'init', role: 'model', text: 'Hello! I am your Amanora Mall assistant. Ask me about stores, offers, or directions!' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Listen for search overlay requests
  useEffect(() => {
    const handleOpenRequest = (e: any) => {
      const query = e.detail;
      setIsOpen(true);
      if (query) {
        handleSend(query);
      }
    };
    window.addEventListener('openChatWithQuery', handleOpenRequest);
    return () => window.removeEventListener('openChatWithQuery', handleOpenRequest);
  }, []);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || inputValue;
    if (!textToSend.trim()) return;

    setInputValue('');
    
    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend
    };

    setMessages(prev => [...prev, newUserMessage]);
    setIsTyping(true);

    const response = await sendMessageToGemini(textToSend);

    const newModelMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: response.text,
      sources: response.sources,
      relatedStore: response.relatedStore
    };

    setMessages(prev => [...prev, newModelMessage]);
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  // Determine if the button should be visible
  // It should be hidden if the chat window is open OR if showIcon is false
  const isButtonVisible = !isOpen && showIcon;

  return (
    <>
      {/* Custom Pink Glowing Robot Icon */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-[90] group transition-all duration-500 transform hover:scale-110 active:scale-95 
          ${isButtonVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-0 opacity-0 translate-y-10 pointer-events-none'}`}
      >
        <div className="relative w-16 h-16 bg-[#EC4899] rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(236,72,153,0.6)] border-2 border-pink-400 overflow-hidden">
           {/* Inner Shine/Gloss Effect */}
           <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/30 to-transparent rounded-t-full pointer-events-none"></div>
           
           {/* Standard Robot Icon */}
           <Bot size={32} className="text-white relative z-10" />
        </div>
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed z-[100] transition-all duration-500 cubic-bezier(0.32,0.72,0,1) overflow-hidden flex flex-col
          ${isOpen 
            ? 'bottom-0 right-0 w-full h-[100dvh] md:w-[400px] md:h-[600px] md:bottom-6 md:right-6 md:rounded-3xl opacity-100 pointer-events-auto' 
            : 'bottom-6 right-6 w-0 h-0 opacity-0 rounded-[50px] pointer-events-none'
          }
          bg-gray-900/95 backdrop-blur-3xl border border-white/10 shadow-2xl font-sans`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#EC4899] to-purple-600 p-4 flex justify-between items-center shrink-0 relative overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
           <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20">
                <Bot size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg leading-none">AI Assistant</h3>
                <span className="text-xs text-pink-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> Online
                </span>
              </div>
           </div>
           <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition relative z-10">
             <X size={20} />
           </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
           {messages.map((msg) => (
             <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'model' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#EC4899] to-purple-600 flex items-center justify-center shrink-0 mr-2 mt-1 shadow-lg border border-white/10">
                    <Sparkles size={14} className="text-white" />
                  </div>
                )}
                
                <div className={`max-w-[80%] rounded-2xl p-3.5 shadow-md text-sm leading-relaxed animate-fade-in relative group ${
                  msg.role === 'user' 
                    ? 'bg-white text-gray-900 rounded-tr-none' 
                    : 'bg-gray-800 border border-white/5 text-gray-100 rounded-tl-none'
                }`}>
                   <p className="whitespace-pre-wrap">{msg.text}</p>
                   
                   {/* Related Store Card */}
                   {msg.relatedStore && (
                      <div className="mt-3 bg-gray-900/50 rounded-xl p-3 border border-white/10 flex items-center gap-3 hover:bg-gray-900 transition-colors cursor-pointer group-hover:border-[#EC4899]/50">
                          <div className="w-10 h-10 rounded-lg bg-gray-700 overflow-hidden shrink-0">
                             {msg.relatedStore.image && <img src={msg.relatedStore.image} className="w-full h-full object-cover" alt={msg.relatedStore.name} />}
                          </div>
                          <div className="flex-1 min-w-0">
                             <div className="font-bold text-white truncate">{msg.relatedStore.name}</div>
                             <div className="text-xs text-gray-400 flex items-center gap-1">
                                <MapPin size={10} /> {msg.relatedStore.floor}
                             </div>
                          </div>
                          {onNavigate && (
                             <button 
                               onClick={() => onNavigate(msg.relatedStore!)}
                               className="bg-[#EC4899] text-white p-2 rounded-lg hover:bg-pink-600 transition shadow-lg shadow-pink-500/20"
                             >
                                <Navigation size={14} />
                             </button>
                          )}
                      </div>
                   )}

                   {/* Sources / Grounding */}
                   {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-white/10">
                         <div className="text-[10px] text-gray-400 uppercase font-bold mb-1 flex items-center gap-1">
                            <Globe size={10} /> Sources
                         </div>
                         <div className="flex flex-wrap gap-2">
                           {msg.sources.map((source, idx) => (
                              <a 
                                key={idx} 
                                href={source.uri} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 bg-black/20 hover:bg-black/40 px-2 py-1 rounded text-xs text-blue-400 truncate max-w-full"
                              >
                                 <ExternalLink size={10} /> {source.title}
                              </a>
                           ))}
                         </div>
                      </div>
                   )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center shrink-0 ml-2 mt-1 border border-white/10">
                    <User size={14} className="text-gray-300" />
                  </div>
                )}
             </div>
           ))}
           {isTyping && (
             <div className="flex justify-start">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#EC4899] to-purple-600 flex items-center justify-center shrink-0 mr-2 border border-white/10">
                    <Sparkles size={14} className="text-white" />
                </div>
                <div className="bg-gray-800 border border-white/5 rounded-2xl rounded-tl-none p-4 shadow-md flex items-center gap-1">
                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
             </div>
           )}
           <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-gray-800 border-t border-white/10">
          <div className="flex items-center gap-2 bg-gray-900 border border-white/10 rounded-2xl px-4 py-2 focus-within:border-[#EC4899]/50 focus-within:ring-1 focus-within:ring-[#EC4899]/20 transition-all shadow-inner">
             <input 
               type="text" 
               className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none py-2"
               placeholder="Type a message..."
               value={inputValue}
               onChange={(e) => setInputValue(e.target.value)}
               onKeyDown={handleKeyDown}
             />
             <button 
               onClick={() => handleSend()}
               disabled={!inputValue.trim() || isTyping}
               className="bg-[#EC4899] hover:bg-pink-600 disabled:opacity-50 disabled:hover:bg-[#EC4899] text-white p-2 rounded-xl transition-all shadow-lg shadow-pink-500/20 active:scale-95"
             >
                <Send size={18} />
             </button>
          </div>
          <div className="text-center mt-2">
             <p className="text-[10px] text-gray-500">AI can make mistakes. Check important info.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatAssistant;
