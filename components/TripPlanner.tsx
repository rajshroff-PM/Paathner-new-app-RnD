
import React, { useRef, useState } from 'react';
import { Store } from '../types';
import { MapPin, Trash2, Navigation, Clock, Footprints, Plus, ArrowLeft, Sparkles, Loader2, X, GripVertical, Route, PlusCircle, Search } from 'lucide-react';
import { getAiItinerary } from '../services/geminiService';
import { MALL_STORES } from '../constants';

interface TripPlannerProps {
  trip: Store[];
  onRemove: (storeId: string) => void;
  onNavigate: (store: Store) => void;
  onClear: () => void;
  onAddStop: () => void;
  onBack: () => void;
  onBatchAdd: (stores: Store[]) => void;
  onReorder: (trip: Store[]) => void;
}

const TripPlanner: React.FC<TripPlannerProps> = ({ trip, onRemove, onNavigate, onClear, onAddStop, onBack, onBatchAdd, onReorder }) => {
  const totalTime = trip.length * 15; // Approx 15 mins per store
  const totalSteps = trip.length * 150; // Approx steps between stores

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showStoreSelector, setShowStoreSelector] = useState(false);
  const [storeSearchQuery, setStoreSearchQuery] = useState('');
  
  // Drag State
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  // Swipe to back logic
  const touchStart = useRef<number | null>(null);
  
  const onTouchStart = (e: React.TouchEvent) => { 
    // If interacting with a draggable element, don't trigger back swipe logic
    if ((e.target as HTMLElement).closest('[draggable="true"]')) {
       return;
    }
    touchStart.current = e.touches[0].clientX; 
  };
  
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const diff = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(diff) > 50 && !isAiModalOpen && !showStoreSelector) onBack(); 
    touchStart.current = null;
  };

  const handleAiPlan = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    
    const storeIds = await getAiItinerary(aiPrompt);
    const newStores = MALL_STORES.filter(s => storeIds.includes(s.id));
    
    if (newStores.length > 0) {
        onBatchAdd(newStores);
        setIsAiModalOpen(false);
        setAiPrompt('');
    } else {
        alert("Couldn't find matching stores. Try a different request.");
    }
    
    setIsGenerating(false);
  };

  // Drag Handlers
  const onDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const onDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedItemIndex === null) return;
    if (draggedItemIndex === dropIndex) {
        setDraggedItemIndex(null);
        return;
    }
    
    const newTrip = [...trip];
    const [removed] = newTrip.splice(draggedItemIndex, 1);
    newTrip.splice(dropIndex, 0, removed);
    
    onReorder(newTrip);
    setDraggedItemIndex(null);
  };

  const filteredStores = MALL_STORES.filter(s => 
    s.name.toLowerCase().includes(storeSearchQuery.toLowerCase()) || 
    s.category.toLowerCase().includes(storeSearchQuery.toLowerCase())
  );

  // Manual Store Selector View
  if (showStoreSelector) {
    return (
      <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300 animate-slide-up">
         <div className="bg-white dark:bg-gray-900 p-4 pt-safe-area border-b border-gray-200 dark:border-white/10 sticky top-0 z-20">
            <div className="flex items-center gap-4 mb-4">
               <button onClick={() => setShowStoreSelector(false)} className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 p-2 rounded-full -ml-2 transition-colors">
                  <ArrowLeft size={24} />
               </button>
               <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add Stop</h2>
            </div>
            
            <div className="relative">
               <Search className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" size={18} />
               <input 
                 type="text" 
                 placeholder="Search stores..." 
                 value={storeSearchQuery}
                 onChange={(e) => setStoreSearchQuery(e.target.value)}
                 className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 focus:border-primary outline-none transition-colors"
                 autoFocus
               />
            </div>
         </div>

         <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
               {filteredStores.map(store => {
                  const isAlreadyAdded = trip.some(t => t.id === store.id);
                  return (
                    <div key={store.id} className="flex items-center gap-4 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-white/5 hover:border-primary/50 transition-all shadow-sm">
                       <img src={store.image} className="w-12 h-12 rounded-lg object-cover bg-gray-200 dark:bg-gray-700" alt={store.name} />
                       <div className="flex-1 min-w-0">
                          <div className="font-bold text-gray-900 dark:text-white truncate">{store.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{store.category} • {store.floor}</div>
                       </div>
                       <button 
                         onClick={() => { 
                            if (!isAlreadyAdded) {
                                onBatchAdd([store]);
                                setShowStoreSelector(false);
                            }
                         }}
                         disabled={isAlreadyAdded}
                         className={`p-2 rounded-full transition-colors ${isAlreadyAdded ? 'text-green-500 bg-green-100 dark:bg-green-500/10' : 'text-primary bg-primary/10 hover:bg-primary hover:text-white'}`}
                       >
                          {isAlreadyAdded ? <Sparkles size={20} /> : <PlusCircle size={24} />}
                       </button>
                    </div>
                  );
               })}
            </div>
         </div>
      </div>
    );
  }

  return (
    <div 
      className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Header */}
      <div className="flex items-center gap-4 p-4 pt-safe-area border-b border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 sticky top-0 z-10 transition-colors">
         <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-900 dark:text-white transition">
            <ArrowLeft size={24} />
         </button>
         <h2 className="text-xl font-bold text-gray-900 dark:text-white">Trip Planner</h2>
      </div>

      {trip.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 text-gray-400 dark:text-gray-500 shadow-inner">
             <Route size={48} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your Trip is Empty</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xs mb-8">
            Browse stores and click "Add to Trip" to build your perfect shopping itinerary.
          </p>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <button 
                onClick={() => setIsAiModalOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 active:scale-95 transition-transform"
            >
                <Sparkles size={20} /> AI Auto-Plan
            </button>
            <button 
                onClick={() => setShowStoreSelector(true)}
                className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 border border-gray-200 dark:border-white/10 active:scale-95 transition-transform shadow-sm"
            >
                <Plus size={20} /> Add Manually
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Stats Header */}
          <div className="p-6 bg-white dark:bg-gray-800/50 border-b border-gray-200 dark:border-white/5 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Current Itinerary</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{trip.length} stops planned</p>
              </div>
              <button 
                onClick={onClear}
                className="text-xs text-red-500 dark:text-red-400 hover:text-red-600 bg-red-50 dark:bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-100 dark:border-red-500/20"
              >
                Clear All
              </button>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-black/30 px-3 py-2 rounded-lg border border-gray-200 dark:border-white/5">
                <Clock size={16} className="text-primary" />
                <div>
                  <div className="text-xs text-gray-500">Est. Time</div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">{Math.floor(totalTime / 60)}h {totalTime % 60}m</div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-black/30 px-3 py-2 rounded-lg border border-gray-200 dark:border-white/5">
                <Footprints size={16} className="text-green-600 dark:text-green-500" />
                <div>
                  <div className="text-xs text-gray-500">Est. Steps</div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">{totalSteps}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline List */}
          <div className="flex-1 overflow-y-auto p-6 pb-32">
            <div className="relative pb-4">
              {/* Timeline Line */}
              <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-300 dark:bg-gray-700"></div>

              <div className="space-y-6">
                {trip.map((store, index) => (
                  <div 
                    key={store.id} 
                    className={`relative pl-10 group animate-slide-up transition-all duration-200 ${draggedItemIndex === index ? 'opacity-50 scale-95' : 'opacity-100'}`} 
                    style={{ animationDelay: `${index * 100}ms` }}
                    draggable
                    onDragStart={(e) => onDragStart(e, index)}
                    onDragOver={(e) => onDragOver(e, index)}
                    onDrop={(e) => onDrop(e, index)}
                  >
                    {/* Timeline Dot (Drag Handle) */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-white dark:bg-gray-800 border-2 border-primary rounded-full flex items-center justify-center z-10 font-bold text-gray-900 dark:text-white text-xs cursor-move hover:scale-110 transition-transform shadow-md">
                       <span className="group-hover:hidden">{index + 1}</span>
                       <GripVertical size={14} className="hidden group-hover:block text-gray-400 dark:text-gray-300" />
                    </div>

                    <div className="bg-white dark:bg-gray-800/40 border border-gray-200 dark:border-white/5 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-all flex items-center gap-4 cursor-grab active:cursor-grabbing shadow-sm">
                      <div className="w-14 h-14 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden shrink-0 pointer-events-none shadow-inner border border-white/10">
                        <img src={store.image} alt={store.name} className="w-full h-full object-cover" />
                      </div>
                      
                      <div className="flex-1 min-w-0 pointer-events-none">
                        <h3 className="font-bold text-gray-900 dark:text-white truncate">{store.name}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{store.floor} • {store.category}</p>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => onNavigate(store)}
                          className="p-2 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-lg transition-colors"
                          title="Navigate Here"
                        >
                          <Navigation size={16} />
                        </button>
                        <button 
                          onClick={() => onRemove(store.id)}
                          className="p-2 bg-gray-100 dark:bg-white/5 hover:bg-red-50 dark:hover:bg-red-500/20 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg transition-colors"
                          title="Remove"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Stop Buttons */}
                <div className="relative pl-10 pt-2 flex flex-col gap-2">
                  <div className="absolute left-2.5 top-8 -translate-y-1/2 w-3 h-3 bg-gray-400 dark:bg-gray-600 rounded-full z-10"></div>
                  
                  <button 
                    onClick={() => setIsAiModalOpen(true)}
                    className="w-full bg-gradient-to-r from-purple-100 dark:from-purple-600/20 to-blue-100 dark:to-blue-600/20 hover:from-purple-200 dark:hover:from-purple-600/30 hover:to-blue-200 dark:hover:to-blue-600/30 border border-purple-200 dark:border-purple-500/30 rounded-xl p-3 flex items-center justify-center gap-2 text-purple-700 dark:text-purple-300 font-bold transition-all"
                  >
                      <Sparkles size={18} /> AI Auto-Add
                  </button>

                  <button 
                    onClick={() => setShowStoreSelector(true)}
                    className="w-full border-2 border-dashed border-gray-300 dark:border-white/10 hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl p-3 flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all"
                  >
                      <Plus size={18} /> Add another stop
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-white/10 transition-colors">
            <button 
              onClick={() => onNavigate(trip[0])}
              className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
            >
              <Navigation size={20} /> Start Navigation
            </button>
          </div>
        </>
      )}

      {/* AI Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-3xl border border-gray-200 dark:border-white/10 p-6 shadow-2xl relative">
                <button onClick={() => setIsAiModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 dark:hover:text-white">
                    <X size={24} />
                </button>
                
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30">
                        <Sparkles size={32} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">AI Trip Planner</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                        Tell us what you want to do, and we'll build the perfect itinerary.
                    </p>
                </div>

                <textarea 
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g. I need to buy a suit for a wedding and then have a nice italian dinner."
                    className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/20 rounded-xl p-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-purple-500 h-32 resize-none mb-4"
                />

                <button 
                    onClick={handleAiPlan}
                    disabled={isGenerating || !aiPrompt.trim()}
                    className="w-full bg-gray-900 dark:bg-white text-white dark:text-black font-bold py-3 rounded-xl shadow-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                    {isGenerating ? 'Generating...' : 'Create Itinerary'}
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default TripPlanner;
