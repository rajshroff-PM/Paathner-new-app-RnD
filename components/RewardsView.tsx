
import React, { useState, useRef, useEffect } from 'react';
import { LoyaltyCard, Transaction } from '../types';
import { ICON_MAP } from '../constants';
import { 
  ArrowLeft, 
  Plus, 
  QrCode, 
  Wifi, 
  History, 
  Sparkles,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  X,
  Save,
  CreditCard,
  LayoutList,
  Layers,
  Search,
  Calendar,
  TrendingUp,
  Gift
} from 'lucide-react';

interface RewardsViewProps {
  userPoints: number;
  onRedeem: (cost: number) => void;
  onBack: () => void;
}

// Extended Mock Data for the Wallet Stack - Moved here for initial state
const INITIAL_CARDS: LoyaltyCard[] = [
  {
    id: 'c1',
    storeId: 'apple',
    storeName: 'Apple Wallet',
    points: 2450,
    color: '#000000',
    iconName: 'apple',
    memberSince: '2021',
    tier: 'Platinum',
    cardNumber: '4111 •••• •••• 9821',
    customImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop', // Cyberpunk/Tech dark
    transactions: [
        { id: 't1', date: 'Today', amount: 450, type: 'earn', description: 'Apple Store Purchase' },
        { id: 't2', date: 'Yesterday', amount: 50, type: 'earn', description: 'iCloud Subscription' },
        { id: 't3', date: 'Oct 12', amount: -1000, type: 'redeem', description: 'Accessory Discount' }
    ]
  },
  {
    id: 'c2',
    storeId: 'nike',
    storeName: 'Nike Member',
    points: 1200,
    color: '#D21404', // Nike Red
    iconName: 'shirt',
    memberSince: '2023',
    tier: 'Legend',
    cardNumber: '8829 •••• •••• 1122',
    customImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop', // Red shoe
    transactions: [
        { id: 't4', date: 'Oct 10', amount: 1200, type: 'earn', description: 'Air Jordan 1' }
    ]
  },
  {
    id: 'c3',
    storeId: 'starbucks',
    storeName: 'Starbucks',
    points: 450,
    color: '#006241', // Starbucks Green
    iconName: 'coffee',
    memberSince: '2022',
    tier: 'Gold',
    cardNumber: '6021 •••• •••• 9911',
    customImage: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1000&auto=format&fit=crop', // Coffee texture
    transactions: [
        { id: 't5', date: 'Today', amount: 15, type: 'earn', description: 'Morning Coffee' },
        { id: 't6', date: 'Oct 14', amount: -150, type: 'redeem', description: 'Free Pastry' }
    ]
  },
  {
    id: 'c4',
    storeId: 'ikea',
    storeName: 'IKEA Family',
    points: 890,
    color: '#0051BA', // Ikea Blue
    iconName: 'gift',
    memberSince: '2020',
    tier: 'Family',
    cardNumber: '1102 •••• •••• 3344',
    customImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1000&auto=format&fit=crop', // Modern Interior
    transactions: [
       { id: 't7', date: 'Sep 20', amount: 890, type: 'earn', description: 'Furniture Haul' }
    ]
  },
  {
    id: 'c5',
    storeId: 'sephora',
    storeName: 'Sephora',
    points: 3200,
    color: '#111111',
    iconName: 'bag',
    memberSince: '2019',
    tier: 'VIB Rouge',
    cardNumber: '9921 •••• •••• 5566',
    customImage: 'https://images.unsplash.com/photo-1522335789203-abd6538d8ad1?q=80&w=1000&auto=format&fit=crop', // Makeup
    transactions: []
  },
   {
    id: 'c6',
    storeId: 'gaming',
    storeName: 'Arcade Zone',
    points: 5000,
    color: '#7C3AED',
    iconName: 'game',
    memberSince: '2024',
    tier: 'Pro Gamer',
    cardNumber: '7721 •••• •••• 2211',
    customImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1000&auto=format&fit=crop', // Neon gaming
    transactions: [
       { id: 't8', date: 'Oct 15', amount: 500, type: 'earn', description: 'High Score Bonus' }
    ]
  }
];

const CARD_COLORS = ['#000000', '#D21404', '#006241', '#0051BA', '#7C3AED', '#CA8A04', '#10B981'];

