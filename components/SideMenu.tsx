
import React, { useRef, useEffect, useState } from 'react';
import { Map as MapIcon, Calendar, FileText, CreditCard, LifeBuoy, Car, Route, Flame, ChevronRight, Coffee, Info } from 'lucide-react';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onTabChange: (tab: any) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenProfile: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ 
  isOpen, 
  onClose, 
  activeTab, 
  onTabChange, 
  onOpenProfile
}) => {
  const menuItems = [
    { id: 'map', label: 'Home & Map', icon: MapIcon, color: 'text-blue-500', activeBg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { id: 'takeaway', label: 'Food Takeaway', icon: Coffee, color: 'text-orange-600', activeBg: 'bg-orange-600/10', border: 'border-orange-600/20' },
    { id: 'hot-offers', label: 'Hot Offers', icon: Flame, color: 'text-orange-500', activeBg: 'bg-orange-500/10', border: 'border-orange-500/20' },
    { id: 'amenities', label: 'Amenities', icon: Info, color: 'text-cyan-500', activeBg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
    { id: 'trip', label: 'Trip Planner', icon: Route, color: 'text-purple-500', activeBg: 'bg-purple-500/10', border: 'border-purple-500/20' },
    { id: 'events', label: 'Events', icon: Calendar, color: 'text-pink-500', activeBg: 'bg-pink-500/10', border: 'border-pink-500/20' },
    { id: 'rewards', label: 'Digicardx', icon: CreditCard, color: 'text-indigo-500', activeBg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
    { id: 'parking', label: 'Smart Parking', icon: Car, color: 'text-yellow-500', activeBg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
    { id: 'blog', label: 'Community', icon: FileText, color: 'text-teal-500', activeBg: 'bg-teal-500/10', border: 'border-teal-500/20' },
    { id: 'lost-found', label: 'Lost & Found', icon: LifeBuoy, color: 'text-red-500', activeBg: 'bg-red-500/10', border: 'border-red-500/20' },
  ];

  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Swipe Logic
  const touchStartX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff < -50) onClose(); // Swipe Left to close
    touchStartX.current = null;
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-[100] bg-black/20 dark:bg-black/60 backdrop-blur-md transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div 
        className={`
          fixed top-0 left-0 bottom-0 z-[101] 
          w-[80%] max-w-[300px] 
          bg-white/90 dark:bg-[#121212]/90 
          backdrop-blur-3xl border-r border-white/20 dark:border-white/10
          shadow-[20px_0_50px_rgba(0,0,0,0.1)] dark:shadow-[20px_0_50px_rgba(0,0,0,0.5)]
          transform transition-transform duration-500 cubic-bezier(0.19, 1, 0.22, 1)
          flex flex-col overflow-hidden
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Ambient Glows */}
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-secondary/10 rounded-full blur-[100px] pointer-events-none"></div>

        {/* --- Header (Profile) --- */}
        <div className="relative px-6 pt-14 pb-4 shrink-0 z-10">
           <button 
             onClick={() => { onOpenProfile(); onClose(); }}
             className="w-full group relative overflow-hidden rounded-3xl p-4 border border-white/50 dark:border-white/10 bg-white/40 dark:bg-white/5 hover:bg-white/60 dark:hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-xl text-left ring-1 ring-black/5"
           >
              <div className="flex items-center gap-4 relative z-10">
                 <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-2xl p-0.5 bg-gradient-to-br from-white to-gray-200 dark:from-gray-700 dark:to-gray-900 shadow-inner">
                       <img 
                         src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80" 
                         alt="User" 
                         className="w-full h-full rounded-[14px] object-cover"
                       />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#34C759] border-[3px] border-white dark:border-[#1c1c1e] rounded-full"></div>
                 </div>
                 
                 <div className="flex-1 min-w-0">
                    <h2 className="text-base font-bold text-gray-900 dark:text-white truncate leading-tight">Raj Shroff</h2>
                    <div className="flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5 group-hover:text-primary transition-colors">
                       View Profile <ChevronRight size={12} />
                    </div>
                 </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none"></div>
           </button>
        </div>

        {/* --- Navigation --- */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1 scroll-smooth no-scrollbar z-10">
           {menuItems.map((item, index) => {
              const isActive = activeTab === item.id;
              return (
                 <button
                   key={item.id}
                   onClick={() => {
                      onTabChange(item.id);
                      onClose();
                   }}
                   className={`
                      group relative w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 ease-out
                      border border-transparent
                      ${isActive 
                        ? `bg-white dark:bg-white/10 shadow-md ${item.border}` 
                        : 'hover:bg-white/40 dark:hover:bg-white/5 hover:scale-[1.02]'
                      }
                   `}
                   style={{ 
                      transitionDelay: `${index * 30}ms`,
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? 'translateX(0)' : 'translateX(-10px)'
                   }}
                 >
                    <div className={`
                       relative z-10 w-9 h-9 rounded-xl flex items-center justify-center transition-colors duration-300
                       ${isActive ? item.activeBg : 'bg-gray-100 dark:bg-white/5'}
                    `}>
                       <item.icon size={18} className={`${item.color} ${isActive ? 'fill-current opacity-20' : ''}`} />
                       <item.icon size={18} className={`absolute ${item.color}`} />
                    </div>

                    <span className={`relative z-10 text-sm font-semibold tracking-wide ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                       {item.label}
                    </span>

                    {isActive && (
                       <div className={`absolute right-4 w-1.5 h-1.5 rounded-full ${item.color.replace('text-', 'bg-')} shadow-[0_0_8px_currentColor]`}></div>
                    )}
                 </button>
              );
           })}
        </div>
      </div>
    </>
  );
};

export default SideMenu;
