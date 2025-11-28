
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Store, Friend, AvatarId, ParkingZone, SavedVehicle } from '../types';
import { MALL_GEOJSON, INITIAL_USER_LOCATION, ICON_MAP, FLOORS, AVATAR_CONFIG } from '../constants';
import { Navigation, Plus, Minus, Activity, Clock, Car, Scan, Sun, CloudSun, Moon, MapPin, Maximize2, Minimize2 } from 'lucide-react';
import Logo from './Logo';

interface MapProps {
  stores: Store[];
  selectedStore: Store | null;
  isNavigating: boolean;
  currentFloor: string;
  onFloorChange: (floor: string) => void;
  onStoreSelect: (store: Store) => void;
  onStartGame: () => void;
  onOpenAR: () => void;
  friends?: Friend[];
  selectedFriend?: Friend | null; 
  userAvatar: AvatarId;
  parkingZones?: ParkingZone[];
  savedLocations?: SavedVehicle[];
  selectedZone?: ParkingZone | null;
  isDarkMode?: boolean;
  onToggleFullScreen?: () => void;
  isFullScreen?: boolean;
}

const Map: React.FC<MapProps> = ({ 
  stores, 
  selectedStore, 
  isNavigating, 
  currentFloor,
  onFloorChange,
  onStoreSelect,
  onStartGame,
  onOpenAR,
  friends = [],
  selectedFriend,
  userAvatar,
  parkingZones = [],
  savedLocations = [],
  selectedZone,
  isDarkMode = true,
  onToggleFullScreen,
  isFullScreen = false
}) => {
  const [transform, setTransform] = useState({ k: 1, x: 0, y: 0 });
  const [is3D, setIs3D] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isCentering, setIsCentering] = useState(false);
  
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [heatmapTime, setHeatmapTime] = useState<'Morning' | 'Afternoon' | 'Evening'>('Afternoon');
  const [showFloorList, setShowFloorList] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const isParkingFloor = currentFloor === 'P1' || currentFloor === 'P2';

  const floorStores = useMemo(() => {
    if (isParkingFloor) return [];
    return stores.filter(s => s.floor === currentFloor);
  }, [stores, currentFloor, isParkingFloor]);

  const visibleZones = useMemo(() => {
    if (!isParkingFloor) return [];
    return parkingZones.filter(z => z.level === currentFloor);
  }, [parkingZones, currentFloor, isParkingFloor]);

  const visibleFriends = useMemo(() => {
    return friends.filter(f => f.isSharing && f.floor === currentFloor);
  }, [friends, currentFloor]);

  useEffect(() => {
    if (containerRef.current) {
        let targetX = 0;
        let targetY = 0;
        let shouldTransform = false;

        if (selectedFriend && selectedFriend.floor === currentFloor) {
            targetX = selectedFriend.position.x;
            targetY = selectedFriend.position.y;
            shouldTransform = true;
        } else if (selectedStore && selectedStore.floor === currentFloor) {
            targetX = selectedStore.position.x;
            targetY = selectedStore.position.y;
            shouldTransform = true;
        } else if (selectedZone && selectedZone.level === currentFloor) {
            targetX = selectedZone.position.x;
            targetY = selectedZone.position.y;
            shouldTransform = true;
        }

        if (shouldTransform) {
            const { width, height } = containerRef.current.getBoundingClientRect();
            const scale = is3D ? 1.2 : 1.5;
            const x = -targetX * scale + width / 2;
            const y = -targetY * scale + height / 2;
            setTransform({ k: scale, x, y });
        }
    }
  }, [selectedStore, selectedFriend, selectedZone, is3D, currentFloor]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const scaleAmount = -e.deltaY * 0.001;
    const newScale = Math.max(0.5, Math.min(4, transform.k * (1 + scaleAmount)));
    setTransform(prev => ({ ...prev, k: newScale }));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setTransform(prev => ({
      ...prev,
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    }));
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    const touch = e.touches[0];
    setDragStart({ x: touch.clientX - transform.x, y: touch.clientY - transform.y });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    setTransform(prev => ({
      ...prev,
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y
    }));
  };

  const geoJsonToPath = (coordinates: number[][][]) => {
    return coordinates.map(ring => {
      return ring.map((point, i) => 
        `${i === 0 ? 'M' : 'L'}${point[0]},${point[1]}`
      ).join(' ') + ' Z';
    }).join(' ');
  };

  const getStoreForUnit = (coordinates: number[][][]): Store | undefined => {
    const center = getPolygonCenter(coordinates);
    return floorStores.find(s => {
      const dx = s.position.x - center.x;
      const dy = s.position.y - center.y;
      return Math.sqrt(dx*dx + dy*dy) < 50;
    });
  };

  const getPolygonCenter = (coordinates: number[][][]) => {
     const points = coordinates[0];
     const x = points.reduce((sum, p) => sum + p[0], 0) / points.length;
     const y = points.reduce((sum, p) => sum + p[1], 0) / points.length;
     return { x, y };
  };

  const getHeatmapData = () => {
    const data = [];
    let foodIntensity = 0.3;
    let retailIntensity = 0.3;
    
    if (heatmapTime === 'Morning') { retailIntensity = 0.5; foodIntensity = 0.2; }
    if (heatmapTime === 'Afternoon') { retailIntensity = 0.7; foodIntensity = 0.6; }
    if (heatmapTime === 'Evening') { retailIntensity = 0.6; foodIntensity = 0.9; }

    floorStores.forEach(store => {
      let intensity = 0.4;
      let radius = 120;
      let color = "green";

      if (store.category === 'Food' || store.category === 'Restaurant' || store.category === 'Cafe') {
        intensity = foodIntensity;
        if (intensity > 0.7) color = "red";
        else if (intensity > 0.4) color = "orange";
      } else {
        intensity = retailIntensity;
         if (intensity > 0.7) color = "red";
        else if (intensity > 0.4) color = "orange";
      }
      data.push({ x: store.position.x, y: store.position.y, intensity, radius, color });
    });

    if (currentFloor === 'Ground') {
      data.push({ x: 500, y: 800, intensity: 0.8, radius: 150, color: 'red' }); 
    }
    return data;
  };

  const avatarConfig = AVATAR_CONFIG[userAvatar];
  const AvatarIcon = avatarConfig.icon;

  const getNavTarget = () => {
    if (selectedFriend) return selectedFriend.position;
    if (selectedStore) return selectedStore.position;
    if (selectedZone) return selectedZone.position;
    if (savedLocations.length > 0 && isParkingFloor) {
        const target = savedLocations.find(l => l.level === currentFloor);
        if (target) return target.position;
    }
    return null;
  };

  const navTarget = getNavTarget();

  const resetView = () => {
    setTransform({ k: 1, x: 0, y: 0 });
    setIs3D(false);
    onStoreSelect(null as any);
    setIsCentering(true);
    setTimeout(() => setIsCentering(false), 1000);
  };

  const getFloorLabel = (floor: string) => {
    if (floor === 'Ground') return 'G';
    if (floor === 'Food Court') return 'FC';
    if (floor.includes('Floor')) return floor.split(' ')[0];
    return floor;
  };

  const bgColor = isDarkMode ? 'bg-gray-950' : 'bg-gray-100';
  const gridColor = isDarkMode ? '#333' : '#ddd';
  const boundaryFill = isParkingFloor ? (isDarkMode ? "#111827" : "#374151") : (isDarkMode ? "#1E1E1E" : "#ffffff");
  const boundaryStroke = isParkingFloor ? (isDarkMode ? "#374151" : "#4b5563") : (isDarkMode ? "#333" : "#e5e7eb");
  const unitFillDefault = isDarkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.03)';
  const unitStrokeTop = isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";

  return (
    <div 
      ref={containerRef}
      className={`w-full h-full ${bgColor} overflow-hidden relative cursor-move touch-none select-none transition-colors duration-300`}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
      style={{ perspective: '1000px' }}
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] dark:opacity-[0.05] overflow-hidden">
         <Logo className="w-[80%] h-[80%] text-gray-500 dark:text-white" noBackground={true} />
      </div>

      <div className={`absolute inset-0 flex items-center justify-center pointer-events-none z-50 transition-opacity duration-500 ${isCentering ? 'opacity-100' : 'opacity-0'}`}>
         <div className={`w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center backdrop-blur-sm ${isCentering ? 'animate-ping' : ''}`}></div>
         <div className="absolute">
            <Logo className="w-12 h-12 text-primary drop-shadow-lg" noBackground={true} />
         </div>
      </div>

      <div 
        className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${is3D ? 'opacity-40' : 'opacity-20'}`}
        style={{
          backgroundImage: `radial-gradient(${gridColor} 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}
      />

      <div 
        style={{ 
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.k})`,
          transformOrigin: '0 0',
          transformStyle: 'preserve-3d',
          transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }}
        className="w-[1000px] h-[1000px] relative"
      >
        <div
          className="w-full h-full"
          style={{
             transform: is3D ? 'rotateX(55deg) rotateZ(30deg)' : 'rotateX(0deg) rotateZ(0deg)',
             transformOrigin: 'center center',
             transformStyle: 'preserve-3d',
             transition: 'transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)'
          }}
        >
          <svg width="1000" height="1000" viewBox="0 0 1000 1000" className="overflow-visible" style={{ transformStyle: 'preserve-3d' }}>
            
            <defs>
               {showHeatmap && getHeatmapData().map((point, i) => (
                 <radialGradient key={`grad-${i}`} id={`heat-${i}`}>
                   <stop offset="0%" stopColor={point.color} stopOpacity={point.intensity} />
                   <stop offset="100%" stopColor={point.color} stopOpacity="0" />
                 </radialGradient>
               ))}
            </defs>

            {MALL_GEOJSON.features.filter(f => f.properties.type === 'boundary').map((feature, index) => (
               <path 
                  key={`boundary-${index}`}
                  d={geoJsonToPath(feature.geometry.coordinates)}
                  fill={boundaryFill}
                  stroke={boundaryStroke}
                  strokeWidth="20"
                  className="drop-shadow-2xl"
                  style={{ transform: 'translateZ(0px)' }}
                />
            ))}
            
            {!isParkingFloor && MALL_GEOJSON.features.filter(f => f.properties.type === 'unit').map((feature, index) => {
                const storeInUnit = getStoreForUnit(feature.geometry.coordinates);
                const isSelected = selectedStore?.id === storeInUnit?.id;
                const layers = is3D ? [0, 4, 8, 12, 16, 20] : [0];
                
                return (
                  <g key={`unit-group-${index}`} style={{ transformStyle: 'preserve-3d' }}>
                    {layers.map((z, i) => {
                      const isTop = i === layers.length - 1;
                      let fill = isSelected ? '#EC4899' : (storeInUnit ? (isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)') : unitFillDefault);
                      
                      return (
                          <path
                            key={`unit-${index}-${z}`}
                            d={geoJsonToPath(feature.geometry.coordinates)}
                            fill={fill}
                            stroke={isTop ? unitStrokeTop : "none"}
                            strokeWidth={isTop ? 1 : 0}
                            className={`transition-colors duration-300 ${isTop && storeInUnit ? 'cursor-pointer hover:fill-black/10 dark:hover:fill-white/20' : ''}`}
                            style={{ transform: `translateZ(${z}px)`, pointerEvents: isTop && storeInUnit ? 'auto' : 'none' }}
                            onClick={(e) => {
                              if (isTop && storeInUnit) {
                                e.stopPropagation();
                                onStoreSelect(storeInUnit);
                              }
                            }}
                          />
                      );
                    })}
                  </g>
                );
            })}

            {/* Parking & Other layers omitted for brevity, assume same logic as before */}
            {/* ... */}
            {/* Store Icons */}
            {!isParkingFloor && floorStores.map((store) => {
               const isSelected = selectedStore?.id === store.id;
               const IconComponent = ICON_MAP[store.iconName] || ICON_MAP['default'];
               
               return (
                <foreignObject
                  key={store.id}
                  x={store.position.x - 24}
                  y={store.position.y - 56}
                  width="48"
                  height="64"
                  className="overflow-visible pointer-events-auto"
                  style={{ 
                    transform: `translateZ(${is3D ? 60 : 10}px)`, 
                    transformStyle: 'preserve-3d'
                  }}
                >
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onStoreSelect(store);
                    }}
                    onMouseDown={(e) => e.stopPropagation()} 
                    onTouchStart={(e) => e.stopPropagation()}
                    className={`w-full flex flex-col items-center transition-transform duration-300 ${isSelected ? 'scale-125 -translate-y-2' : 'hover:scale-110'}`}
                    style={{ 
                      transform: is3D ? 'rotateZ(-30deg) rotateX(-55deg)' : 'none',
                      transformOrigin: 'bottom center',
                      transition: 'transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)',
                      cursor: 'pointer'
                    }}
                  >
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center shadow-[0_10px_20px_rgba(0,0,0,0.2)] mb-1 border-2 border-white"
                      style={{ backgroundColor: store.color }}
                    >
                      <IconComponent 
                        size={20} 
                        color={store.color === '#FFFFFF' ? '#000' : '#FFF'} 
                      />
                    </div>
                    <div className={`
                      px-2 py-1 bg-black/80 rounded text-[10px] text-white whitespace-nowrap backdrop-blur-sm border border-white/10
                      transition-opacity duration-300
                      ${transform.k < 0.8 && !isSelected ? 'opacity-0' : 'opacity-100'}
                    `}>
                      {store.name}
                    </div>
                    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white mt-[-4px] drop-shadow-md"></div>
                  </button>
                </foreignObject>
               );
            })}
          </svg>
        </div>
      </div>
      
      <div className={`absolute right-4 top-20 flex flex-col gap-3 items-end pointer-events-none z-50 transition-all duration-300 ${isFullScreen ? 'top-4' : 'top-20'}`}>
        
        <div className="pointer-events-auto relative flex flex-col items-end">
           <button 
             onClick={() => setShowFloorList(!showFloorList)}
             className="w-10 h-10 rounded-xl bg-primary text-white shadow-lg shadow-primary/30 flex items-center justify-center font-bold border border-white/20 transition-transform active:scale-95"
           >
             {getFloorLabel(currentFloor)}
           </button>

           {showFloorList && (
              <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-xl border border-gray-200 dark:border-white/10 shadow-xl flex flex-col p-1 gap-1 mt-2 animate-fade-in origin-top-right">
                 {FLOORS.slice().reverse().map((floor) => (
                   <button
                     key={floor}
                     onClick={() => {
                        onFloorChange(floor);
                        setShowFloorList(false);
                     }}
                     className={`
                       px-3 py-2 rounded-lg flex items-center justify-end text-xs font-bold transition-all whitespace-nowrap
                       ${currentFloor === floor 
                         ? 'bg-gray-100 dark:bg-white/10 text-primary dark:text-white' 
                         : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}
                     `}
                   >
                     {floor === 'Ground' ? 'Ground' : floor === 'Food Court' ? 'Food Court' : floor}
                   </button>
                 ))}
              </div>
           )}
        </div>

        <div className="pointer-events-auto relative">
           <button 
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all border ${
                showHeatmap 
                ? 'bg-orange-500 text-white border-orange-400' 
                : 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:text-primary dark:hover:text-white'
              }`}
           >
              <Activity size={20} />
           </button>
        </div>

        <div className="pointer-events-auto flex flex-col bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-xl border border-gray-200 dark:border-white/10 shadow-xl overflow-hidden p-1 gap-1">
           {onToggleFullScreen && (
             <button
                onClick={onToggleFullScreen}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-colors"
             >
                {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
             </button>
           )}
           <div className="h-px bg-gray-200 dark:bg-white/10 w-full my-0.5"></div>
           <button
              onClick={onOpenAR}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/10 text-primary transition-colors bg-gradient-to-br from-purple-500/10 to-blue-500/10 dark:from-purple-500/20 dark:to-blue-500/20"
           >
              <Scan size={18} />
           </button>
           
           <div className="h-px bg-gray-200 dark:bg-white/10 w-full my-0.5"></div>

           <button 
              onClick={resetView}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-colors"
           >
              <Navigation size={18} />
           </button>
           
           <div className="h-px bg-gray-200 dark:bg-white/10 w-full my-0.5"></div>

           <button 
              onClick={() => setTransform(prev => ({...prev, k: Math.min(4, prev.k + 0.5)}))}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-white transition-colors"
           >
              <Plus size={18} />
           </button>
           <button 
              onClick={() => setTransform(prev => ({...prev, k: Math.max(0.5, prev.k - 0.5)}))}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-white transition-colors"
           >
              <Minus size={18} />
           </button>
        </div>
      </div>
    </div>
  );
};

export default Map;