const RewardsView: React.FC<RewardsViewProps> = ({ userPoints, onBack }) => {
  const [cards, setCards] = useState<LoyaltyCard[]>(INITIAL_CARDS);
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'stack' | 'list'>('stack');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Animation State
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Modals State
  const [showAddCard, setShowAddCard] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showOffers, setShowOffers] = useState(false);
  
  const [newCard, setNewCard] = useState({
    storeName: '',
    cardNumber: '',
    color: '#000000'
  });

  // Audio Ref for Sound Effects
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Refs for gesture handling
  const touchStartY = useRef<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Filter Cards based on search
  const filteredCards = cards.filter(card => 
     card.storeName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const activeCard = filteredCards[activeIndex];

  // Reset active index if search changes result count
  useEffect(() => {
    if (activeIndex >= filteredCards.length) {
       setActiveIndex(0);
    }
  }, [searchQuery, filteredCards.length]);

  // Initialize Audio
  useEffect(() => {
    audioRef.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-paper-slide-1530.mp3');
    audioRef.current.volume = 0.5;
    audioRef.current.load();
  }, []);

  const playSwipeSound = () => {
    if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(e => console.debug("Sound play failed", e));
    }
  };

  // --- Handlers ---

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (viewMode !== 'stack') return;
    setIsDragging(true);
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    touchStartY.current = clientY;
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (viewMode !== 'stack') return;
    if (touchStartY.current === null) return;
    
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diffY = clientY - touchStartY.current;
    
    // Only allow drag if not flipped
    if (!isFlipped) {
       setDragY(diffY);
    }

    // Tilt Effect
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = clientX - rect.left - rect.width / 2;
      const y = clientY - rect.top - rect.height / 2;
      setTilt({ x: x / 25, y: -y / 25 });
    }
  };

  const handleTouchEnd = () => {
    if (viewMode !== 'stack') return;
    setIsDragging(false);
    
    if (!isFlipped) {
      const threshold = 80; // Swipe threshold
      if (dragY < -threshold && activeIndex < filteredCards.length - 1) {
        // Swiped UP -> Next Card
        setActiveIndex(prev => prev + 1);
        setTilt({ x: 0, y: 0 }); // Reset tilt
        playSwipeSound();
      } else if (dragY > threshold && activeIndex > 0) {
        // Swiped DOWN -> Prev Card
        setActiveIndex(prev => prev - 1);
        setTilt({ x: 0, y: 0 });
        playSwipeSound();
      }
    }
    
    setDragY(0);
    touchStartY.current = null;
    // Don't reset tilt immediately for smooth effect
    setTimeout(() => setTilt({ x: 0, y: 0 }), 300);
  };

  const toggleFlip = () => setIsFlipped(!isFlipped);

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if(!newCard.storeName || !newCard.cardNumber) return;

    const cardToAdd: LoyaltyCard = {
      id: `c-${Date.now()}`,
      storeId: newCard.storeName.toLowerCase().replace(/\s/g, '-'),
      storeName: newCard.storeName,
      points: 0,
      color: newCard.color,
      iconName: 'credit-card', // Generic icon
      memberSince: new Date().getFullYear().toString(),
      tier: 'Member',
      cardNumber: newCard.cardNumber,
      customImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1000&auto=format&fit=crop', // Abstract gradient
      transactions: []
    };

    setCards(prev => [...prev, cardToAdd]);
    setShowAddCard(false);
    setNewCard({ storeName: '', cardNumber: '', color: '#000000' });
    
    // Switch to stack and jump to new card
    setViewMode('stack');
    setSearchQuery(''); // Clear search to ensure new card is visible
    // We need to wait for state update to find the index, simpler to just jump to end
    setTimeout(() => {
        setActiveIndex(cards.length); // cards.length because we just added one
        playSwipeSound();
    }, 100);
  };

  const handleCardSelect = (index: number) => {
    setActiveIndex(index);
    setViewMode('stack');
    playSwipeSound();
  };

  // Background gradient based on active card
  const bgGradient = `radial-gradient(circle at 50% 30%, ${activeCard?.color || '#333'}66, #000000)`;

  return (
    <div 
      className="fixed inset-0 z-[200] flex flex-col bg-black text-white overflow-hidden"
      style={{ background: bgGradient }}
    >
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen">
             <div className="absolute top-[-20%] left-[-20%] w-[80vw] h-[80vw] bg-white/10 rounded-full blur-[100px] animate-pulse"></div>
             <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-white/5 rounded-full blur-[80px]" style={{ animationDelay: '2s' }}></div>
        </div>
        
        {/* --- Header --- */}
        <div className="relative z-50 px-4 pt-10 pb-2 w-full bg-gradient-to-b from-black/80 to-transparent">
            <div className="flex items-center justify-between mb-4">
                <button 
                  onClick={onBack} 
                  className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all active:scale-95"
                >
                   <ArrowLeft size={20} />
                </button>
                
                <h1 className="text-sm font-bold tracking-[0.2em] uppercase opacity-80">Digicardx</h1>
                
                <div className="flex gap-3">
                    <button 
                      onClick={() => setViewMode(viewMode === 'stack' ? 'list' : 'stack')}
                      className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all text-white active:scale-95"
                    >
                       {viewMode === 'stack' ? <LayoutList size={20} /> : <Layers size={20} />}
                    </button>
                    <button 
                      onClick={() => setShowAddCard(true)}
                      className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all text-white active:scale-95"
                    >
                       <Plus size={20} />
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={16} />
               <input 
                 type="text" 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder="Search cards..."
                 className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:bg-white/10 transition-colors backdrop-blur-sm"
               />
            </div>
        </div>

        {/* --- Content Area (Stack vs List) --- */}
        <div className="flex-1 relative z-10 w-full overflow-hidden">
           
           {/* STACK VIEW */}
           {viewMode === 'stack' && (
             <div 
               className="w-full h-full flex items-center justify-center perspective-1000"
               onMouseDown={handleTouchStart}
               onMouseMove={handleTouchMove}
               onMouseUp={handleTouchEnd}
               onMouseLeave={handleTouchEnd}
               onTouchStart={handleTouchStart}
               onTouchMove={handleTouchMove}
               onTouchEnd={handleTouchEnd}
               style={{ perspective: '1200px' }}
             >
                 {filteredCards.length > 0 ? (
                   <div className="relative w-[85%] max-w-sm aspect-[1.58]">
                    {filteredCards.map((card, index) => {
                       // Render a subset of cards for performance
                       if (index < activeIndex - 1 || index > activeIndex + 2) return null;

                       const isActive = index === activeIndex;
                       const offset = index - activeIndex;
                       
                       let style: React.CSSProperties = {};
                       
                       if (isActive) {
                          style = {
                             transform: `
                               translateY(${dragY}px) 
                               rotateX(${tilt.y}deg) 
                               rotateY(${isFlipped ? 180 + tilt.x : tilt.x}deg)
                               scale(1)
                             `,
                             zIndex: 50,
                             opacity: 1,
                             transition: isDragging ? 'none' : 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)'
                          };
                       } else if (offset > 0) {
                          // Next Cards
                          const scale = 1 - (offset * 0.05);
                          const yPos = 40 * offset + (dragY > 0 ? dragY * 0.2 : 0);
                          style = {
                             transform: `translateY(${yPos}px) scale(${scale}) translateZ(-${offset * 50}px)`,
                             zIndex: 50 - offset,
                             opacity: 1 - (offset * 0.3),
                             filter: `brightness(${1 - offset * 0.2})`,
                             transition: isDragging ? 'none' : 'all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)'
                          };
                       } else {
                          // Prev Cards (Hidden/Fly away)
                           style = {
                             transform: `translateY(-120vh) scale(0.9)`,
                             zIndex: 0,
                             opacity: 0,
                             transition: 'all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)'
                          };
                       }

                       const IconComponent = ICON_MAP[card.iconName] || CreditCard;

                       return (
                          <div 
                            key={card.id}
                            ref={isActive ? cardRef : null}
                            className="absolute inset-0 w-full h-full"
                            style={{ 
                               ...style, 
                               transformStyle: 'preserve-3d',
                               cursor: isActive ? 'grab' : 'default'
                            }}
                            onClick={isActive ? toggleFlip : undefined}
                          >
                             {/* FRONT */}
                             <div 
                                className="absolute inset-0 w-full h-full rounded-[32px] overflow-hidden backface-hidden shadow-2xl border border-white/10"
                                style={{ backgroundColor: card.color, backfaceVisibility: 'hidden' }}
                             >
                                 <div className="absolute inset-0">
                                     <img src={card.customImage} className="w-full h-full object-cover opacity-60 mix-blend-overlay" alt="" />
                                     <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/80" />
                                 </div>
                                 <div className="relative z-10 p-6 h-full flex flex-col justify-between" style={{ transform: 'translateZ(20px)' }}>
                                     <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                           <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
                                              <IconComponent size={20} className="text-white" />
                                           </div>
                                           <div className="flex flex-col">
                                              <h2 className="font-bold text-lg leading-none drop-shadow-md mb-1">{card.storeName}</h2>
                                              <div className="flex items-center gap-1.5">
                                                 <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded text-white font-semibold backdrop-blur-md">{card.tier}</span>
                                              </div>
                                           </div>
                                        </div>
                                        <Wifi size={24} className="text-white/50 rotate-90" />
                                     </div>
                                     <div>
                                        <div className="flex justify-between items-end mb-2">
                                           <div className="text-4xl font-black tracking-tight tabular-nums drop-shadow-lg">
                                              {card.points.toLocaleString()} <span className="text-sm font-bold opacity-70">PTS</span>
                                           </div>
                                           <Plus size={24} className="text-white/40 mb-1 rotate-45" /> 
                                        </div>
                                        <div className="font-mono text-sm text-white/60 tracking-wider flex justify-between items-center bg-black/20 p-2 rounded-lg backdrop-blur-sm border border-white/5">
                                            <span>{card.cardNumber}</span>
                                        </div>
                                     </div>
                                 </div>
                             </div>

                             {/* BACK */}
                             <div 
                                className="absolute inset-0 w-full h-full rounded-[32px] overflow-hidden backface-hidden bg-gray-900 border border-white/10 shadow-2xl flex flex-col items-center justify-center p-8 text-center"
                                style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
                             >
                                 <div className="absolute top-0 w-full h-2" style={{ backgroundColor: card.color }}></div>
                                 <div className="bg-white p-4 rounded-2xl shadow-inner mb-6">
                                    <QrCode size={120} className="text-black" />
                                 </div>
                                 <h3 className="text-white font-bold text-xl mb-1">{card.storeName}</h3>
                                 <p className="text-gray-400 text-xs mb-6">Scan to redeem points</p>
                                 <button onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }} className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors">
                                    <RotateCcw size={14} /> Flip Back
                                 </button>
                             </div>
                          </div>
                       );
                    })}
                   </div>
                 ) : (
                   <div className="text-center text-gray-400">
                      <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                         <CreditCard size={32} />
                      </div>
                      <p>No cards found matching "{searchQuery}".</p>
                   </div>
                 )}

                 {filteredCards.length > 0 && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-8 text-white/10 pointer-events-none">
                      <ChevronUp size={24} className={activeIndex > 0 ? 'animate-bounce opacity-50' : 'opacity-0'} />
                      <ChevronDown size={24} className={activeIndex < filteredCards.length - 1 ? 'animate-bounce opacity-50' : 'opacity-0'} />
                  </div>
                 )}
             </div>
           )}

           {/* LIST VIEW */}
           {viewMode === 'list' && (
              <div className="w-full h-full overflow-y-auto p-4 pb-32 animate-fade-in">
                 {filteredCards.length > 0 ? (
                    <div className="space-y-4">
                       {filteredCards.map((card, index) => {
                          const IconComponent = ICON_MAP[card.iconName] || CreditCard;
                          return (
                             <button 
                                key={card.id}
                                onClick={() => handleCardSelect(index)}
                                className="w-full bg-gray-900/60 border border-white/10 rounded-2xl p-4 flex items-center gap-4 hover:bg-gray-800 transition-colors group text-left"
                             >
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg shrink-0" style={{ backgroundColor: card.color }}>
                                   <IconComponent size={24} />
                                </div>
                                <div className="flex-1 min-w-0">
                                   <h3 className="font-bold text-white text-lg truncate">{card.storeName}</h3>
                                   <p className="text-gray-400 text-xs">{card.tier} Member</p>
                                </div>
                                <div className="text-right">
                                   <div className="font-bold text-xl text-white">{card.points}</div>
                                   <div className="text-[10px] text-gray-500 uppercase">Points</div>
                                </div>
                             </button>
                          );
                       })}
                    </div>
                 ) : (
                    <div className="text-center text-gray-400 mt-20">
                      <Search size={40} className="mx-auto mb-2 opacity-30" />
                      <p>No cards found.</p>
                    </div>
                 )}
              </div>
           )}
        </div>

        {/* --- Bottom Info Panel (Only visible in Stack View or always? Let's keep it visible but disabled if no card) --- */}
        <div className="relative z-20 bg-white/5 backdrop-blur-2xl border-t border-white/10 pb-safe-area">
           <div className="p-6">
               <div className="flex items-center justify-between mb-6">
                   <div>
                       <div className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Active Card</div>
                       {activeCard ? (
                           <div className="text-lg font-bold flex items-center gap-2">
                               {activeCard.storeName} <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_10px_lime]"></span>
                           </div>
                       ) : (
                           <div className="text-sm text-gray-500">None selected</div>
                       )}
                   </div>
               </div>
               
               {/* Quick Actions - Updated: History, Offers (Pay removed) */}
               <div className="grid grid-cols-2 gap-4">
                   <button 
                     disabled={!activeCard}
                     onClick={() => setShowHistory(true)}
                     className="flex flex-col items-center gap-2 group bg-white/5 py-3 rounded-xl border border-white/5 hover:bg-white/10 transition-colors disabled:opacity-50"
                   >
                      <History size={20} className="text-gray-300" />
                      <span className="text-[10px] text-gray-400">History</span>
                   </button>
                   <button 
                     disabled={!activeCard}
                     onClick={() => setShowOffers(true)}
                     className="flex flex-col items-center gap-2 group bg-white/5 py-3 rounded-xl border border-white/5 hover:bg-white/10 transition-colors disabled:opacity-50"
                   >
                      <Sparkles size={20} className="text-yellow-400" />
                      <span className="text-[10px] text-gray-400">Offers</span>
                   </button>
               </div>
           </div>
        </div>
        
        {/* --- MODALS --- */}

        {/* Add Card Modal */}
        {showAddCard && (
           <div className="absolute inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
              <div className="bg-gray-900 border border-white/10 w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-slide-up">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Add New Card</h3>
                    <button onClick={() => setShowAddCard(false)}><X size={24} className="text-gray-400" /></button>
                 </div>
                 
                 <form onSubmit={handleAddCard} className="space-y-4">
                    <div>
                       <label className="text-xs text-gray-500 uppercase font-bold ml-1">Store / Provider Name</label>
                       <input 
                         type="text" 
                         className="w-full bg-black/40 border border-white/20 rounded-xl p-3 text-white mt-1 focus:border-white focus:outline-none"
                         placeholder="e.g. Amazon Pay"
                         value={newCard.storeName}
                         onChange={(e) => setNewCard({...newCard, storeName: e.target.value})}
                         required
                       />
                    </div>
                    <div>
                       <label className="text-xs text-gray-500 uppercase font-bold ml-1">Card / Member Number</label>
                       <input 
                         type="text" 
                         className="w-full bg-black/40 border border-white/20 rounded-xl p-3 text-white mt-1 focus:border-white focus:outline-none font-mono"
                         placeholder="XXXX XXXX XXXX XXXX"
                         value={newCard.cardNumber}
                         onChange={(e) => setNewCard({...newCard, cardNumber: e.target.value})}
                         required
                       />
                    </div>
                    <div>
                       <label className="text-xs text-gray-500 uppercase font-bold ml-1 mb-2 block">Card Color</label>
                       <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                          {CARD_COLORS.map(color => (
                             <button
                               key={color}
                               type="button"
                               onClick={() => setNewCard({...newCard, color})}
                               className={`w-10 h-10 rounded-full shrink-0 border-2 ${newCard.color === color ? 'border-white scale-110' : 'border-transparent'}`}
                               style={{ backgroundColor: color }}
                             />
                          ))}
                       </div>
                    </div>
                    
                    <button 
                       type="submit" 
                       className="w-full bg-white text-black font-bold py-4 rounded-xl mt-4 flex items-center justify-center gap-2 hover:bg-gray-200"
                    >
                       <Save size={18} /> Save Card
                    </button>
                 </form>
              </div>
           </div>
        )}

        {/* History Modal */}
        {showHistory && activeCard && (
           <div className="absolute inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center">
              <div className="bg-gray-900 border border-white/10 w-full max-w-sm h-[70vh] rounded-t-3xl sm:rounded-3xl shadow-2xl animate-slide-up flex flex-col">
                 <div className="p-6 border-b border-white/10 flex justify-between items-center shrink-0">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                       <History size={20} className="text-gray-400" /> History
                    </h3>
                    <button onClick={() => setShowHistory(false)}><X size={24} className="text-gray-400" /></button>
                 </div>
                 
                 <div className="flex-1 overflow-y-auto p-6">
                    {activeCard.transactions && activeCard.transactions.length > 0 ? (
                       <div className="space-y-4">
                          {activeCard.transactions.map((tx) => (
                             <div key={tx.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                <div className="flex items-center gap-3">
                                   <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'earn' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                      {tx.type === 'earn' ? <TrendingUp size={18} /> : <Gift size={18} />}
                                   </div>
                                   <div>
                                      <div className="font-bold text-sm text-white">{tx.description}</div>
                                      <div className="text-xs text-gray-500">{tx.date}</div>
                                   </div>
                                </div>
                                <div className={`font-mono font-bold ${tx.type === 'earn' ? 'text-green-400' : 'text-red-400'}`}>
                                   {tx.type === 'earn' ? '+' : ''}{tx.amount}
                                </div>
                             </div>
                          ))}
                       </div>
                    ) : (
                       <div className="flex flex-col items-center justify-center h-full text-gray-500">
                          <Calendar size={48} className="mb-2 opacity-20" />
                          <p>No recent activity</p>
                       </div>
                    )}
                 </div>
              </div>
           </div>
        )}

        {/* Offers Modal */}
        {showOffers && activeCard && (
           <div className="absolute inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center">
              <div className="bg-gray-900 border border-white/10 w-full max-w-sm h-[70vh] rounded-t-3xl sm:rounded-3xl shadow-2xl animate-slide-up flex flex-col">
                 <div className="p-6 border-b border-white/10 flex justify-between items-center shrink-0">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                       <Sparkles size={20} className="text-yellow-400" /> Exclusive Offers
                    </h3>
                    <button onClick={() => setShowOffers(false)}><X size={24} className="text-gray-400" /></button>
                 </div>
                 
                 <div className="flex-1 overflow-y-auto p-6 space-y-4">
                     {/* Mock Offers for Demo */}
                     <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-2xl relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/20 rounded-full blur-2xl"></div>
                        <div className="relative z-10">
                           <div className="bg-white/20 backdrop-blur inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase mb-2">Limited Time</div>
                           <h4 className="font-bold text-lg text-white mb-1">Double Points Weekend</h4>
                           <p className="text-xs text-blue-100 mb-3">Earn 2x points on all purchases made this Saturday and Sunday.</p>
                           <button className="bg-white text-blue-600 px-4 py-2 rounded-lg text-xs font-bold w-full">Activate Offer</button>
                        </div>
                     </div>

                     <div className="bg-gray-800 border border-white/10 p-4 rounded-2xl flex gap-4 items-center">
                        <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center shrink-0">
                           <Gift size={24} className="text-pink-400" />
                        </div>
                        <div className="flex-1">
                           <h4 className="font-bold text-white text-sm">Free Birthday Gift</h4>
                           <p className="text-xs text-gray-400">Claim your free item during your birthday month.</p>
                        </div>
                     </div>

                     <div className="bg-gray-800 border border-white/10 p-4 rounded-2xl flex gap-4 items-center">
                        <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center shrink-0">
                           <TrendingUp size={24} className="text-green-400" />
                        </div>
                        <div className="flex-1">
                           <h4 className="font-bold text-white text-sm">Tier Upgrade Boost</h4>
                           <p className="text-xs text-gray-400">Spend 500 more points to reach the next tier instantly.</p>
                        </div>
                     </div>
                 </div>
              </div>
           </div>
        )}

        <style>{`
          .perspective-1000 { perspective: 1000px; }
          .backface-hidden { backface-visibility: hidden; }
        `}</style>
    </div>
  );
};

export default RewardsView;
