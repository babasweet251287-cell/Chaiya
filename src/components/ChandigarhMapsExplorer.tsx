import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Compass,
  Navigation,
  ExternalLink,
  Plane,
  ShoppingBag,
  Trees,
  HeartPulse,
  Sparkles,
  Search,
  Loader2
} from 'lucide-react';
import Markdown from 'react-markdown';

interface Place {
  title: string;
  uri: string;
  category?: string;
  distance?: string;
  description?: string;
}

interface MapsExplorerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenViewing: () => void;
}

const PRESET_QUERIES = [
  {
    id: 'overview',
    label: 'Overview & Highlights',
    icon: Compass,
    query: 'What are the premier landmarks, transportation hubs, luxury dining spots, and shopping centers near Nirmal Chhaya Towers on VIP Road, Zirakpur, Chandigarh?'
  },
  {
    id: 'airport',
    label: 'Airport & Transit',
    icon: Plane,
    query: 'What is the exact distance and driving route from Nirmal Chhaya Towers (VIP Road Zirakpur) to Shaheed Bhagat Singh International Airport Chandigarh and Chandigarh Railway Station?'
  },
  {
    id: 'shopping',
    label: 'Luxury Retail & Dining',
    icon: ShoppingBag,
    query: 'What are the top luxury shopping malls (like Elante Mall) and high-end restaurants near Nirmal Chhaya Towers on VIP Road Chandigarh?'
  },
  {
    id: 'nature',
    label: 'Sukhna Lake & Shivalik',
    icon: Trees,
    query: 'How far is Sukhna Lake, Rock Garden, and the Shivalik scenic hill drive from Nirmal Chhaya Towers Chandigarh?'
  },
  {
    id: 'health_edu',
    label: 'Healthcare & Schools',
    icon: HeartPulse,
    query: 'What are the top quaternary hospitals (Fortis, Max) and premier schools located within a short drive of Nirmal Chhaya Towers VIP Road?'
  }
];

