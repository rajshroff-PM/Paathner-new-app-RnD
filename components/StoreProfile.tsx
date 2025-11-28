
import React, { useState, useMemo, useRef } from 'react';
import { Store } from '../types';
import { X, MapPin, Clock, Navigation, Heart, PlusCircle, Star, Phone, Share2, CheckCircle, ShoppingBag, Filter, User, ChevronDown, ThumbsUp, Utensils } from 'lucide-react';

interface StoreProfileProps {
  store: Store;
  onClose: () => void;
  onNavigate: (store: Store) => void;
  onAddToTrip: (store: Store) => void;
  isInTrip: boolean;
  onTakeaway?: (store: Store) => void; // Optional prop
}

// Mock Reviews Data
const MOCK_REVIEWS = [
  { id: 1, user: 'Rahul M.', rating: 5, comment: 'Excellent service and great collection! Found exactly what I was looking for.', date: '2 days ago', timestamp: 1728000000000, likes: 12 },
  { id: 2, user: 'Priya S.', rating: 4, comment: 'Good store, but quite crowded on weekends. Staff is helpful though.', date: '1 week ago', timestamp: 1727400000000, likes: 5 },
];

type SortOption = 'newest' | 'highest' | 'lowest';

const StoreProfile: React.FC<StoreProfileProps> = ({ store, onClose, onNavigate, onAddToTrip, isInTrip, onTakeaway }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState<'about' | 'menu' | 'offers' | 'reviews'>('about');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const toggleBookmark = () => setIsBookmarked(!isBookmarked);

  const sortedReviews = useMemo(() => {
    return [...MOCK_REVIEWS]; // Simplified sorting
  }, [sortBy]);

  const touchStartY = useRef<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const onTouchStart = (e: React.TouchEvent) => { touchStartY.current = e.touches[0].clientY; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const diffY = e.changedTouches[0].clientY - touchStartY.current;
    if (diffY > 75 && (!contentRef.current || contentRef.current.scrollTop <= 0)) {
       onClose();
    }
    touchStartY.current = null;
  };

  const isFoodPlace = ['Restaurant', 'Cafe', 'Food'].includes(store.category);

  return (
    <div 
      className="fixed inset-x-0 bottom-0 z-[70] h-[90dvh] bg-white dark:bg-gray-900 flex flex-col rounded-t-3xl shadow-2xl animate-slide-up overflow-hidden border-t border-gray-200 dark:border-white/10 transition-colors duration-300"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Drag Handle */}
      <div className="absolute top-0 left-0 right-0 h-6 z-20 flex justify-center items-center pointer-events-none">
         <div className="w-12 h-1.5 bg-white/50 dark:bg-white/20 rounded-full"></div>
      </div>

      {/* Header Image */}
      <div className="relative h-64 shrink-0">
        <img src={store.image} alt={store.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-gray-900 via-white/40 dark:via-gray-900/40 to-transparent" />
        
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 mt-2">
          <button onClick={onClose} className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition">
             <ChevronDown size={24} />
          </button>
          <div className="flex gap-3">
             <button className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition"><Share2 size={20} /></button>
             <button onClick={toggleBookmark} className={`w-10 h-10 backdrop-blur-md rounded-full flex items-center justify-center transition ${isBookmarked ? 'bg-pink-500 text-white' : 'bg-black/40 text-white'}`}><Heart size={20} className={isBookmarked ? 'fill-white' : ''} /></button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6">
           <div className="flex justify-between items-end mb-2">
              <div className="bg-primary px-3 py-1 rounded-lg text-xs font-bold text-white uppercase tracking-wide shadow-lg">{store.category}</div>
              {store.rating && (
                 <div className="flex items-center gap-1 bg-yellow-400/20 backdrop-blur-md px-2 py-1 rounded-lg border border-yellow-500/30">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-gray-900 dark:text-white font-bold">{store.rating}</span>
                 </div>
              )}
           </div>
           <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2 leading-none">{store.name}</h1>
           <div className="flex items-center gap-4 text-sm text-gray-700 dark:text-gray-300">
              <span className="flex items-center gap-1"><MapPin size={14} className="text-primary" /> {store.floor}</span>
              <span className="flex items-center gap-1"><Clock size={14} className="text-green-600 dark:text-green-400" /> Open Now</span>
           </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 dark:border-white/5 px-6 overflow-x-auto no-scrollbar shrink-0 bg-white dark:bg-gray-900 z-10 sticky top-0">
         {['about', 'menu', 'offers', 'reviews'].map(tab => (
            <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-4 px-3 font-bold text-sm border-b-2 transition-colors capitalize ${activeTab === tab ? 'text-gray-900 dark:text-white border-primary' : 'text-gray-500 border-transparent'}`}
            >
                {tab === 'menu' ? 'Menu & Order' : tab}
            </button>
         ))}
      </div>

      {/* Content */}
      <div ref={contentRef} className="flex-1 overflow-y-auto p-6 pb-32">
         {activeTab === 'about' && (
            <div className="space-y-6">
               <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5 border border-gray-100 dark:border-white/5">
                  <h3 className="text-gray-900 dark:text-white font-bold mb-2">Description</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{store.description}</p>
               </div>
               {/* More content stubs omitted for brevity */}
            </div>
         )}
         {activeTab === 'menu' && isFoodPlace && (
             <div className="text-center py-4">
                 <p className="text-gray-500 mb-4">Browse the full menu for takeaway.</p>
                 <button onClick={() => onTakeaway && onTakeaway(store)} className="bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 w-full">
                     <Utensils size={18} /> View Menu & Order
                 </button>
             </div>
         )}
      </div>

      {/* Footer Actions */}
      <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-white/10 flex gap-3 shrink-0 pb-safe-area">
         <button 
            onClick={() => onAddToTrip(store)}
            className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 border transition-all ${isInTrip ? 'bg-green-100 dark:bg-green-900/20 border-green-500 text-green-600' : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white'}`}
         >
            {isInTrip ? <CheckCircle size={18} /> : <PlusCircle size={18} />}
            {isInTrip ? 'Added' : 'Add to Trip'}
         </button>
         
         <button 
            onClick={() => onNavigate(store)}
            className="flex-[2] bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg"
         >
            <Navigation size={18} /> Navigate
         </button>
      </div>
    </div>
  );
};

export default StoreProfile;
