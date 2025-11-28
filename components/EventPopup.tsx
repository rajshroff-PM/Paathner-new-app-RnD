import React, { useState, useEffect } from 'react';
import { Event } from '../types';
import { X, Calendar, MapPin, ArrowRight } from 'lucide-react';

interface EventPopupProps {
  event: Event;
  onDismiss: () => void;
}

const EventPopup: React.FC<EventPopupProps> = ({ event, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Small delay for animation trigger
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 500); // Wait for exit animation
  };

  return (
    <div 
      className={`fixed inset-0 z-[60] flex items-center justify-center pointer-events-none transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div 
        className={`
          pointer-events-auto
          relative w-[90%] max-w-sm
          bg-gray-900/60 backdrop-blur-2xl 
          border border-white/10 
          rounded-3xl 
          shadow-[0_20px_50px_rgba(0,0,0,0.5)]
          overflow-hidden
          transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1)
          transform
          ${isVisible ? 'translate-y-0 scale-100' : 'translate-y-20 scale-95'}
        `}
      >
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/20 to-transparent"></div>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl"></div>
        
        <div className="relative p-6 text-center">
          <div className="inline-block bg-primary text-white text-xs font-bold px-3 py-1 rounded-full mb-4 shadow-lg shadow-primary/30">
            FEATURED EVENT
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2 leading-tight">{event.title}</h2>
          <p className="text-gray-300 text-sm mb-6 line-clamp-3 leading-relaxed">
            {event.description}
          </p>

          <div className="flex justify-center gap-4 text-xs text-gray-400 mb-6">
            <div className="flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-lg">
              <Calendar size={14} className="text-primary" />
              {event.date.split(' ')[0]}
            </div>
            <div className="flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-lg">
              <MapPin size={14} className="text-primary" />
              {event.location}
            </div>
          </div>

          <button 
             onClick={handleClose}
             className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition flex items-center justify-center gap-2 group"
          >
            View Details <ArrowRight size={16} className="transition-transform group-hover:translate-x-1"/>
          </button>
        </div>

        {/* Dismiss Section */}
        <div className="border-t border-white/10">
          <button 
            onClick={handleClose}
            className="w-full py-3 text-gray-400 text-sm hover:text-white hover:bg-white/5 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventPopup;