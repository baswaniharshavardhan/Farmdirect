import React, { useState } from 'react';
import {
  MapPin,
  Search,
  Globe,
  ExternalLink,
  Sparkles,
  Navigation,
  Compass,
  TrendingUp,
  X,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Building2,
  RefreshCw,
} from 'lucide-react';

interface AIAgroGroundingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'maps' | 'search';
  defaultQuery?: string;
}

interface MapsPlace {
  title: string;
  uri: string;
  reviewSnippets?: string[];
}

interface WebSource {
  title: string;
  uri: string;
}

export const AIAgroGroundingModal: React.FC<AIAgroGroundingModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'maps',
  defaultQuery,
}) => {
  const [activeTab, setActiveTab] = useState<'maps' | 'search'>(initialTab);
  const [prompt, setPrompt] = useState(
    defaultQuery ||
      (initialTab === 'maps'
        ? 'Find nearby organic farms, FPO centers, and produce collection hubs in Nashik and Maharashtra'
        : 'Current APMC mandi wholesale prices for onions, tomatoes, and mangoes in Maharashtra today')
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requiresKey, setRequiresKey] = useState(false);

  // Maps Results
  const [mapsText, setMapsText] = useState<string | null>(null);
  const [mapsPlaces, setMapsPlaces] = useState<MapsPlace[]>([]);

  // Search Results
  const [searchText, setSearchText] = useState<string | null>(null);
  const [webSources, setWebSources] = useState<WebSource[]>([]);
  const [searchQueries, setSearchQueries] = useState<string[]>([]);

  // Geolocation
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationName, setLocationName] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  if (!isOpen) return null;

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setLocationName(`${pos.coords.latitude.toFixed(3)}°N, ${pos.coords.longitude.toFixed(3)}°E`);
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
        // Default to Nashik Agro Hub if permission denied
        setCoords({ latitude: 19.9975, longitude: 73.7898 });
        setLocationName('Nashik Agro Hub, MH (Default)');
      }
    );
  };

  const handleQuery = async (queryToRun?: string, tabToUse?: 'maps' | 'search') => {
    const q = queryToRun || prompt;
    const tab = tabToUse || activeTab;

    if (!q.trim()) return;

    setIsLoading(true);
    setError(null);
    setRequiresKey(false);

    try {
      if (tab === 'maps') {
        const res = await fetch('/api/ai/maps-grounding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: q,
            location: coords || undefined,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch Maps Grounded data');
        }

        setMapsText(data.text);
        setMapsPlaces(data.mapsPlaces || []);
      } else {
        const res = await fetch('/api/ai/search-grounding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: q }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch Search Grounded data');
        }

        setSearchText(data.text);
        setWebSources(data.webSources || []);
        setSearchQueries(data.searchQueries || []);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      if (
        err.message?.includes('GEMINI_API_KEY') ||
        err.message?.includes('API key') ||
        err.message?.includes('403')
      ) {
        setRequiresKey(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreset = (presetText: string) => {
    setPrompt(presetText);
    handleQuery(presetText);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      id="ai-agro-grounding-modal"
    >
      <div className="bg-white rounded-3xl shadow-2xl border border-neutral-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-[#06382b] to-teal-950 text-white p-5 sm:p-6 relative flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 text-neutral-300 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            id="btn-close-grounding-modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              GEMINI 3.5 FLASH ENGINE
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
              OFFICIAL GROUNDING TOOLS
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-white flex items-center gap-2">
            <span>Live Agricultural Grounding Intelligence</span>
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/80 mt-1 max-w-2xl font-sans">
            Real-time geospatial discovery and verified agricultural market intelligence powered by Google
            Maps data and Google Search web grounding.
          </p>

          {/* Tab Selector */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-emerald-800/60">
            <button
              type="button"
              onClick={() => {
                setActiveTab('maps');
                if (!prompt) {
                  setPrompt('Find nearby organic farms, FPO centers, and produce collection hubs in Nashik and Maharashtra');
                }
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'maps'
                  ? 'bg-emerald-600 text-white shadow-md border border-emerald-400/40 ring-1 ring-emerald-400/50'
                  : 'bg-white/10 text-emerald-100 hover:bg-white/20'
              }`}
              id="tab-select-maps-grounding"
            >
              <Compass className="w-4 h-4 text-amber-300" />
              <span>Google Maps Grounding</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('search');
                if (!prompt) {
                  setPrompt('Current APMC mandi wholesale prices for onions, tomatoes, and mangoes in Maharashtra today');
                }
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'search'
                  ? 'bg-teal-600 text-white shadow-md border border-teal-400/40 ring-1 ring-teal-400/50'
                  : 'bg-white/10 text-emerald-100 hover:bg-white/20'
              }`}
              id="tab-select-search-grounding"
            >
              <Globe className="w-4 h-4 text-sky-300" />
              <span>Google Search Grounding</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Query Bar */}
          <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
                  placeholder={
                    activeTab === 'maps'
                      ? 'e.g. Find organic mango orchards, APMC mandis, or cold storage hubs near Pune...'
                      : 'e.g. Real-time Alphonso mandi prices, fertilizer subsidy guidelines, export tariffs...'
                  }
                  className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  id="input-grounding-prompt"
                />
              </div>

              {activeTab === 'maps' && (
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={isLocating}
                  className="px-3.5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold rounded-xl border border-neutral-300 flex items-center justify-center gap-1.5 flex-shrink-0 cursor-pointer transition-colors"
                  title="Include GPS coordinates for pinpoint local search"
                  id="btn-use-geolocation"
                >
                  <Navigation className={`w-3.5 h-3.5 text-emerald-600 ${isLocating ? 'animate-spin' : ''}`} />
                  <span>{locationName ? locationName : 'My Location'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => handleQuery()}
                disabled={isLoading}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all flex-shrink-0 disabled:opacity-50"
                id="btn-run-grounding-query"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Querying Gemini...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Search With {activeTab === 'maps' ? 'Maps' : 'Search'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs">
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider font-mono mr-1">
                Suggested Prompts:
              </span>
              {activeTab === 'maps' ? (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      handlePreset(
                        'Find organic mango & grape vineyards with farm gate pickups near Nashik and Niphad'
                      )
                    }
                    className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-neutral-700 hover:text-emerald-800 rounded-lg border border-neutral-200 text-[11px] transition-colors cursor-pointer"
                  >
                    🍇 Organic Vineyards &amp; Orchards
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handlePreset('Locate major APMC fruit and vegetable wholesale mandis in Maharashtra')
                    }
                    className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-neutral-700 hover:text-emerald-800 rounded-lg border border-neutral-200 text-[11px] transition-colors cursor-pointer"
                  >
                    🏛️ Regional APMC Mandis
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handlePreset(
                        'Find agricultural cold storage reefer warehouses and packhouses near Mumbai-Nashik corridor'
                      )
                    }
                    className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-neutral-700 hover:text-emerald-800 rounded-lg border border-neutral-200 text-[11px] transition-colors cursor-pointer"
                  >
                    ❄️ Cold Storage &amp; Reefer Hubs
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      handlePreset(
                        'Latest APMC wholesale prices for onions, tomatoes, and Alphonso mangoes in Mumbai and Vashi mandis today'
                      )
                    }
                    className="px-2.5 py-1 bg-white hover:bg-teal-50 text-neutral-700 hover:text-teal-800 rounded-lg border border-neutral-200 text-[11px] transition-colors cursor-pointer"
                  >
                    📈 Today's Mandi Wholesale Rates
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handlePreset(
                        'Government subsidies for FPO cold rooms and solar refrigerated vans in Maharashtra 2026'
                      )
                    }
                    className="px-2.5 py-1 bg-white hover:bg-teal-50 text-neutral-700 hover:text-teal-800 rounded-lg border border-neutral-200 text-[11px] transition-colors cursor-pointer"
                  >
                    ⚡ Cold-Chain Subsidies &amp; Schemes
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handlePreset(
                        'Monsoon rainfall update and weather alert for Nashik and Western Ghats farming belts'
                      )
                    }
                    className="px-2.5 py-1 bg-white hover:bg-teal-50 text-neutral-700 hover:text-teal-800 rounded-lg border border-neutral-200 text-[11px] transition-colors cursor-pointer"
                  >
                    🌦️ Live Weather &amp; Crop Advisory
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Error / Key Notification */}
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-rose-900">Query Service Notice</h4>
                <p className="text-xs text-rose-700 mt-0.5">{error}</p>
                {requiresKey && (
                  <p className="text-[11px] text-rose-600 mt-1">
                    Tip: Make sure <code className="bg-rose-100 px-1 rounded">GEMINI_API_KEY</code> is configured in
                    the platform <strong>Settings &gt; Secrets</strong> panel.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Maps Grounding View */}
          {activeTab === 'maps' && (
            <div className="space-y-4">
              {mapsText ? (
                <>
                  {/* Extracted Google Maps Links (MANDATORY REQUIREMENT) */}
                  {mapsPlaces.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                          Verified Google Maps Locations ({mapsPlaces.length})
                        </span>
                        <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Direct Google Maps Links
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {mapsPlaces.map((place, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 rounded-2xl bg-white border border-neutral-200 hover:border-emerald-400 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="font-bold text-neutral-900 text-xs sm:text-sm font-display flex items-center gap-1.5">
                                  <Building2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                  <span>{place.title}</span>
                                </h4>
                              </div>

                              {place.reviewSnippets && place.reviewSnippets.length > 0 && (
                                <p className="text-[11px] text-neutral-500 mt-1.5 italic bg-neutral-50 p-2 rounded-lg border border-neutral-100">
                                  "{place.reviewSnippets[0]}"
                                </p>
                              )}
                            </div>

                            {place.uri ? (
                              <a
                                href={place.uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg border border-emerald-200 transition-colors w-fit"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>View on Google Maps</span>
                              </a>
                            ) : (
                              <span className="mt-3 text-[10px] text-neutral-400 font-mono">Location verified</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Synthesized Response Body */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50/70 border border-neutral-200 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-neutral-700">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Synthesized Geospatial Analysis (gemini-3.5-flash)</span>
                    </div>
                    <div className="prose prose-sm text-xs sm:text-sm text-neutral-800 leading-relaxed whitespace-pre-line font-sans">
                      {mapsText}
                    </div>
                  </div>
                </>
              ) : (
                !isLoading && (
                  <div className="p-8 text-center rounded-2xl border-2 border-dashed border-neutral-200 space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-neutral-800 text-sm font-display">
                      Ready to Search with Google Maps Grounding
                    </h3>
                    <p className="text-xs text-neutral-500 max-w-md mx-auto">
                      Discover verified regional farms, farmer cooperatives, cold-chain hubs, and APMC collection
                      centers with live location data and interactive Google Maps links.
                    </p>
                  </div>
                )
              )}
            </div>
          )}

          {/* Search Grounding View */}
          {activeTab === 'search' && (
            <div className="space-y-4">
              {searchText ? (
                <>
                  {/* Verified Web Citations (MANDATORY REQUIREMENT) */}
                  {webSources.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-teal-600" />
                          Verified Web Sources &amp; Citations ({webSources.length})
                        </span>
                        <span className="text-[10px] text-teal-600 font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                          Google Search Grounded
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {webSources.map((source, idx) => (
                          <a
                            key={idx}
                            href={source.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-teal-50 text-neutral-800 hover:text-teal-900 border border-neutral-200 hover:border-teal-300 rounded-xl text-xs font-medium shadow-2xs transition-all max-w-sm truncate"
                          >
                            <ExternalLink className="w-3 h-3 text-teal-600 flex-shrink-0" />
                            <span className="truncate">{source.title || source.uri}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Search Queries Executed */}
                  {searchQueries.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-neutral-500 font-mono">
                      <span>Search queries:</span>
                      {searchQueries.map((q, idx) => (
                        <span key={idx} className="bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                          "{q}"
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Synthesized Response Body */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50/70 border border-neutral-200 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-neutral-700">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Live Agricultural Market Report (gemini-3.5-flash)</span>
                    </div>
                    <div className="prose prose-sm text-xs sm:text-sm text-neutral-800 leading-relaxed whitespace-pre-line font-sans">
                      {searchText}
                    </div>
                  </div>
                </>
              ) : (
                !isLoading && (
                  <div className="p-8 text-center rounded-2xl border-2 border-dashed border-neutral-200 space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mx-auto">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-neutral-800 text-sm font-display">
                      Ready to Query Google Search Grounding
                    </h3>
                    <p className="text-xs text-neutral-500 max-w-md mx-auto">
                      Fetch up-to-the-minute APMC wholesale mandi rates, weather advisories, seasonal price fluctuations,
                      and subsidy schemes backed by live Google Search web citations.
                    </p>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-100 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500 flex-shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>FarmDirect Agro-Grounding · Powered by Google Gemini 3.5 Flash</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleQuery()}
              className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Refresh Analysis</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-900 text-white rounded-lg font-semibold cursor-pointer transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
