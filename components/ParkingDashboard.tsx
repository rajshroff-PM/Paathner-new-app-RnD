
import React, { useState, useEffect, useRef } from 'react';
import { ParkingZone, SavedVehicle } from '../types';
import { Car, Bike, MapPin, Camera, Zap, Clock, ChevronRight, Navigation, ArrowLeft, Edit2, Trash2, X } from 'lucide-react';
import { MALL_GEOJSON } from '../constants';

interface ParkingDashboardProps {
  zones: ParkingZone[];
  savedLocations: SavedVehicle[];
  onSaveLocation: (location: Partial<SavedVehicle>) => void;
  onDeleteLocation: (timestamp: number) => void;
  onNavigateToZone: (zone: ParkingZone) => void;
  onFindCar: (location: SavedVehicle) => void;
  onBack: () => void;
}

// Simple Helper to draw map path
const geoJsonToPath = (coordinates: number[][][]) => {
    return coordinates.map(ring => {
      return ring.map((point, i) => 
        `${i === 0 ? 'M' : 'L'}${point[0]},${point[1]}`
      ).join(' ') + ' Z';
    }).join(' ');
};

const ParkingDashboard: React.FC<ParkingDashboardProps> = ({
  zones,
  savedLocations,
  onSaveLocation,
  onDeleteLocation,
  onNavigateToZone,
  onFindCar,
  onBack
}) => {
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isMapPinModalOpen, setIsMapPinModalOpen] = useState(false);
  
  // Form States
  const [slotInput, setSlotInput] = useState('');
  const [levelInput, setLevelInput] = useState('P1');
  const [pinNameInput, setPinNameInput] = useState('');
  
  // Simulate live updates locally for visual effect
  const [displayZones, setDisplayZones] = useState(zones);

  // Swipe to back logic
  const touchStart = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const diff = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(diff) > 50 && !isSaveModalOpen && !isMapPinModalOpen) onBack(); 
    touchStart.current = null;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayZones(prev => prev.map(zone => {
        // Randomly fluctuate occupancy slightly
        const fluctuation = Math.floor(Math.random() * 3) - 1; // -1, 0, or +1
        const newOccupied = Math.max(0, Math.min(zone.capacity, zone.occupied + fluctuation));
        return { ...zone, occupied: newOccupied };
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleManualSave = () => {
    onSaveLocation({
      slotNumber: slotInput || 'Parked Car',
      level: levelInput,
      zoneId: 'Manual Entry',
      timestamp: Date.now()
    });
    setIsSaveModalOpen(false);
    setSlotInput('');
  };

  const handleDropPinClick = () => {
    setPinNameInput('Custom Pin');
    setIsMapPinModalOpen(true);
  };

  const handleConfirmPin = () => {
    // Simulate dropping at a "current location" derived from the map interaction
    onSaveLocation({
      slotNumber: pinNameInput || 'Custom Pin',
      level: 'Ground', 
      zoneId: 'Custom POI',
      timestamp: Date.now(),
      position: { x: 400, y: 650 } // Mock location
    });
    setIsMapPinModalOpen(false);
  };

  const getAvailabilityColor = (capacity: number, occupied: number) => {
    const percentage = occupied / capacity;
    if (percentage > 0.9) return 'bg-red-500';
    if (percentage > 0.6) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div 
      className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden transition-colors duration-300"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Header */}
      <div className="flex items-center gap-4 p-4 pt-safe-area border-b border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 sticky top-0 z-10 transition-colors">
         <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-900 dark:text-white transition">
            <ArrowLeft size={24} />
         </button>
         <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            Smart Parking
         </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-32">
        
        {/* Saved Vehicle Cards (Minimal) */}
        {savedLocations.length > 0 && (
          <div className="space-y-4 mb-8">
             {savedLocations.map((location) => {
                 // Determine icon based on type (simple heuristic)
                 const zone = zones.find(z => z.id === location.zoneId);
                 const BackdropIcon = (zone?.type === '2-Wheeler') ? Bike : (location.zoneId === 'Custom POI' ? MapPin : Car);

                 return (
                  <div key={location.timestamp} className="relative w-full bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-lg border border-gray-200 dark:border-white/10 overflow-hidden group">
                     {/* Backdrop Icon - Bottom Aligned */}
                     <BackdropIcon className="absolute -bottom-4 -right-4 w-32 h-32 text-gray-100 dark:text-white/5 pointer-events-none transition-transform group-hover:scale-110" />
                     
                     <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                           <div>
                              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                                 <MapPin size={12} className="text-primary" /> 
                                 {location.level} • {location.zoneId}
                              </div>
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                                 {location.slotNumber}
                                 <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-primary transition-colors">
                                    <Edit2 size={12} />
                                 </button>
                              </h3>
                              <div className="text-[10px] text-gray-400 font-mono mt-1 flex items-center gap-1">
                                 <Clock size={10} />
                                 Marked {Math.floor((Date.now() - location.timestamp) / 60000)}m ago
                              </div>
                           </div>
                        </div>

                        <div className="flex gap-3">
                           <button 
                             onClick={() => onFindCar(location)} 
                             className="flex-1 py-2.5 bg-white/20 backdrop-blur-md hover:bg-white/30 text-gray-900 dark:text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all border border-gray-200 dark:border-white/10" 
                           >
                              <Navigation size={16} /> Navigate
                           </button>
                           <button 
                             onClick={() => onDeleteLocation(location.timestamp)} 
                             className="flex-1 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 backdrop-blur-md rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all border border-red-500/10" 
                           >
                              <Trash2 size={16} /> Delete
                           </button>
                        </div>
                     </div>
                  </div>
                 );
             })}
          </div>
        )}

        {/* Action Buttons (Always Visible) */}
        <div className="space-y-4 mb-6">
           {savedLocations.length === 0 && (
             <div className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Drop your custom parking location
             </div>
           )}
           
           <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={handleDropPinClick}
                className="bg-white dark:bg-gray-800/60 border border-primary/30 p-4 rounded-2xl flex flex-col items-center gap-3 hover:bg-primary/10 transition-all group shadow-sm active:scale-95"
              >
                 <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <MapPin size={28} />
                 </div>
                 <div className="text-center">
                    <div className="font-bold text-gray-900 dark:text-white text-sm mb-0.5">Drop Pin Here</div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400">Use current location</div>
                 </div>
              </button>

              <button 
                onClick={() => setIsSaveModalOpen(true)}
                className="bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-white/10 p-4 rounded-2xl flex flex-col items-center gap-3 hover:bg-gray-100 dark:hover:bg-white/5 transition-all group shadow-sm active:scale-95"
              >
                 <div className="w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                    <Edit2 size={28} />
                 </div>
                 <div className="text-center">
                    <div className="font-bold text-gray-900 dark:text-white text-sm mb-0.5">Manual Entry</div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400">Select floor & slot</div>
                 </div>
              </button>
           </div>
        </div>

        {/* Live Capacity List */}
        <div>
           <h3 className="text-gray-900 dark:text-white font-bold mb-4 flex items-center gap-2">
             <Zap className="text-yellow-500 dark:text-yellow-400" size={18} /> Live Availability
           </h3>
           
           <div className="grid gap-4">
             {displayZones.map((zone) => {
               const availability = zone.capacity - zone.occupied;
               const percentage = (zone.occupied / zone.capacity) * 100;
               const barColor = getAvailabilityColor(zone.capacity, zone.occupied);
               
               return (
                 <div key={zone.id} className="bg-white dark:bg-gray-800/40 border border-gray-200 dark:border-white/5 rounded-xl p-4 shadow-sm dark:shadow-none">
                    <div className="flex justify-between items-start mb-3">
                       <div>
                          <div className="flex items-center gap-2">
                             <h4 className="text-gray-900 dark:text-white font-bold">{zone.name}</h4>
                             <span className="text-[10px] bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded text-gray-500 dark:text-gray-300">{zone.level}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">{zone.type}</div>
                       </div>
                       <div className="text-right">
                          <div className={`font-mono font-bold text-lg ${availability < 5 ? 'text-red-500' : 'text-green-600 dark:text-green-400'}`}>
                             {availability}
                          </div>
                          <div className="text-[10px] text-gray-500 uppercase">Slots Free</div>
                       </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
                       <div 
                         className={`h-full ${barColor} transition-all duration-1000 ease-out`} 
                         style={{ width: `${percentage}%` }}
                       ></div>
                    </div>

                    <button 
                      onClick={() => onNavigateToZone(zone)}
                      className="w-full py-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
                    >
                       <Navigation size={14} /> Navigate to Zone
                    </button>
                 </div>
               );
             })}
           </div>
        </div>
      </div>

      {/* Map Pin Confirmation Modal */}
      {isMapPinModalOpen && (
        <div className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
           <div className="bg-white dark:bg-gray-900 w-full max-w-md h-[550px] rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">
              <div className="p-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-white dark:bg-gray-900 z-10">
                 <h3 className="text-lg font-bold text-gray-900 dark:text-white">Confirm Location</h3>
                 <button onClick={() => setIsMapPinModalOpen(false)} className="text-gray-500 hover:text-gray-900 dark:hover:text-white">Close</button>
              </div>
              
              <div className="flex-1 bg-gray-100 dark:bg-gray-800 relative overflow-hidden group cursor-move">
                 {/* Simulated Map View */}
                 <div className="absolute inset-0 flex items-center justify-center opacity-50">
                    <svg viewBox="0 0 1000 1000" className="w-full h-full text-gray-300 dark:text-gray-700 fill-current">
                        {MALL_GEOJSON.features.filter(f => f.properties.type === 'boundary').map((f, i) => (
                            <path key={i} d={geoJsonToPath(f.geometry.coordinates)} />
                        ))}
                    </svg>
                 </div>
                 
                 {/* Center Pin */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
                    <MapPin size={48} className="text-primary fill-primary animate-bounce drop-shadow-xl" />
                    <div className="w-3 h-1.5 bg-black/20 rounded-full blur-sm mt-[-4px]"></div>
                 </div>
                 
                 <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
                    <span className="bg-black/60 text-white text-xs px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                       Drag map to adjust
                    </span>
                 </div>
              </div>

              <div className="p-4 border-t border-gray-100 dark:border-white/5 bg-white dark:bg-gray-900 flex flex-col gap-3">
                 <div>
                    <label className="text-xs text-gray-500 uppercase block mb-1">Pin Name</label>
                    <input 
                      type="text" 
                      value={pinNameInput}
                      onChange={(e) => setPinNameInput(e.target.value)}
                      placeholder="e.g. Meeting Point, Car"
                      className="w-full bg-gray-100 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:border-primary outline-none"
                    />
                 </div>
                 <button 
                   onClick={handleConfirmPin}
                   className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3.5 rounded-xl shadow-lg transition-transform active:scale-95"
                 >
                    Confirm Location
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Save Location Modal (Manual Entry) */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-[70] bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-3xl border border-gray-200 dark:border-white/10 p-6 shadow-2xl">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Where did you park?</h3>
              
              <div className="space-y-4 mb-6">
                 <div>
                    <label className="text-xs text-gray-500 uppercase block mb-2">Level</label>
                    <div className="flex gap-2">
                       {['P1', 'P2'].map(lvl => (
                          <button 
                            key={lvl}
                            onClick={() => setLevelInput(lvl)}
                            className={`flex-1 py-2 rounded-lg border transition-colors ${levelInput === lvl ? 'bg-primary border-primary text-white' : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400'}`}
                          >
                             {lvl}
                          </button>
                       ))}
                    </div>
                 </div>
                 
                 <div>
                    <label className="text-xs text-gray-500 uppercase block mb-2">Slot Number / Name</label>
                    <input 
                      type="text" 
                      value={slotInput}
                      onChange={(e) => setSlotInput(e.target.value)}
                      placeholder="e.g. A-45"
                      className="w-full bg-gray-100 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:border-primary outline-none"
                    />
                 </div>

                 <div>
                     <button className="w-full py-3 border border-dashed border-gray-300 dark:border-white/20 rounded-xl text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-colors">
                        <Camera size={18} /> Add Photo (Optional)
                     </button>
                 </div>
              </div>

              <div className="flex gap-3">
                 <button 
                   onClick={() => setIsSaveModalOpen(false)}
                   className="flex-1 py-3 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                 >
                    Cancel
                 </button>
                 <button 
                   onClick={handleManualSave}
                   disabled={!slotInput}
                   className="flex-1 bg-primary disabled:opacity-50 text-white rounded-xl font-bold shadow-lg"
                 >
                    Save Spot
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ParkingDashboard;
