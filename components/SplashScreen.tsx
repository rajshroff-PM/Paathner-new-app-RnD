
import React, { useEffect, useState } from 'react';
import Logo from './Logo';

interface SplashScreenProps {
  onComplete?: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Fake progress logic
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Random increment for realistic feel
        const increment = Math.random() * 5 + 1;
        return Math.min(prev + increment, 100);
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      setIsExiting(true);
      const exitTimer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 500); // Wait for fade out transition
      return () => clearTimeout(exitTimer);
    }
  }, [progress, onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-gray-950 overflow-hidden transition-opacity duration-500 ease-out ${isExiting ? 'opacity-0' : 'opacity-100'}`}
    >
      {/* Background Radial Spotlight */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800/30 via-gray-950 to-black pointer-events-none"></div>
      
      {/* Ambient Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '1s' }}></div>

      <div className="relative z-10 flex flex-col items-center justify-center flex-1">
        {/* Logo Container */}
        <div className="relative group cursor-pointer">
           {/* Ripple/Echo Effect */}
           <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl animate-ping opacity-20"></div>
           
           {/* Main Logo */}
           <div className="w-40 h-40 relative z-10 transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3 animate-pulse-slow">
              <Logo className="w-full h-full text-white drop-shadow-[0_0_25px_rgba(6,108,228,0.5)]" noBackground={false} />
           </div>
        </div>
        
        {/* Typography */}
        <div className="mt-12 text-center space-y-4">
            <h1 className="text-5xl font-bold text-white tracking-tight animate-slide-up">
              Paathner
            </h1>
            <p className="text-sm text-gray-400 font-medium uppercase tracking-[0.3em] animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Navigate. Shop. Explore.
            </p>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="w-full max-w-xs mx-auto mb-20 relative z-20">
         <div className="h-0.5 w-full bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary shadow-[0_0_10px_#066CE4] transition-all duration-75 ease-linear relative"
              style={{ width: `${progress}%` }}
            >
               <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white] opacity-50"></div>
            </div>
         </div>
         <div className="mt-2 text-[10px] text-gray-600 text-center font-mono tracking-widest">
            LOADING ASSETS... {Math.floor(progress)}%
         </div>
      </div>
    </div>
  );
};

export default SplashScreen;
