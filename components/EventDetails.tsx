
import React, { useRef, useState, useEffect } from 'react';
import { Event } from '../types';
import { ArrowLeft, Calendar, Clock, MapPin, Share2, Heart, Check, Users } from 'lucide-react';

interface EventDetailsProps {
  event: Event;
  onBack: () => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({ event, onBack }) => {
  const [isInterested, setIsInterested] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  
  const images = event.images && event.images.length > 0 
    ? event.images 
    : (event.image ? [event.image] : []);

  // Carousel Auto-play
  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImage(prev => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div 
      className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
    >
      {/* Image Carousel Header */}
      <div className="relative h-80 shrink-0 bg-gray-200 dark:bg-gray-800">
         {images.map((img, idx) => (
            <div 
              key={idx}
              className={`absolute inset-0 transition-opacity duration-700 ${idx === currentImage ? 'opacity-100' : 'opacity-0'}`}
            >
               <img src={img} alt={event.title} className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
            </div>
         ))}
         
         {/* Navigation Overlay */}
         <div className="absolute top-0 left-0 right-0 p-4 pt-safe-area flex justify-between items-center z-10">
            <button onClick={onBack} className="p-2.5 bg-white/20 backdrop-blur-xl rounded-full text-white hover:bg-white/30 transition-all active:scale-95 border border-white/10">
               <ArrowLeft size={22} />
            </button>
            <div className="flex gap-3">
               <button className="p-2.5 bg-white/20 backdrop-blur-xl rounded-full text-white hover:bg-white/30 transition-all active:scale-95 border border-white/10">
                  <Share2 size={22} />
               </button>
            </div>
         </div>

         {/* Carousel Dots */}
         {images.length > 1 && (
            <div className="absolute bottom-24 left-0 right-0 flex justify-center gap-2 z-10">
               {images.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === currentImage ? 'bg-white w-4' : 'bg-white/50'}`}
                  />
               ))}
            </div>
         )}

         {/* Header Text Overlay */}
         <div className="absolute bottom-0 left-0 p-6 w-full z-10">
            <div className="flex items-center gap-2 mb-2">
                <div className="px-3 py-1 bg-primary/90 backdrop-blur-md rounded-lg text-white text-xs font-bold uppercase tracking-wider shadow-lg">Event</div>
                {event.interestedCount && (
                   <div className="flex items-center gap-1.5 px-3 py-1 bg-black/40 backdrop-blur-md rounded-lg text-white text-xs font-medium border border-white/10">
                      <Users size={12} className="text-primary" /> {event.interestedCount} interested
                   </div>
                )}
            </div>
            <h1 className="text-3xl font-black text-white leading-tight drop-shadow-lg">{event.title}</h1>
         </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900 -mt-6 rounded-t-[32px] relative z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
         
         {/* Info Grid */}
         <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 flex flex-col justify-center">
               <div className="flex items-center gap-2 text-primary mb-1">
                  <Calendar size={18} />
                  <span className="text-xs font-bold uppercase text-gray-400 tracking-wider">Date</span>
               </div>
               <span className="font-bold text-gray-900 dark:text-white text-sm">{event.date}</span>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 flex flex-col justify-center">
               <div className="flex items-center gap-2 text-orange-500 mb-1">
                  <Clock size={18} />
                  <span className="text-xs font-bold uppercase text-gray-400 tracking-wider">Time</span>
               </div>
               <span className="font-bold text-gray-900 dark:text-white text-sm">{event.time}</span>
            </div>
            <div className="col-span-2 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-primary shrink-0">
                  <MapPin size={20} />
               </div>
               <div>
                  <div className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-0.5">Location</div>
                  <div className="font-bold text-gray-900 dark:text-white">{event.location}</div>
               </div>
            </div>
         </div>

         {/* Description */}
         <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
               About Event
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
               {event.description}
            </p>
         </div>
      </div>

      {/* Footer Button */}
      <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-white/10 pb-safe-area shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-30">
         <button 
            onClick={() => setIsInterested(!isInterested)}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-lg active:scale-95 ${
               isInterested 
               ? 'bg-green-500 hover:bg-green-600 text-white shadow-green-500/30' 
               : 'bg-primary hover:bg-primary-hover text-white shadow-primary/30'
            }`}
         >
            {isInterested ? (
               <>
                  <Check size={24} className="stroke-[3]" /> Marked Interested
               </>
            ) : (
               <>
                  <Heart size={24} className="fill-transparent stroke-[3]" /> I'm Interested
               </>
            )}
         </button>
      </div>
    </div>
  );
};

export default EventDetails;
