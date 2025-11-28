
import React, { useRef, useState, useMemo } from 'react';
import { MALL_STORES } from '../constants';
import { Store } from '../types';
import { Search, Tag, Clock, Navigation, Coffee, Shirt, Smartphone, Gamepad2, Sparkles, ArrowLeft } from 'lucide-react';

interface HotOffersViewProps {
  onBack: () => void;
  onNavigate: (store: Store) => void;
  onAddToTrip: (store: Store) => void;
  tripStoreIds: Set<string>;
}

const CATEGORIES = [
  { id: 'All', label: 'All', icon: Sparkles },
  { id: 'Food', label: 'Food', icon: Coffee },
  { id: 'Fashion', label: 'Fashion', icon: Shirt },
  { id: 'Electronics', label: 'Electronics', icon: Smartphone },
  { id: 'Entertainment', label: 'Fun', icon: Gamepad2 },
];

const HotOffersView: React.FC<HotOffersViewProps> = ({ onBack, onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [query, setQuery] = useState('');

  // Filter stores that have offers
  const filteredOffers = useMemo(() => {
    return MALL_STORES.filter(store => {
      if (!store.offer) return false;
      
      const matchesQuery = store.name.toLowerCase().includes(query.toLowerCase()) || 
                           store.offer.toLowerCase().includes(query.toLowerCase());
      
      let matchesCategory = true;
      if (activeCategory !== 'All') {
         if (activeCategory === 'Food') matchesCategory = ['Food', 'Restaurant', 'Cafe'].includes(store.category);
         else if (activeCategory === 'Fashion') matchesCategory = ['Fashion', 'Accessories'].includes(store.category);
         else if (activeCategory === 'Electronics') matchesCategory = ['Electronics'].includes(store.category);
         else if (activeCategory === 'Entertainment') matchesCategory = ['Entertainment'].includes(store.category);
         else matchesCategory = store.category === activeCategory;
      }

      return matchesQuery && matchesCategory;
    });
  }, [query, activeCategory]);

  return (
    <div 
      className="h-full flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-300"
    >
      {/* Header */}
      <div className="flex items-center gap-4 p-4 pt-safe-area border-b border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 sticky top-0 z-10 transition-colors shadow-sm">
         <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-900 dark:text-white transition">
            <ArrowLeft size={24} />
         </button>
         <h2 className="text-xl font-bold text-gray-900 dark:text-white">Hot Offers</h2>
      </div>

      {/* Search & Filter Area */}
      <div className="px-4 pt-4 pb-2 bg-gray-50 dark:bg-gray-950">
         <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search offers..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-2xl pl-10 pr-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-colors shadow-sm"
            />
         </div>
         
         {/* Category Filters */}
         <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {CATEGORIES.map(cat => {
               const isActive = activeCategory === cat.id;
               const Icon = cat.icon;
               return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`
                       flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap border transition-all duration-300
                       ${isActive 
                          ? 'bg-primary border-primary text-white shadow-lg shadow-primary/25' 
                          : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                       }
                    `}
                  >
                     <Icon size={14} />
                     {cat.label}
                  </button>
               )
            })}
         </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-32">
        {/* Offers Grid */}
        <h3 className="text-gray-900 dark:text-white font-bold mb-4 text-lg px-1">Active Deals ({filteredOffers.length})</h3>
        <div className="grid gap-6">
            {filteredOffers.map((store, idx) => {
                return (
                    <div 
                      key={store.id}
                      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg dark:shadow-black/50 animate-slide-up transition-all group"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                        {/* Store Image Header */}
                        <div className="h-40 relative overflow-hidden">
                           <img src={store.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                           
                           <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-md border border-white/20 text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase shadow-sm">
                              {store.category}
                           </div>

                           <div className="absolute bottom-3 left-3 text-white">
                              <h4 className="font-bold text-xl leading-none mb-1">{store.name}</h4>
                              <div className="text-gray-300 text-xs">{store.floor}</div>
                           </div>
                        </div>

                        <div className="p-4">
                           <div className="flex items-start gap-3 mb-4">
                              <div className="bg-green-100 dark:bg-green-500/20 p-2 rounded-lg text-green-600 dark:text-green-400 shrink-0">
                                 <Tag size={20} />
                              </div>
                              <div>
                                 <p className="text-gray-900 dark:text-white font-bold text-lg leading-tight">{store.offer}</p>
                                 <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs mt-1">
                                    <Clock size={12} /> Valid today until 10 PM
                                 </div>
                              </div>
                           </div>
                        
                           {/* Actions - Simplified to just Navigate */}
                           <div className="flex gap-3">
                               <button 
                                 onClick={() => onNavigate(store)}
                                 className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/20 transition-colors active:scale-95"
                               >
                                  <Navigation size={16} /> Navigate to Store
                               </button>
                           </div>
                        </div>
                    </div>
                )
            })}
        </div>
      </div>
    </div>
  );
};

export default HotOffersView;