export const ChandigarhMapsExplorer: React.FC<MapsExplorerProps> = ({
  isOpen,
  onClose,
  onOpenViewing
}) => {
  const [activePreset, setActivePreset] = useState('overview');
  const [customQuery, setCustomQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultText, setResultText] = useState<string>('');
  const [places, setPlaces] = useState<Place[]>([]);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locatingUser, setLocatingUser] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Lock background scroll on mobile / iOS when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  // Fetch Maps Grounded data
  const executeQuery = async (queryText: string, categoryId?: string) => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/gemini/maps-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryText,
          category: categoryId || activePreset,
          userCoordinates: userLocation || { latitude: 30.6415, longitude: 76.8202 }
        })
      });

      const data = await response.json();
      if (data.success) {
        setResultText(data.text || '');
        setPlaces(data.places || []);
      } else {
        setErrorMsg(data.error || 'Failed to retrieve grounded location data.');
      }
    } catch (err: any) {
      console.error('Error in maps grounding request:', err);
      setErrorMsg('Network error while querying Google Maps Grounding.');
    } finally {
      setLoading(false);
    }
  };

  // Trigger initial query when opening modal
  useEffect(() => {
    if (isOpen && !resultText && !loading) {
      executeQuery(PRESET_QUERIES[0].query, PRESET_QUERIES[0].id);
    }
  }, [isOpen]);

  // Request user GPS
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        };
        setUserLocation(coords);
        setLocatingUser(false);
        executeQuery(
          `Calculate the direct driving distance and commute route from my current location (${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}) to Nirmal Chhaya Towers, VIP Road, Zirakpur, Chandigarh, India.`,
          'transit'
        );
      },
      (err) => {
        console.warn('Geolocation denied or unavailable:', err);
        setLocatingUser(false);
      },
      { timeout: 8000 }
    );
  };

  const handlePresetClick = (preset: typeof PRESET_QUERIES[0]) => {
    setActivePreset(preset.id);
    setCustomQuery('');
    executeQuery(preset.query, preset.id);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuery.trim()) return;
    setActivePreset('custom');
    executeQuery(customQuery, 'custom');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 lg:p-6 bg-black/85 backdrop-blur-md overflow-y-auto overscroll-contain"
      onClick={onClose}
      id="chandigarh-maps-explorer-modal"
    >
      <div
        className="relative w-full max-w-5xl bg-[#0b0d13] border border-[#d4af37]/40 rounded-2xl sm:rounded-3xl shadow-[0_24px_100px_rgba(0,0,0,0.95)] overflow-hidden my-auto max-h-[calc(100dvh-1rem)] sm:max-h-[92dvh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-white/[0.08] flex items-center justify-between bg-[#10131c] shrink-0 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/50 flex items-center justify-center text-[#d4af37] shrink-0">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className="text-[9px] sm:text-[10px] uppercase font-sans font-semibold tracking-[0.25em] text-[#d4af37] truncate">
                  MAPS GROUNDING // CHANDIGARH
                </span>
                <span className="px-1.5 sm:px-2 py-0.5 rounded-full text-[8.5px] sm:text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
                  Live Grounded
                </span>
              </div>
              <h2 className="text-base sm:text-xl lg:text-2xl font-serif-luxury text-[#fbf8f2] truncate">
                Neighborhood &amp; Transit Guide
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] p-2 text-white/60 hover:text-white rounded-full hover:bg-white/[0.08] transition-colors focus:outline-none flex items-center justify-center shrink-0 cursor-pointer"
            aria-label="Close location explorer"
            id="close-maps-explorer-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 flex flex-col lg:flex-row gap-5 sm:gap-6">
          {/* Left Column: Mobile horizontal chips on small screens, sidebar on desktop */}
          <div className="w-full lg:w-80 flex flex-col gap-4 sm:gap-5 flex-shrink-0">
            {/* Nirmal Chhaya Address Card */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-[#141824]/90 border border-white/[0.08] text-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[#d4af37] font-semibold tracking-wider uppercase text-[9.5px]">
                  VIP ROAD CORRIDOR
                </span>
                <span className="text-white/40 text-[9.5px]">PIN 140603</span>
              </div>
              <p className="text-white/95 font-medium text-sm sm:text-xs mb-0.5">
                Nirmal Chhaya Towers
              </p>
              <p className="text-white/60 leading-relaxed text-[11px] sm:text-xs">
                VIP Road, Zirakpur, Chandigarh Tricity, Punjab, India
              </p>
              <div className="mt-2.5 pt-2.5 border-t border-white/[0.08] flex items-center justify-between text-[10.5px]">
                <span className="text-[#d4af37]">30.6415° N, 76.8202° E</span>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Nirmal+Chhaya+Towers+VIP+Road+Zirakpur"
                  target="_blank"
                  rel="noreferrer"
                  className="text-white/80 hover:text-[#d4af37] inline-flex items-center gap-1 font-medium"
                >
                  Open Maps <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Live GPS Route Finder */}
            <button
              onClick={handleDetectLocation}
              disabled={locatingUser}
              className="w-full min-h-[44px] py-2.5 px-3.5 rounded-xl border border-dashed border-[#d4af37]/60 bg-[#d4af37]/10 hover:bg-[#d4af37]/20 text-[#fbf8f2] text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
              id="detect-gps-transit-btn"
            >
              {locatingUser ? (
                <>
                  <Loader2 className="w-4 h-4 text-[#d4af37] animate-spin" />
                  <span>Detecting GPS Location...</span>
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4 text-[#d4af37]" />
                  <span>Calculate Route From My GPS</span>
                </>
              )}
            </button>

            {/* Preset Query Categories - Horizontal scrollable on mobile for thumb friendliness */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[9.5px] uppercase font-sans font-semibold tracking-widest text-white/40 px-1">
                EXPLORE BY HIGHLIGHT
              </span>
              <div className="flex lg:flex-col gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
                {PRESET_QUERIES.map((preset) => {
                  const Icon = preset.icon;
                  const isActive = activePreset === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handlePresetClick(preset)}
                      className={`text-left min-h-[40px] px-3 py-2 sm:py-2.5 rounded-xl flex items-center gap-2.5 text-xs transition-all cursor-pointer shrink-0 lg:shrink whitespace-nowrap lg:whitespace-normal ${
                        isActive
                          ? 'bg-[#d4af37]/20 border border-[#d4af37] text-white font-medium shadow-[0_0_15px_rgba(212,175,55,0.15)]'
                          : 'bg-[#141824]/60 border border-white/[0.05] text-white/70 hover:text-white hover:bg-[#141824]'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${isActive ? 'text-[#d4af37]' : 'text-white/50'}`} />
                      <span className="truncate">{preset.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Question Form - iOS 16px rule for input to prevent safari auto-zoom */}
            <form onSubmit={handleCustomSubmit} className="flex flex-col gap-1.5 mt-0.5">
              <span className="text-[9.5px] uppercase font-sans font-semibold tracking-widest text-white/40 px-1">
                ASK LIVE CONCIERGE
              </span>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Driving time to Railway Station..."
                  value={customQuery}
                  onChange={(e) => setCustomQuery(e.target.value)}
                  className="w-full pl-3 pr-11 py-2.5 rounded-xl bg-[#141824] border border-white/[0.12] text-base sm:text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#d4af37]"
                />
                <button
                  type="submit"
                  disabled={loading || !customQuery.trim()}
                  className="min-w-[40px] min-h-[40px] absolute right-1 top-1 p-1 text-[#d4af37] hover:text-white disabled:opacity-30 flex items-center justify-center cursor-pointer"
                  aria-label="Submit query"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: AI Grounded Response & Verified Map Places */}
          <div className="flex-1 flex flex-col gap-5 overflow-hidden">
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center min-h-[260px] text-center p-6">
                <Loader2 className="w-9 h-9 text-[#d4af37] animate-spin mb-3" />
                <h4 className="text-base sm:text-lg font-serif-luxury text-white mb-1.5">
                  Querying Google Maps Grounding...
                </h4>
                <p className="text-xs text-white/60 max-w-sm">
                  Grounding realtime coordinates and route calculations near Nirmal Chhaya Towers with Gemini 3.8 Flash.
                </p>
              </div>
            ) : errorMsg ? (
              <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 text-rose-200 text-xs">
                <p className="font-semibold mb-1">Notice</p>
                <p>{errorMsg}</p>
              </div>
            ) : (
              <>
                {/* AI Grounded Synthesis */}
                <div className="p-4 sm:p-6 rounded-2xl bg-[#141824]/90 border border-white/[0.08] shadow-lg">
                  <div className="flex items-center gap-2 mb-2.5 pb-2 border-b border-white/[0.06]">
                    <Sparkles className="w-4 h-4 text-[#d4af37]" />
                    <span className="text-[9.5px] sm:text-[10px] tracking-widest uppercase font-semibold text-[#d4af37]">
                      GEOSPATIAL NARRATIVE &amp; CONNECTIVITY
                    </span>
                  </div>
                  <div className="prose prose-invert max-w-none text-xs sm:text-[13px] leading-relaxed text-white/85">
                    <Markdown>{resultText}</Markdown>
                  </div>
                </div>

                {/* Grounded Google Maps Places Cards */}
                {places.length > 0 && (
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] sm:text-[11px] uppercase font-sans font-semibold tracking-widest text-[#d4af37]">
                        VERIFIED PLACES ON GOOGLE MAPS ({places.length})
                      </span>
                      <span className="text-[9.5px] text-white/40 hidden sm:inline">
                        Tap any destination for direct directions
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {places.map((place, idx) => (
                        <a
                          key={idx}
                          href={place.uri}
                          target="_blank"
                          rel="noreferrer"
                          className="group p-3.5 sm:p-4 rounded-xl bg-[#141824] border border-white/[0.08] hover:border-[#d4af37]/60 hover:bg-[#1a1f30] active:scale-[0.99] transition-all flex flex-col justify-between cursor-pointer"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className="text-xs font-semibold text-white group-hover:text-[#d4af37] transition-colors leading-snug">
                                {place.title}
                              </h4>
                              <ExternalLink className="w-3.5 h-3.5 text-white/40 group-hover:text-[#d4af37] flex-shrink-0" />
                            </div>

                            {place.description && (
                              <p className="text-[11px] text-white/60 line-clamp-2 leading-relaxed">
                                {place.description}
                              </p>
                            )}
                          </div>

                          <div className="mt-2.5 pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-white/50">
                            <span className="text-[#d4af37]/90 font-medium uppercase tracking-wider">
                              {place.category || 'Landmark'}
                            </span>
                            {place.distance && (
                              <span className="px-2 py-0.5 rounded-full bg-white/[0.05] text-white/80 font-medium">
                                {place.distance}
                              </span>
                            )}
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-t border-white/[0.08] bg-[#0c0e15] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0 pb-[max(0.85rem,env(safe-area-inset-bottom))]">
          <div className="flex items-center gap-2 text-[10.5px] text-white/50 justify-center sm:justify-start">
            <Compass className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="truncate">Nirmal Chhaya Towers, VIP Road, Zirakpur (Chandigarh)</span>
          </div>

          <div className="flex items-center gap-2.5 justify-end">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none min-h-[44px] px-4 py-2 text-xs font-sans text-white/70 hover:text-white rounded-full transition-colors flex items-center justify-center cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenViewing();
              }}
              className="flex-1 sm:flex-none min-h-[44px] px-5 sm:px-6 py-2 rounded-full border border-[#d4af37] bg-[#d4af37]/20 hover:bg-[#d4af37]/35 active:scale-95 text-[#fbf8f2] text-xs font-semibold tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)] flex items-center justify-center cursor-pointer"
            >
              Book Site Visit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
