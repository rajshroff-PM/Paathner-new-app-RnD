
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Map from './components/Map';
import StoreList from './components/StoreList';
import StoreProfile from './components/StoreProfile';
import ChatAssistant from './components/ChatAssistant';
import LoginScreen from './components/LoginScreen';
import EventsView from './components/EventsView';
import BlogView from './components/BlogView';
import NavigationGame from './components/NavigationGame';
import EventPopup from './components/EventPopup';
import RewardsView from './components/RewardsView';
import SearchOverlay from './components/SearchOverlay';
import RestaurantOrdering from './components/RestaurantOrdering';
import LaunchScreen from './components/LaunchScreen';
import TripPlanner from './components/TripPlanner';
import LocationSharing from './components/LocationSharing';
import AvatarSelector from './components/AvatarSelector';
import ParkingDashboard from './components/ParkingDashboard'; 
import LostAndFound from './components/LostAndFound'; 
import SideMenu from './components/SideMenu';
import UserProfile from './components/UserProfile';
import LocationSelector from './components/LocationSelector';
import ARView from './components/ARView';
import HotOffersView from './components/HotOffersView';
import FoodTakeaway from './components/FoodTakeaway';
import AmenitiesView from './components/AmenitiesView';
import Logo from './components/Logo';
import SplashScreen from './components/SplashScreen';

