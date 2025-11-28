
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X, Scan, MapPin, Gift, Target, Navigation } from 'lucide-react';
import { Store } from '../types';

interface ARViewProps {
  onClose: () => void;
  onPointsEarned: (points: number, type?: 'gift' | 'offer' | 'checkpoint') => void;
  nearbyStores: Store[];
  onNavigate?: (store: Store) => void;
}

interface ARMarker {
  id: string;
  type: 'store' | 'gift' | 'offer' | 'checkpoint';
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  scale: number;
  data?: Store;
  distance?: number;
  offerText?: string;
}

// Pre-defined non-overlapping slots safe for mobile screens (w-40 cards)
// kept strictly within 15-85% range to ensure visibility
const SAFE_SLOTS = [
  { x: 25, y: 25 }, // Top Left
  { x: 75, y: 25 }, // Top Right
  { x: 25, y: 50 }, // Mid Left
  { x: 75, y: 50 }, // Mid Right
  { x: 50, y: 70 }, // Bottom Center
  { x: 50, y: 15 }, // Top Center
];

const ARView: React.FC<ARViewProps> = ({ onClose, onPointsEarned, nearbyStores, onNavigate }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [markers, setMarkers] = useState<ARMarker[]>([]);
  const [isScanning, setIsScanning] = useState(true);
  const [isSimulated, setIsSimulated] = useState(false);
  
  // Ref to hold latest stores to avoid re-triggering useEffect
  const storesRef = useRef(nearbyStores);
  
  // Focused marker state for the detailed bottom card
  const [activeMarker, setActiveMarker] = useState<ARMarker | null>(null);

  useEffect(() => {
    storesRef.current = nearbyStores;
  }, [nearbyStores]);

  // Initialize Camera
  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setHasPermission(true);
        }
      } catch (err) {
        console.log("Camera access failed or not supported, switching to simulation mode.");
        setHasPermission(true);
        setIsSimulated(true);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Shuffle helper
  const shuffle = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Scanning Logic
  const performScan = useCallback(() => {
    setIsScanning(true);
    setMarkers([]); 
    setActiveMarker(null);

    // Simulation delay
    setTimeout(() => {
        setIsScanning(false);
        
        const newMarkers: ARMarker[] = [];
        // Always shuffle slots so they appear in different places on MANUAL refresh
        const availableSlots = shuffle([...SAFE_SLOTS]);
        let slotIndex = 0;

        const getNextSlot = () => {
            if (slotIndex >= availableSlots.length) return { x: 50, y: 50 };
            return availableSlots[slotIndex++];
        };
        
        // 1. Checkpoint (Priority)
        const cpSlot = getNextSlot();
        newMarkers.push({
            id: `checkpoint-1`,
            type: 'checkpoint',
            x: cpSlot.x, 
            y: cpSlot.y,
            scale: 1.2,
            distance: 5
        });

        // 2. Offers
        const mockStores: Store[] = [
            { id: 'm1', name: 'Nike', color: '#000000', offer: '40% OFF' } as Store,
            { id: 'm2', name: 'Starbucks', color: '#006241', offer: 'Free Coffee' } as Store,
            { id: 'm3', name: 'H&M', color: '#DC2626', offer: 'Buy 2 Get 1' } as Store,
        ];

        const pool = [...storesRef.current, ...mockStores];
        const uniqueStores = pool.filter((v,i,a) => a.findIndex(t => t.name === v.name) === i).slice(0, 2);
        
        uniqueStores.forEach((store, i) => {
            const slot = getNextSlot();
            newMarkers.push({
                id: `offer-${i}`,
                type: 'offer',
                x: slot.x, 
                y: slot.y,
                scale: 1.0,
                data: store,
                offerText: store.offer || "Special Deal",
                distance: 12 + i * 5
            });
        });
        
        // 3. Store Pin
        const pinSlot = getNextSlot();
        newMarkers.push({
            id: `store-pin-1`,
            type: 'store',
            x: pinSlot.x,
            y: pinSlot.y,
            scale: 0.8,
            data: { name: 'Apple Store', color: '#111' } as Store,
            distance: 45
        });

        setMarkers(newMarkers);
    }, 1500); 
  }, []); // Empty dependency array ensures this function doesn't change

  // Initial Scan Only - Empty Dependency Array [] ensures it runs ONLY ONCE on mount
  useEffect(() => {
    performScan();
    // ESLint disable line needed because we intentionally want this to run only once, 
    // regardless of prop changes, to prevent auto-refreshing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const handleMarkerClick = (marker: ARMarker) => {
    setActiveMarker(marker);
  };

  const handleClaim = (marker: ARMarker) => {
    if (marker.type === 'checkpoint') {
      onPointsEarned(50, 'checkpoint');
    } else if (marker.type === 'offer') {
      onPointsEarned(100, 'offer');
    } else if (marker.type === 'gift') {
      onPointsEarned(30, 'gift');
    }
    setMarkers(prev => prev.filter(m => m.id !== marker.id));
    setActiveMarker(null);
  };

  const handleNavigateClick = () => {
    if (activeMarker?.data && onNavigate) {
        onClose();
        onNavigate(activeMarker.data);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black flex flex-col font-sans overflow-hidden">
      {/* 1. Camera Feed / Background */}
      <div className="relative flex-1 overflow-hidden bg-gray-900">
        {hasPermission === true ? (
          <>
            {!isSimulated && (
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="absolute inset-0 w-full h-full object-cover opacity-80"
              />
            )}
            {isSimulated && (
               <div className="absolute inset-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1519567241046-7f570eee3c9e?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-60"></div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
             {/* Minimal Loader */}
          </div>
        )}

        {/* 2. Futuristic HUD Overlay */}
        <div className="absolute inset-0 pointer-events-none">
           {/* Vignette */}
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]"></div>
           
           {/* Subtle Grid */}
           <div className="absolute inset-0 opacity-20" 
                style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
           </div>

           {/* Scanning Effects - ONLY visible when isScanning is true */}
           {isScanning && (
              <>
                {/* Center Radar */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-[60vw] h-[60vw] rounded-full border border-blue-500/20 relative flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,transparent_270deg,rgba(6,182,212,0.2)_360deg)] animate-[spin_2s_linear_infinite]"></div>
                        <div className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_cyan]"></div>
                    </div>
                    {/* Ripple Rings */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border border-cyan-500/30 rounded-full animate-[ripple_2s_infinite_ease-out]"></div>
                </div>

                {/* Full Screen Scanline */}
                <div className="absolute left-0 right-0 h-1 bg-cyan-400/50 shadow-[0_0_20px_cyan] animate-[scanline_2s_linear_infinite]"></div>
              </>
           )}
        </div>

        {/* 3. AR Markers */}
        {!isScanning && markers.map(marker => (
          <button
            key={marker.id}
            onClick={() => handleMarkerClick(marker)}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-40 outline-none"
            style={{ 
              left: `${marker.x}%`, 
              top: `${marker.y}%`,
              // No auto-movement animations
              transition: 'transform 0.2s ease-out'
            }}
          >
            {/* OFFER MARKER - Compact Glass Card */}
            {marker.type === 'offer' && (
               <div className="flex flex-col items-center hover:scale-105 transition-all duration-300 cursor-pointer">
                  {/* Distance Tag */}
                  <div className="mb-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/10 backdrop-blur-md shadow-lg">
                     {marker.distance}m
                  </div>

                  {/* Glass Card - Fixed Width w-40 to prevent overflow */}
                  <div className="relative w-40 bg-gray-900/60 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                     {/* Neon Accent */}
                     <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-pink-500 to-purple-600"></div>
                     
                     <div className="p-2 pl-3">
                        <div className="flex items-center justify-between mb-1">
                           <span className="text-[9px] font-bold text-white/60 uppercase tracking-wider truncate max-w-[80px]">{marker.data?.name}</span>
                           <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_5px_lime] shrink-0 ml-1"></div>
                        </div>
                        <div className="text-white font-bold text-sm leading-tight mb-1 truncate">{marker.offerText}</div>
                        <div className="text-[8px] text-white/50">Tap to view</div>
                     </div>
                  </div>

                  {/* Anchor Line */}
                  <div className="w-px h-8 bg-gradient-to-b from-white/50 to-transparent"></div>
                  <div className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_white]"></div>
               </div>
            )}

            {/* CHECKPOINT MARKER - Holographic Object */}
            {marker.type === 'checkpoint' && (
                <div className="relative hover:scale-110 transition-transform duration-300 group">
                    <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full animate-pulse"></div>
                    <div className="relative flex flex-col items-center">
                       {/* Rotating Cube Effect */}
                       <div className="w-14 h-14 border-2 border-cyan-400 relative flex items-center justify-center animate-[spin_10s_linear_infinite] shadow-[0_0_15px_cyan] bg-black/20 backdrop-blur-sm rounded-lg">
                          <div className="w-8 h-8 border border-cyan-200 rotate-45"></div>
                          <Gift className="absolute text-white drop-shadow-md" size={18} />
                       </div>
                       <div className="mt-2 text-cyan-300 text-[9px] font-bold tracking-[0.2em] uppercase bg-black/60 px-2 py-1 rounded backdrop-blur-sm border border-cyan-500/30">Reward</div>
                    </div>
                </div>
            )}

            {/* STORE PIN - Minimalist Vertical Tag */}
            {marker.type === 'store' && (
                <div className="flex flex-col items-center hover:-translate-y-2 transition-transform duration-300">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-lg shadow-xl flex items-center gap-2 mb-1">
                        <MapPin size={12} className="text-white" />
                        <span className="text-white font-bold text-xs whitespace-nowrap">{marker.data?.name}</span>
                    </div>
                    {/* Triangle pointer */}
                    <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-white/20"></div>
                    <div className="w-px h-10 bg-gradient-to-b from-white/20 to-transparent"></div>
                    <div className="w-8 h-8 border border-white/10 rounded-full flex items-center justify-center -mt-4 bg-white/5 backdrop-blur-sm">
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                    </div>
                </div>
            )}
          </button>
        ))}
      </div>

      {/* 4. Bottom Active Card (Glassmorphism) */}
      {activeMarker && (
         <div className="absolute bottom-24 left-4 right-4 z-50 animate-slide-up">
            <div className="bg-black/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden ring-1 ring-white/10">
               <div className="p-5 relative">
                  {/* Content */}
                  <div className="flex justify-between items-start">
                     <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                           <div className={`w-2 h-2 rounded-full ${activeMarker.type === 'offer' ? 'bg-pink-500 shadow-[0_0_8px_deeppink]' : 'bg-cyan-500 shadow-[0_0_8px_cyan]'}`}></div>
                           <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{activeMarker.type} found</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white leading-tight mb-1">
                           {activeMarker.data?.name || 'Mystery Item'}
                        </h3>
                        <p className="text-gray-300 text-sm font-medium">{activeMarker.offerText || "Location identified in AR space."}</p>
                     </div>
                     
                     <button onClick={() => setActiveMarker(null)} className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-full text-white hover:bg-white/20 transition">
                        <X size={16} />
                     </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-6">
                     <button 
                       onClick={() => handleClaim(activeMarker)}
                       className="flex-1 bg-white text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition shadow-lg"
                     >
                        {activeMarker.type === 'offer' ? <Gift size={18} /> : <Target size={18} />}
                        <span>{activeMarker.type === 'offer' ? 'Claim Offer' : 'Collect'}</span>
                     </button>

                     {activeMarker.data && (
                        <button 
                           onClick={handleNavigateClick}
                           className="flex-[0.8] bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition backdrop-blur-md"
                        >
                           <Navigation size={18} />
                           <span>Navigate</span>
                        </button>
                     )}
                  </div>
               </div>
            </div>
         </div>
      )}

      {/* 5. Minimal Bottom Control Bar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-1 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full p-1.5 shadow-2xl ring-1 ring-white/5">
           
           <button 
              onClick={performScan} 
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isScanning ? 'bg-white text-black' : 'bg-transparent text-white hover:bg-white/10'}`}
              title="Manual Refresh"
           >
              <Scan size={20} className={isScanning ? 'animate-spin' : ''} />
           </button>

           <div className="w-px h-6 bg-white/10 mx-1"></div>

           <button 
              onClick={onClose} 
              className="w-12 h-12 rounded-full flex items-center justify-center text-white hover:bg-red-500/20 hover:text-red-400 transition-colors"
           >
              <X size={20} />
           </button>
        </div>
      </div>
      
      <style>{`
        @keyframes ripple {
          0% { transform: translate(-50%, -50%) scale(0.8); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
        }
        @keyframes scanline {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default ARView;
