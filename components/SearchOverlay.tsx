
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Store } from '../types';
import { Search, Mic, X, Star, ArrowRight, ArrowLeft, Sparkles, MapPin, Store as StoreIcon, Utensils, Globe, Camera, History, TrendingUp, Coffee, Smartphone, Gamepad2, Shirt, ShoppingBag, Loader2 } from 'lucide-react';
import { MALL_STORES } from '../constants';
import { searchWithImage } from '../services/geminiService';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onStoreSelect: (store: Store) => void;
  onAddToTrip: (store: Store) => void;
  initialQuery: string;
  onQueryChange: (q: string) => void;
  startListening: () => void;
  isListening: boolean;
  onNavigate: (store: Store) => void;
}

const CATEGORIES = [
  { id: 'All', label: 'All', icon: Sparkles },
  { id: 'Fashion', label: 'Fashion', icon: Shirt },
  { id: 'Food', label: 'Food & Dining', icon: Coffee },
  { id: 'Electronics', label: 'Electronics', icon: Smartphone },
  { id: 'Entertainment', label: 'Fun', icon: Gamepad2 },
];

const SearchOverlay: React.FC<SearchOverlayProps> = ({
  isOpen,
  onClose,
  onStoreSelect,
  onAddToTrip,
  initialQuery,
  onQueryChange,
  startListening,
  isListening,
  onNavigate
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);

  // Handle visibility transitions for smooth entry/exit
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 50);
      document.body.style.overflow = 'hidden';
      // Load recents
      const saved = localStorage.getItem('recent_searches');
      if (saved) {
        try { setRecentSearches(JSON.parse(saved)); } catch (e) {}
      }
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      document.body.style.overflow = 'auto';
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const addToRecents = (term: string) => {
    const newRecents = [term, ...recentSearches.filter(r => r !== term)].slice(0, 5);
    setRecentSearches(newRecents);
    localStorage.setItem('recent_searches', JSON.stringify(newRecents));
  };

  const handleSelectStore = (store: Store) => {
    addToRecents(store.name);
    onStoreSelect(store);
  };

  const handleRecentClick = (term: string) => {
    onQueryChange(term);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsAnalyzingImage(true);
      const reader = new FileReader();
      reader.onload = async (ev) => {
        if (ev.target?.result) {
          const base64 = ev.target.result as string;
          const keywords = await searchWithImage(base64);
          if (keywords) {
            onQueryChange(keywords);
          }
          setIsAnalyzingImage(false);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // --- Smart Search Logic ---
  const { suggestions, filteredResults } = useMemo(() => {
    const lowerQ = initialQuery.toLowerCase().trim();
    
    // 1. Base Filter
    let results = MALL_STORES;

    // Apply Category Filter
    if (activeCategory !== 'All') {
       if (activeCategory === 'Food') {
          results = results.filter(s => ['Food', 'Restaurant', 'Cafe'].includes(s.category));
       } else if (activeCategory === 'Fashion') {
          results = results.filter(s => ['Fashion', 'Accessories'].includes(s.category));
       } else if (activeCategory === 'Electronics') {
          results = results.filter(s => ['Electronics'].includes(s.category));
       } else if (activeCategory === 'Entertainment') {
          results = results.filter(s => ['Entertainment'].includes(s.category));
       } else {
          results = results.filter(s => s.category === activeCategory);
       }
    }

    // Apply Query Filter
    if (lowerQ) {
      results = results.filter(s => 
        s.name.toLowerCase().includes(lowerQ) || 
        s.category.toLowerCase().includes(lowerQ) ||
        (s.menu && s.menu.some(m => m.name.toLowerCase().includes(lowerQ))) ||
        (s.description && s.description.toLowerCase().includes(lowerQ))
      );
    }

    // 2. Suggestions (Only if typing)
    if (!lowerQ || lowerQ.length < 2) return { suggestions: null, filteredResults: results };

    const storeMatches = MALL_STORES
      .filter(s => s.name.toLowerCase().includes(lowerQ))
      .slice(0, 3);

    const categoryMatches = Array.from(new Set(MALL_STORES.map(s => s.category)))
      .filter(c => c.toLowerCase().includes(lowerQ))
      .slice(0, 2);

    const menuMatches: { item: any; store: Store }[] = [];
    MALL_STORES.forEach(s => {
      if (s.menu) {
        s.menu.forEach(m => {
          if (m.name.toLowerCase().includes(lowerQ)) {
            menuMatches.push({ item: m, store: s });
          }
        });
      }
    });

    return { 
      suggestions: { stores: storeMatches, categories: categoryMatches, menu: menuMatches.slice(0, 3) },
      filteredResults: results
    };
  }, [initialQuery, activeCategory]);

  if (!isVisible && !isOpen) return null;

  // Helper to trigger AI Chat for internet search
  const handleInternetSearch = () => {
    addToRecents(initialQuery);
    onClose();
    const event = new CustomEvent('openChatWithQuery', { detail: initialQuery });
    window.dispatchEvent(event);
  };

  return (
    <div 
      className={`fixed inset-0 z-[80] flex flex-col bg-gray-50/95 dark:bg-gray-950/95 backdrop-blur-3xl transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
    >
       {/* --- Search Header --- */}
       <div className="px-4 pb-4 pt-safe-area pt-3 flex flex-col gap-4 bg-gradient-to-b from-white/80 dark:from-black/50 to-transparent sticky top-0 z-20">
          
          <div className="flex gap-3 items-center">
            <button 
                onClick={onClose}
                className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors active:scale-95 shrink-0 shadow-sm"
            >
                <ArrowLeft size={24} />
            </button>

            {/* Input Container - Matched App.tsx Search Bar UI */}
            <div className="flex-1 relative h-12 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center px-4 gap-3 border border-gray-200 dark:border-transparent hover:border-primary/30 dark:hover:border-primary/30 transition-all duration-500 shadow-inner">
                <Search className="text-gray-400" size={20} />
                <input 
                  ref={inputRef}
                  type="text"
                  value={initialQuery}
                  onChange={(e) => onQueryChange(e.target.value)}
                  placeholder={isAnalyzingImage ? "Analyzing image..." : "Search stores, products or brands..."}
                  className="flex-1 bg-transparent border-none focus:outline-none text-gray-900 dark:text-white text-sm font-medium h-full w-full min-w-0 placeholder-gray-500"
                  autoComplete="off"
                  disabled={isAnalyzingImage}
                />
                
                {initialQuery && !isAnalyzingImage && (
                    <button onClick={() => onQueryChange('')} className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-white transition-colors">
                        <X size={16} />
                    </button>
                )}
                
                <div className="w-px h-6 bg-gray-300 dark:bg-white/10"></div>

                {/* Right Side Icons */}
                <div className="flex items-center gap-2">
                   <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                   <button 
                     onClick={() => fileInputRef.current?.click()}
                     className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                     title="Visual Search"
                   >
                      {isAnalyzingImage ? <Loader2 size={20} className="animate-spin text-primary" /> : <Camera size={20} />}
                   </button>
                   <button 
                     onClick={startListening}
                     className={`transition-all ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-400 hover:text-primary'}`}
                   >
                     <Mic size={20} />
                   </button>
                </div>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
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
                           : 'bg-white dark:bg-gray-800/50 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                        }
                     `}
                   >
                      <Icon size={14} />
                      {cat.label}
                   </button>
                )
             })}
          </div>

          {/* Suggestions Dropdown (Absolute) */}
          {initialQuery.length > 1 && suggestions && (
            <div className="absolute top-[130px] left-4 right-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-3xl border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-slide-up-fade z-50 max-h-[60vh] overflow-y-auto">
                {/* Stores */}
                {suggestions.stores.length > 0 && (
                  <div className="py-2">
                      <div className="text-[10px] uppercase tracking-widest text-gray-500 px-4 py-2 font-bold">Stores</div>
                      {suggestions.stores.map(store => (
                        <div key={store.id} className="flex items-center w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group border-l-2 border-transparent hover:border-primary">
                            <button onClick={() => handleSelectStore(store)} className="flex-1 flex items-center gap-3 text-left">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-gray-100 dark:bg-gray-800" style={{ color: store.color }}>
                                  <StoreIcon size={16} />
                                </div>
                                <div>
                                  <div className="text-gray-900 dark:text-white font-medium text-sm group-hover:text-primary transition-colors">{store.name}</div>
                                  <div className="text-xs text-gray-500">{store.floor}</div>
                                </div>
                            </button>
                        </div>
                      ))}
                  </div>
                )}
                {/* Menu Items */}
                {suggestions.menu.length > 0 && (
                  <div className="py-2 border-t border-gray-100 dark:border-white/5">
                      <div className="text-[10px] uppercase tracking-widest text-gray-500 px-4 py-2 font-bold">On the Menu</div>
                      {suggestions.menu.map(({ item, store }, idx) => (
                        <button key={idx} onClick={() => handleSelectStore(store)} className="flex w-full px-4 py-2 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group items-center text-left">
                          <Utensils size={14} className="text-orange-500 dark:text-orange-400 mr-3" />
                          <div className="flex-1">
                              <div className="text-gray-900 dark:text-white text-sm">{item.name}</div>
                              <div className="text-[10px] text-gray-500">at {store.name}</div>
                          </div>
                          <div className="text-xs font-mono text-green-600 dark:text-green-400">₹{item.price}</div>
                        </button>
                      ))}
                  </div>
                )}
                {/* Search Web */}
                <div className="p-2 bg-gray-50 dark:bg-black/20 border-t border-gray-100 dark:border-white/5">
                  <button onClick={handleInternetSearch} className="w-full flex items-center justify-between p-3 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary transition-colors group">
                      <div className="flex items-center gap-3">
                        <Globe size={18} />
                        <span className="text-sm font-bold">Search "{initialQuery}" on Web</span>
                      </div>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
            </div>
          )}
       </div>

       {/* --- Results Area --- */}
       <div className="flex-1 overflow-y-auto p-4 pb-32">
          
          {/* Case 1: No Query & No Category Filter (Show Recents & Trending) */}
          {!initialQuery && activeCategory === 'All' && !isAnalyzingImage && (
             <div className="space-y-8 animate-fade-in">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                     <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2 px-1">
                        <History size={16} /> Recent
                     </h3>
                     <div className="flex flex-wrap gap-2">
                        {recentSearches.map((term, i) => (
                           <button 
                             key={i}
                             onClick={() => handleRecentClick(term)}
                             className="px-4 py-2 bg-white dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white border border-gray-200 dark:border-white/5 transition-all shadow-sm"
                           >
                              {term}
                           </button>
                        ))}
                     </div>
                  </div>
                )}

                {/* Trending / Featured */}
                <div>
                   <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2 px-1">
                      <TrendingUp size={16} /> Featured & Popular
                   </h3>
                   <div className="grid grid-cols-2 gap-4">
                      {MALL_STORES.filter(s => s.rating && s.rating >= 4.5).slice(0, 4).map(store => (
                         <button 
                           key={store.id} 
                           onClick={() => handleSelectStore(store)}
                           className="relative aspect-[1.5] rounded-xl overflow-hidden group border border-gray-200 dark:border-white/5 hover:border-primary/50 transition-all shadow-sm"
                         >
                            <img src={store.image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 dark:opacity-70 group-hover:opacity-100" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                            <div className="absolute bottom-3 left-3 text-left">
                               <div className="font-bold text-white text-sm">{store.name}</div>
                               <div className="text-[10px] text-gray-300">{store.category}</div>
                            </div>
                         </button>
                      ))}
                   </div>
                </div>
             </div>
          )}

          {/* Case 2: Showing Results (Filtered by Query or Category) */}
          {(initialQuery || activeCategory !== 'All') && (
             <>
                <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-4 px-1">
                   {filteredResults.length} Results Found
                </h3>
                
                {filteredResults.length === 0 ? (
                   <div className="flex flex-col items-center justify-center pt-10 opacity-60">
                      <ShoppingBag size={48} className="mb-4 text-gray-400 dark:text-gray-600" />
                      <p className="text-gray-500 dark:text-gray-400 text-sm">No stores found matching your criteria.</p>
                      {initialQuery && (
                         <button onClick={handleInternetSearch} className="mt-4 text-primary hover:text-white text-sm font-bold">
                            Ask AI Assistant instead?
                         </button>
                      )}
                   </div>
                ) : (
                   <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {filteredResults.map((store, index) => (
                         <button 
                           key={store.id}
                           onClick={() => handleSelectStore(store)}
                           className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/5 hover:border-primary/50 transition-all duration-300 hover:shadow-xl dark:hover:shadow-primary/10 text-left animate-slide-up"
                           style={{ animationDelay: `${index * 50}ms` }}
                         >
                            <img src={store.image} alt={store.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 dark:opacity-60 group-hover:opacity-100 dark:group-hover:opacity-40" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                            
                            {store.rating && (
                              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur px-1.5 py-0.5 rounded flex items-center gap-1 border border-white/10">
                                 <Star size={10} className="text-yellow-400 fill-yellow-400" />
                                 <span className="text-[10px] font-bold text-white">{store.rating}</span>
                              </div>
                            )}

                            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 transition-transform">
                               <div className="text-[10px] text-primary font-bold mb-0.5 uppercase tracking-wider">{store.category}</div>
                               <h3 className="text-lg font-bold text-white leading-tight mb-1">{store.name}</h3>
                               <div className="flex items-center gap-1 text-[10px] text-gray-300">
                                  <MapPin size={10} /> {store.floor}
                               </div>
                            </div>
                         </button>
                      ))}
                   </div>
                )}
             </>
          )}
       </div>
    </div>
  );
};

export default SearchOverlay;
