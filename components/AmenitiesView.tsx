
import React, { useRef, useState, useMemo } from 'react';
import { AMENITIES_DATA, ICON_MAP } from '../constants';
import { ArrowLeft, Search, Circle, Info, Wifi, AlertTriangle, Coffee, Droplets, HelpCircle, MapPin, Navigation, X } from 'lucide-react';
import { Amenity } from '../types';

interface AmenitiesViewProps {
  onBack: () => void;
}

const AmenitiesView: React.FC<AmenitiesViewProps> = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAmenity, setSelectedAmenity] = useState<Amenity | null>(null);
  
  const touchStart = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const diff = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(diff) > 50 && !selectedAmenity) onBack(); 
    touchStart.current = null;
  };

  const filteredAmenities = useMemo(() => {
      if (!searchQuery) return AMENITIES_DATA;
      return AMENITIES_DATA.filter(item => 
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [searchQuery]);

  // Color mapping based on index or type for variety
  const getIconColor = (index: number) => {
      const colors = [
          'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
          'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
          'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
          'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
          'bg-pink-50 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400',
          'bg-cyan-50 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400',
      ];
      return colors[index % colors.length];
  };

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
         <h2 className="text-xl font-bold text-gray-900 dark:text-white">Amenities</h2>
      </div>

      {/* Search */}
      <div className="p-4">
         <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search amenities..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-2xl pl-10 pr-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-colors shadow-sm"
            />
         </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-6 pt-0 pb-32">
        <div className="grid grid-cols-3 gap-4">
          {filteredAmenities.map((item, index) => {
            const Icon = ICON_MAP[item.iconName] || Circle;
            return (
              <div 
                key={item.id} 
                onClick={() => setSelectedAmenity(item)}
                className="flex flex-col items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-white/5 hover:scale-105 transition-all cursor-pointer hover:shadow-md"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${getIconColor(index)}`}>
                   <Icon size={28} />
                </div>
                <span className="text-xs font-bold text-center text-gray-700 dark:text-gray-300 leading-tight">{item.name}</span>
              </div>
            )
          })}
        </div>
        {filteredAmenities.length === 0 && (
            <div className="text-center py-10 text-gray-500">No amenities found.</div>
        )}
      </div>

      {/* Amenity Profile Modal */}
      {selectedAmenity && (
          <div 
            className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in p-0 sm:p-4"
            onClick={() => setSelectedAmenity(null)}
          >
              <div 
                className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-t-3xl sm:rounded-3xl border-t sm:border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-slide-up"
                onClick={(e) => e.stopPropagation()}
              >
                  
                  <div className="relative h-48 bg-gray-200 dark:bg-gray-800 shrink-0">
                      {selectedAmenity.image ? (
                          <img src={selectedAmenity.image} alt={selectedAmenity.name} className="w-full h-full object-cover" />
                      ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <Info size={48} />
                          </div>
                      )}
                      <button 
                        onClick={() => setSelectedAmenity(null)}
                        className="absolute top-4 right-4 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition backdrop-blur-md z-10"
                      >
                          <X size={20} />
                      </button>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                      <div className="absolute bottom-4 left-4 text-white">
                          <h3 className="text-2xl font-bold">{selectedAmenity.name}</h3>
                      </div>
                  </div>

                  <div className="p-6 flex-1 overflow-y-auto">
                      <div className="flex items-center gap-2 mb-4 bg-gray-100 dark:bg-white/5 p-3 rounded-xl">
                          <MapPin size={20} className="text-primary" />
                          <div>
                              <div className="text-xs text-gray-500 uppercase font-bold">Location</div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{selectedAmenity.floor || 'Various Locations'}</div>
                          </div>
                      </div>

                      <div className="mb-6">
                          <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Description</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                              {selectedAmenity.description || 'No description available.'}
                          </p>
                      </div>

                      <button className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all">
                          <Navigation size={18} /> Navigate Here
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default AmenitiesView;
