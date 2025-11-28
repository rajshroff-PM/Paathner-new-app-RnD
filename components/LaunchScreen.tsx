
import React from 'react';
import { X, ArrowRight, Play } from 'lucide-react';

interface LaunchScreenProps {
  onClose: () => void;
  onExplore: () => void;
}

const LaunchScreen: React.FC<LaunchScreenProps> = ({ onClose, onExplore }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl"></div>
      
      {/* Content Card */}
      <div className="relative w-full max-w-lg mx-4 bg-black rounded-3xl shadow-[0_0_50px_rgba(255,255,255,0.1)] overflow-hidden animate-fade-in border border-white/10">
         
         {/* Video Container */}
         <div className="relative w-full aspect-[9/16] max-h-[60vh]">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-full object-cover"
              src="https://videos.pexels.com/video-files/3194277/3194277-hd_1080_1920_25fps.mp4"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40"></div>
            
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors border border-white/10 z-20"
            >
                <X size={20} />
            </button>

            <div className="absolute top-4 left-4 bg-red-600 px-3 py-1 rounded-full text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span> Live Now
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent pt-12">
               <h1 className="text-3xl font-black text-white mb-2 leading-tight drop-shadow-2xl">
                  Summer Music Fest
               </h1>
               <p className="text-gray-300 text-sm mb-6 line-clamp-2">
                  Join the beat! Live DJ performances, food stalls, and exclusive merchandise available at the main atrium.
               </p>

               <button 
                  onClick={onExplore}
                  className="w-full bg-white hover:bg-gray-100 text-black font-bold py-3.5 rounded-xl transition-all transform active:scale-95 flex items-center justify-center gap-2 group shadow-lg"
               >
                  <Play size={18} className="fill-black" /> Check it out
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default LaunchScreen;
