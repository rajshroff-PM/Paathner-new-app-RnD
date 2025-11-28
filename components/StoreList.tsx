
import React, { useRef } from 'react';
import { Store } from '../types';
import { ICON_MAP } from '../constants';
import { MapPin, Clock, Navigation, DoorOpen, LogOut, X, ChevronUp } from 'lucide-react';

interface StoreListProps {
  stores: Store[];
  onStoreSelect: (store: Store) => void;
  onNavigate: (store: Store) => void;
  onAddToTrip: (store: Store) => void;
  tripStoreIds: Set<string>;
  onFindNearest?: (type: 'entry' | 'exit') => void;
  className?: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const StoreList: React.FC<StoreListProps> = ({ 
  stores, 
  onStoreSelect, 
  onNavigate, 
  onFindNearest, 
  className = '',
  isExpanded,
  onToggleExpand
}) => {
  // Swipe detection refs
  const touchStartY = useRef<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    if (contentRef.current && contentRef.current.scrollTop <= 0) {
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY; // Positive = Swipe Up

    if (Math.abs(diff) > 30) {
      if (diff > 0 && !isExpanded) {
        onToggleExpand();
      } else if (diff < 0 && isExpanded) {
        if (contentRef.current && contentRef.current.scrollTop <= 0) {
          onToggleExpand();
        }
      }
    }
    touchStartY.current = null;
  };

  return (
    <div 
      className={`flex flex-col h-full ${className} transition-all duration-500`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Drag Handle & Header */}
      <div 
        className={`px-6 py-2 sticky top-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl z-10 cursor-pointer border-b border-gray-100 dark:border-white/5 shadow-sm dark:shadow-lg transition-all duration-500 ${isExpanded ? 'rounded-none' : 'rounded-t-3xl'}`}
        onClick={() => !isExpanded && onToggleExpand()}
      >
        <div className="w-full flex justify-center py-2" onClick={(e) => { e.stopPropagation(); onToggleExpand(); }}>
           <div className={`w-12 h-1.5 rounded-full transition-colors ${isExpanded ? 'bg-gray-300 dark:bg-gray-600' : 'bg-gray-300 dark:bg-gray-500 hover:bg-primary'}`}></div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Stores</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">{stores.length} locations</p>
          </div>
          
          {isExpanded && (
             <button 
               onClick={(e) => { e.stopPropagation(); onToggleExpand(); }}
               className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition"
             >
                <X size={18} />
             </button>
          )}
          
          {!isExpanded && (
             <span className="text-xs font-bold bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 px-2 py-1 rounded-md flex items-center gap-1 animate-pulse">
               View All <ChevronUp size={12} />
             </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3 mb-4 overflow-x-auto no-scrollbar pb-1" onClick={(e) => e.stopPropagation()}>
           <button 
             onClick={() => onFindNearest && onFindNearest('entry')}
             className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary rounded-xl text-sm font-bold whitespace-nowrap transition-colors"
           >
              <DoorOpen size={16} /> Nearest Entry
           </button>
           <button 
             onClick={() => onFindNearest && onFindNearest('exit')}
             className="flex items-center gap-2 px-4 py-2 bg-secondary/10 hover:bg-secondary/20 border border-secondary/30 text-secondary rounded-xl text-sm font-bold whitespace-nowrap transition-colors"
           >
              <LogOut size={16} /> Nearest Exit
           </button>
        </div>
      </div>

      {/* List Content */}
      <div 
        ref={contentRef}
        className={`flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 px-6 pb-24 no-scrollbar scroll-smooth transition-colors duration-300`}
      >
        <div className={`flex flex-col gap-4 pt-2`}>
          {stores.map((store) => {
             const IconComponent = ICON_MAP[store.iconName] || ICON_MAP['default'];
             const isEntryExit = store.category === "Entry/Exit";
             
             return (
              <div 
                key={store.id}
                className={`
                  w-full transition rounded-2xl p-4 border cursor-pointer group animate-fade-in
                  ${isEntryExit 
                    ? 'bg-blue-50/50 dark:bg-gray-800/60 border-primary/20 dark:border-primary/30' 
                    : 'bg-white dark:bg-gray-800 shadow-sm hover:shadow-md border-gray-100 dark:border-white/5 hover:border-gray-200 dark:hover:border-white/10'
                  }
                `}
                onClick={() => onStoreSelect(store)}
              >
                <div className="flex items-start gap-4 mb-3">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg"
                    style={{ backgroundColor: store.color }}
                  >
                    <IconComponent size={24} color={store.color === '#FFFFFF' ? '#000' : '#FFF'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight truncate">{store.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{store.category}</p>
                    
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                         <MapPin size={12} className="text-primary" />
                         <span className="bg-gray-100 dark:bg-white/5 px-1.5 py-0.5 rounded">{store.floor}</span>
                      </div>
                      <div className="flex items-center gap-1">
                         <Clock size={12} className="text-green-600 dark:text-green-400" />
                         <span>{store.hours.split(' - ')[0]} - ...</span>
                      </div>
                    </div>
                  </div>
                  
                  {store.rating && (
                     <div className="bg-gray-100 dark:bg-black/40 px-2 py-1 rounded-lg text-xs font-bold text-yellow-600 dark:text-yellow-400 border border-gray-200 dark:border-white/5">
                        ⭐ {store.rating}
                     </div>
                  )}
                </div>

                <div className="flex gap-3 mt-4 border-t border-gray-100 dark:border-white/5 pt-3">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate(store);
                    }}
                    className="w-full bg-primary/10 hover:bg-primary group-hover:bg-primary text-primary group-hover:text-white py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <Navigation size={16} /> Navigate
                  </button>
                </div>
              </div>
             );
          })}
        </div>
      </div>
    </div>
  );
};

export default StoreList;