import { MALL_STORES, MALL_EVENTS, INITIAL_FRIENDS, PARKING_ZONES, VENUES } from './constants';
import { Store, Friend, AvatarId, SavedVehicle, ParkingZone, Venue } from './types';
import { Search, Mic, MapPin, Menu, Bell, Footprints, Gamepad2, Route, X, Flame, ChevronDown, ChevronUp, Utensils } from 'lucide-react';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('map');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [viewingStoreProfile, setViewingStoreProfile] = useState<Store | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  
  // Location & Venue State
  const [currentVenue, setCurrentVenue] = useState<Venue>(VENUES[0]); // Default: Amanora
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [currentFloor, setCurrentFloor] = useState("Ground");
  
  // Sheet State (Store Shutter)
  const [isStoreSheetOpen, setIsStoreSheetOpen] = useState(false);

  // Full Screen Map State
  const [isMapFullScreen, setIsMapFullScreen] = useState(false);

  // New States
  const [userPoints, setUserPoints] = useState(200);
  const [showGame, setShowGame] = useState(false);
  const [showEventPopup, setShowEventPopup] = useState(false);
  const [showAR, setShowAR] = useState(false);
  const [trip, setTrip] = useState<Store[]>([]);
  const [steps, setSteps] = useState(1240); 

  const [isSharingLocation, setIsSharingLocation] = useState(false);
  const [friends, setFriends] = useState<Friend[]>(INITIAL_FRIENDS);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [userAvatar, setUserAvatar] = useState<AvatarId>('glider');
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
  const [orderingStore, setOrderingStore] = useState<Store | null>(null);

  const [savedLocations, setSavedLocations] = useState<SavedVehicle[]>([]);
  const [selectedParkingZone, setSelectedParkingZone] = useState<ParkingZone | null>(null);
  const [showLaunchScreen, setShowLaunchScreen] = useState(false);
  const [notification, setNotification] = useState<{title: string, message: string} | null>(null);

  const userInfo = {
    name: 'Raj Shroff',
    image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (isLoggedIn && MALL_EVENTS.length > 0) {
      setShowLaunchScreen(true);
    }
  }, [isLoggedIn]);

  // Step Counter Simulation
  useEffect(() => {
    if (!isLoggedIn) return;
    const interval = setInterval(() => {
      if (Math.random() < 0.3) setSteps(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, [isLoggedIn]);

  const distance = (steps * 0.000762).toFixed(2);
  const calories = Math.floor(steps * 0.04);

  const toggleDarkMode = useCallback(() => setIsDarkMode(prev => !prev), []);
  const handleCloseProfile = useCallback(() => setShowProfile(false), []);
  const handleLogout = useCallback(() => setIsLoggedIn(false), []);

  const startListening = () => {
    if (isListening) return;
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';
      setIsListening(true);
      recognition.onresult = (event: any) => {
        if (event.results && event.results.length > 0) {
            setSearchQuery(event.results[0][0].transcript);
            setIsSearchOverlayOpen(true);
        }
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      try { recognition.start(); } catch (err) { setIsListening(false); }
    } else {
      alert("Speech recognition is not supported in this browser.");
    }
  };

  const filteredStores = useMemo(() => {
    let result = MALL_STORES;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(s => 
        s.name.toLowerCase().includes(query) || 
        s.category.toLowerCase().includes(query) ||
        s.floor.toLowerCase().includes(query)
      );
    }
    return result;
  }, [searchQuery]);

  const handleStoreSelect = (store: Store | null) => {
    if (!store) {
      setSelectedStore(null);
      setIsNavigating(false);
      return;
    }
    setViewingStoreProfile(store);
    if (store.floor !== currentFloor) setCurrentFloor(store.floor);
    setSelectedStore(store);
    setSelectedFriend(null); 
    setIsSearchOverlayOpen(false);
  };

  const handleStartNavigation = (store: Store) => {
    setViewingStoreProfile(null);
    setSelectedStore(store);
    setSelectedFriend(null);
    if (store.floor !== currentFloor) setCurrentFloor(store.floor);
    setIsNavigating(true);
    setActiveTab('map');
    setIsStoreSheetOpen(false); 
    setIsSearchOverlayOpen(false);
  };

  const handleLocateFriend = (friend: Friend) => {
    setCurrentFloor(friend.floor);
    setSelectedFriend(friend);
    setSelectedStore(null);
    setIsNavigating(false);
  };

  const handleNavigateToFriend = (friend: Friend) => {
    setCurrentFloor(friend.floor);
    setSelectedFriend(friend);
    setSelectedStore(null);
    setIsNavigating(true);
    setActiveTab('map');
  };

  const handleAddToTrip = (store: Store) => {
    if (!trip.find(s => s.id === store.id)) {
      setTrip(prev => [...prev, store]);
      setNotification({ title: "Trip Updated", message: `${store.name} added.` });
      setTimeout(() => setNotification(null), 3000);
    }
  };
  
  const handleBatchAddToTrip = (stores: Store[]) => {
      const newStores = stores.filter(s => !trip.find(t => t.id === s.id));
      if (newStores.length > 0) {
        setTrip(prev => [...prev, ...newStores]);
        setNotification({ title: "Itinerary Created", message: `${newStores.length} stops added.` });
        setTimeout(() => setNotification(null), 3000);
      }
  };

  const handleReorderTrip = (newTrip: Store[]) => setTrip(newTrip);

  const handleFindNearest = (type: 'entry' | 'exit') => {
    const targets = MALL_STORES.filter(s => s.category === "Entry/Exit");
    const specificTargets = targets.filter(t => type === 'entry' ? t.iconName === 'entry' : t.iconName === 'exit');
    const nearest = specificTargets.find(t => t.floor === currentFloor) || specificTargets[0];
    if (nearest) {
        setNotification({
            title: `Nearest ${type === 'entry' ? 'Entrance' : 'Exit'} Found`,
            message: `Navigating to ${nearest.name}`
        });
        handleStartNavigation(nearest);
    }
  };

  const handleSaveParking = (location: Partial<SavedVehicle>) => {
    let position = location.position;
    if (!position && location.zoneId) {
      const zone = PARKING_ZONES.find(z => z.id === location.zoneId) || PARKING_ZONES[0];
      position = zone.position;
    }
    if (!position) position = PARKING_ZONES[0].position;

    const newLocation = { 
        ...location, 
        position,
        timestamp: location.timestamp || Date.now() 
    } as SavedVehicle;

    setSavedLocations(prev => [...prev, newLocation]);
    setNotification({ title: "Location Saved", message: `${newLocation.slotNumber}` });
  };

  const handleDeleteLocation = (timestamp: number) => {
    setSavedLocations(prev => prev.filter(l => l.timestamp !== timestamp));
    setNotification({ title: "Location Removed", message: "Pin deleted successfully" });
  };

  const handleNavigateToZone = (zone: ParkingZone) => {
    setCurrentFloor(zone.level);
    setSelectedParkingZone(zone);
    setIsNavigating(true);
    setActiveTab('map');
  };

  const handleFindCar = (location: SavedVehicle) => {
      setCurrentFloor(location.level);
      setIsNavigating(true);
      setActiveTab('map');
      setSelectedStore(null);
  };

  const handleVenueSelect = (venue: Venue) => {
     setCurrentVenue(venue);
     setCurrentFloor("Ground");
     setNotification({ title: "Location Changed", message: `Welcome to ${venue.name}` });
  };

  const handlePointsEarned = (points: number, type: 'gift' | 'offer' | 'checkpoint' = 'gift') => {
    setUserPoints(prev => prev + points);
    setNotification({ title: "Reward Earned", message: `+${points} points added to your balance` });
    setTimeout(() => setNotification(null), 4000);
  };

  // Handle Takeaway Navigation
  const handleTakeawayOpen = (store?: Store) => {
      if(store) {
          setOrderingStore(store);
          setViewingStoreProfile(null);
      } else {
          setActiveTab('takeaway');
      }
  }

  if (showSplash) return <SplashScreen onComplete={() => setShowSplash(false)} />;

  if (!isLoggedIn) return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;

  // Full screen ordering view (Takeaway)
  if (orderingStore) return <RestaurantOrdering store={orderingStore} onBack={() => setOrderingStore(null)} />;

  return (
    <div className="w-full h-[100dvh] overflow-hidden bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white relative flex flex-col transition-colors duration-300">
      
      {notification && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[150] w-[90%] max-w-md bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200 dark:border-primary/50 rounded-2xl p-3 shadow-2xl animate-fade-in flex gap-3 items-center pointer-events-auto">
           <div className="bg-primary/20 p-2 rounded-full shrink-0 text-primary"><Bell size={16} /></div>
           <div className="flex-1">
              <h4 className="font-bold text-gray-900 dark:text-white text-xs">{notification.title}</h4>
              <p className="text-gray-600 dark:text-gray-300 text-[10px]">{notification.message}</p>
           </div>
           <button onClick={() => setNotification(null)} className="p-1.5 rounded-full transition-colors shrink-0"><X size={14} /></button>
        </div>
      )}

      <SideMenu 
        isOpen={isSideMenuOpen} 
        onClose={() => setIsSideMenuOpen(false)} 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        onOpenProfile={() => setShowProfile(true)}
      />

      {showProfile && (
        <UserProfile onClose={handleCloseProfile} userPoints={userPoints} isDarkMode={isDarkMode} onToggleTheme={toggleDarkMode} onLogout={handleLogout} />
      )}

      {showLocationSelector && (
         <LocationSelector currentVenue={currentVenue} onSelectVenue={handleVenueSelect} onClose={() => setShowLocationSelector(false)} />
      )}

      {showLaunchScreen && (
        <LaunchScreen 
          onClose={() => setShowLaunchScreen(false)} 
          onExplore={() => { 
            setShowLaunchScreen(false); 
            setActiveTab('events'); 
          }} 
        />
      )}

      {showAvatarSelector && (
        <AvatarSelector selectedAvatar={userAvatar} onSelect={(id) => { setUserAvatar(id); setShowAvatarSelector(false); }} onClose={() => setShowAvatarSelector(false)} />
      )}

      {showAR && (
        <ARView onClose={() => setShowAR(false)} onPointsEarned={handlePointsEarned} nearbyStores={filteredStores.slice(0, 5)} onNavigate={handleStartNavigation} />
      )}

      <SearchOverlay 
        isOpen={isSearchOverlayOpen}
        onClose={() => setIsSearchOverlayOpen(false)}
        onStoreSelect={handleStoreSelect}
        onAddToTrip={handleAddToTrip}
        initialQuery={searchQuery}
        onQueryChange={setSearchQuery}
        startListening={startListening}
        isListening={isListening}
        onNavigate={handleStartNavigation}
      />

      {/* --- HEADER (Collapsible) - Hide if Full Screen Map --- */}
      {activeTab === 'map' && !isMapFullScreen && (
        <div className="flex-shrink-0 bg-white/80 dark:bg-gray-900/95 backdrop-blur-md z-50 relative pt-safe-area transition-all duration-500 ease-in-out border-b border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none">
           <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                     <div className="relative w-10 h-10 flex items-center justify-center">
                        <div className="absolute inset-0 bg-primary/20 blur-md rounded-full z-0"></div>
                        <Logo className="w-10 h-10 text-primary relative z-10 animate-glow" noBackground={true} />
                     </div>
                     <button onClick={() => setShowLocationSelector(true)} className="flex flex-col items-start group text-left ml-1">
                        <div className="flex items-center gap-1 text-gray-900 dark:text-white font-black text-base leading-tight group-active:scale-95 transition-transform">
                            {currentVenue.name} <ChevronDown size={14} className="text-gray-400" />
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{currentVenue.city}</span>
                     </button>
                  </div>
                  <div className="flex gap-3">
                      <button onClick={() => setIsSideMenuOpen(true)} className="w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-colors border border-transparent hover:border-gray-200 dark:hover:border-white/10">
                          <Menu size={22} />
                      </button>
                      <button onClick={() => setShowProfile(true)} className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden border-2 border-white dark:border-gray-800 shadow-md">
                          <img src={userInfo?.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"} className="w-full h-full object-cover" alt="Profile" />
                      </button>
                  </div>
           </div>
  
           <div className="px-4 pb-4">
              <div onClick={() => setIsSearchOverlayOpen(true)} className="h-12 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center px-4 gap-3 cursor-pointer border border-gray-200 dark:border-transparent hover:border-primary/30 dark:hover:border-primary/30 transition-all duration-500 shadow-inner mb-3">
                 <Search size={20} className="text-gray-400" />
                 <span className="text-sm text-gray-500 font-medium flex-1 truncate">{searchQuery || "Search stores, products or brands..."}</span>
                 <div className="w-px h-6 bg-gray-300 dark:bg-white/10"></div>
                 <Mic size={20} className="text-gray-400 hover:text-primary transition-colors" onClick={(e) => { e.stopPropagation(); startListening(); }} />
              </div>
  
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                     <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-xl border border-gray-200 dark:border-white/5 shrink-0">
                        <Footprints size={16} className="text-primary" />
                        <div>
                           <div className="text-[10px] text-gray-500 leading-none">Steps</div>
                           <div className="text-sm font-bold text-gray-900 dark:text-white leading-none">{steps}</div>
                        </div>
                     </div>

                     <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-xl border border-gray-200 dark:border-white/5 shrink-0">
                        <Flame size={16} className="text-orange-500" />
                        <div>
                           <div className="text-[10px] text-gray-500 leading-none">Kcal</div>
                           <div className="text-sm font-bold text-gray-900 dark:text-white leading-none">{calories}</div>
                        </div>
                     </div>

                     <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-xl border border-gray-200 dark:border-white/5 shrink-0">
                        <Route size={16} className="text-green-500" />
                        <div>
                           <div className="text-[10px] text-gray-500 leading-none">Dist</div>
                           <div className="text-sm font-bold text-gray-900 dark:text-white leading-none">{distance} km</div>
                        </div>
                     </div>

                     <button onClick={() => setShowGame(true)} className="ml-auto flex items-center gap-2 bg-gradient-to-r from-primary to-secondary px-4 py-2 rounded-xl text-white font-bold shadow-lg shadow-primary/20 shrink-0 active:scale-95 transition-transform">
                        <Gamepad2 size={18} /> <span className="text-xs uppercase tracking-wider">Play</span>
                     </button>
              </div>
           </div>
        </div>
      )}

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 relative overflow-hidden">
         
         {activeTab === 'map' && (
            <div className="w-full h-full relative">
               <Map 
                  stores={MALL_STORES} 
                  selectedStore={selectedStore} 
                  isNavigating={isNavigating}
                  currentFloor={currentFloor}
                  onFloorChange={setCurrentFloor}
                  onStoreSelect={handleStoreSelect} 
                  onStartGame={() => setShowGame(true)}
                  onOpenAR={() => setShowAR(true)}
                  friends={isSharingLocation ? friends : []}
                  selectedFriend={selectedFriend}
                  userAvatar={userAvatar} 
                  parkingZones={PARKING_ZONES}
                  savedLocations={savedLocations}
                  selectedZone={selectedParkingZone}
                  isDarkMode={isDarkMode}
                  onToggleFullScreen={() => setIsMapFullScreen(!isMapFullScreen)}
                  isFullScreen={isMapFullScreen}
               />

               {!isMapFullScreen && (
                   <>
                       <LocationSharing 
                          isSharing={isSharingLocation}
                          onToggleSharing={() => setIsSharingLocation(!isSharingLocation)}
                          friends={friends}
                          onLocateFriend={handleLocateFriend}
                          onNavigateToFriend={handleNavigateToFriend}
                          currentFloor={currentFloor}
                          onCustomizeAvatar={() => setShowAvatarSelector(true)} 
                       />

                        {/* Store Shutter Button */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40">
                            <button 
                                onClick={() => setIsStoreSheetOpen(true)}
                                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-6 py-3 rounded-full shadow-2xl font-bold flex items-center gap-2 border border-gray-200 dark:border-white/10 hover:scale-105 transition-transform"
                            >
                                Stores <ChevronUp size={16} />
                            </button>
                        </div>
                   </>
               )}

               {/* Full Screen Store Sheet */}
               {isStoreSheetOpen && (
                   <div className="absolute inset-0 z-[60] bg-white dark:bg-gray-900 animate-slide-up">
                       <StoreList 
                          stores={filteredStores} 
                          onStoreSelect={(s) => { handleStoreSelect(s); setIsStoreSheetOpen(false); }} 
                          onNavigate={handleStartNavigation} 
                          onAddToTrip={handleAddToTrip} 
                          tripStoreIds={new Set(trip.map(s => s.id))}
                          className="h-full"
                          isExpanded={true}
                          onToggleExpand={() => setIsStoreSheetOpen(false)}
                          onFindNearest={handleFindNearest}
                       />
                   </div>
               )}
            </div>
         )}

         {activeTab === 'trip' && <TripPlanner trip={trip} onRemove={(id) => setTrip(p => p.filter(s => s.id !== id))} onNavigate={handleStartNavigation} onClear={() => setTrip([])} onAddStop={() => setIsSearchOverlayOpen(true)} onBack={() => setActiveTab('map')} onBatchAdd={handleBatchAddToTrip} onReorder={handleReorderTrip} />}
         {activeTab === 'events' && <EventsView onBack={() => setActiveTab('map')} />}
         {activeTab === 'blog' && <BlogView onBack={() => setActiveTab('map')} />}
         {activeTab === 'rewards' && <RewardsView userPoints={userPoints} onRedeem={(cost) => setUserPoints(p => p - cost)} onBack={() => setActiveTab('map')} />}
         {activeTab === 'lost-found' && <LostAndFound onBack={() => setActiveTab('map')} />}
         {activeTab === 'parking' && <ParkingDashboard zones={PARKING_ZONES} savedLocations={savedLocations} onSaveLocation={handleSaveParking} onDeleteLocation={handleDeleteLocation} onNavigateToZone={handleNavigateToZone} onFindCar={handleFindCar} onBack={() => setActiveTab('map')} />}
         {activeTab === 'hot-offers' && <HotOffersView onBack={() => setActiveTab('map')} onNavigate={handleStartNavigation} onAddToTrip={handleAddToTrip} tripStoreIds={new Set(trip.map(s => s.id))} />}
         {activeTab === 'takeaway' && <FoodTakeaway onBack={() => setActiveTab('map')} onSelectMerchant={handleTakeawayOpen} />}
         {activeTab === 'amenities' && <AmenitiesView onBack={() => setActiveTab('map')} />}

         {showEventPopup && MALL_EVENTS.length > 0 && <EventPopup event={MALL_EVENTS[0]} onDismiss={() => setShowEventPopup(false)} />}
         {showGame && <NavigationGame onClose={() => setShowGame(false)} onScoreSubmit={(pts) => setUserPoints(p => p + pts)} />}
         
         <div className="z-[200] relative">
            <ChatAssistant onNavigate={handleStartNavigation} showIcon={false} />
         </div>

         {/* Food Takeaway Floating Button */}
         {activeTab === 'map' && !isStoreSheetOpen && !showAR && !showProfile && !isMapFullScreen && !viewingStoreProfile && (
            <button
                onClick={() => handleTakeawayOpen()}
                className={`fixed bottom-6 right-6 z-[90] group transition-all duration-500 transform hover:scale-110 active:scale-95 scale-100 opacity-100 translate-y-0`}
            >
                <div className="relative w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(249,115,22,0.6)] border-2 border-orange-400 overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/30 to-transparent rounded-t-full pointer-events-none"></div>
                   <Utensils size={30} className="text-white relative z-10" />
                </div>
            </button>
         )}

         {viewingStoreProfile && (
            <>
               <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]" onClick={() => setViewingStoreProfile(null)}></div>
               <StoreProfile 
                  store={viewingStoreProfile} 
                  onClose={() => setViewingStoreProfile(null)} 
                  onNavigate={handleStartNavigation}
                  onAddToTrip={handleAddToTrip}
                  isInTrip={trip.some(s => s.id === viewingStoreProfile.id)}
                  onTakeaway={handleTakeawayOpen}
               />
            </>
         )}
      </div>
    </div>
  );
}

export default App;
