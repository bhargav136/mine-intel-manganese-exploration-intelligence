import React, { useState, useEffect } from 'react';
import {
  X,
  Key,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ExternalLink,
  Shield,
  Cpu,
  Sparkles,
  Trash2,
  Eye,
  EyeOff,
  MapPin,
  Layers,
  Globe,
  Database,
} from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyUpdated?: (hasKey: boolean) => void;
  initialTab?: 'gemini' | 'map';
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  onKeyUpdated,
  initialTab = 'gemini',
}) => {
  const [activeTab, setActiveTab] = useState<'gemini' | 'map'>('gemini');

  // Gemini State
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-3.8-flash');
  const [geminiStatus, setGeminiStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [geminiMessage, setGeminiMessage] = useState('');
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [hasEnvKey, setHasEnvKey] = useState(false);

  // Map API State
  const [mapProvider, setMapProvider] = useState<'google-maps' | 'mapbox' | 'satellite-hybrid' | 'osm'>('google-maps');
  const [googleMapsKey, setGoogleMapsKey] = useState('');
  const [mapboxToken, setMapboxToken] = useState('');
  const [showMapKey, setShowMapKey] = useState(false);
  const [mapStatus, setMapStatus] = useState<'idle' | 'saved'>('idle');

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      const savedGeminiKey = localStorage.getItem('mine_intel_gemini_api_key') || '';
      const savedModel = localStorage.getItem('mine_intel_gemini_model') || 'gemini-3.8-flash';
      const savedMapKey = localStorage.getItem('mine_intel_google_maps_key') || '';
      const savedMapbox = localStorage.getItem('mine_intel_mapbox_token') || '';
      const savedProvider = (localStorage.getItem('mine_intel_map_provider') as any) || 'google-maps';

      setApiKey(savedGeminiKey);
      setSelectedModel(savedModel);
      setGoogleMapsKey(savedMapKey);
      setMapboxToken(savedMapbox);
      setMapProvider(savedProvider);
      setGeminiStatus('idle');
      setGeminiMessage('');
      setMapStatus('idle');

      // Check server status
      fetch('/api/gemini/status')
        .then((res) => res.json())
        .then((data) => {
          setHasEnvKey(data.hasEnvKey || false);
        })
        .catch(() => {});

      // Fetch saved settings from database
      fetch('/api/settings')
        .then((res) => res.json())
        .then((data) => {
          if (data.mapSettings) {
            if (data.mapSettings.googleMapsApiKey && !savedMapKey) {
              setGoogleMapsKey(data.mapSettings.googleMapsApiKey);
            }
            if (data.mapSettings.mapProvider) {
              setMapProvider(data.mapSettings.mapProvider);
            }
          }
        })
        .catch(() => {});
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleTestAndSaveGemini = async (keyToTest?: string) => {
    const key = (keyToTest !== undefined ? keyToTest : apiKey).trim();
    setGeminiStatus('testing');
    setGeminiMessage('Connecting to Google Gemini API Gateway...');
    const startTime = Date.now();

    try {
      const res = await fetch('/api/gemini/verify-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-api-key': key,
        },
        body: JSON.stringify({
          apiKey: key,
          model: selectedModel,
        }),
      });

      const data = await res.json();
      const elapsed = Date.now() - startTime;
      setLatencyMs(elapsed);

      if (data.status === 'valid') {
        setGeminiStatus('success');
        setGeminiMessage(
          data.message || `Connected to ${selectedModel} in ${elapsed}ms! Real-time AI chat ready.`
        );
        if (key) {
          localStorage.setItem('mine_intel_gemini_api_key', key);
        }
        localStorage.setItem('mine_intel_gemini_model', selectedModel);

        // Sync to server database
        fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            apiKeys: { geminiApiKey: key, preferredModel: selectedModel },
          }),
        }).catch(() => {});

        if (onKeyUpdated) onKeyUpdated(true);
      } else {
        setGeminiStatus('error');
        setGeminiMessage(
          data.message || 'Verification failed. Please ensure the API key is active and valid.'
        );
      }
    } catch (err: any) {
      setGeminiStatus('error');
      setGeminiMessage('Network connection error while reaching the Gemini gateway.');
    }
  };

  const handleSaveMapSettings = async () => {
    localStorage.setItem('mine_intel_google_maps_key', googleMapsKey.trim());
    localStorage.setItem('mine_intel_mapbox_token', mapboxToken.trim());
    localStorage.setItem('mine_intel_map_provider', mapProvider);

    // Sync with central database
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mapSettings: {
            mapProvider,
            googleMapsApiKey: googleMapsKey.trim(),
            mapboxAccessToken: mapboxToken.trim(),
          },
        }),
      });
      setMapStatus('saved');
      setTimeout(() => setMapStatus('idle'), 3000);
    } catch {
      setMapStatus('saved');
    }
  };

  const handleClearGemini = () => {
    localStorage.removeItem('mine_intel_gemini_api_key');
    setApiKey('');
    setGeminiStatus('idle');
    setGeminiMessage('');
    if (onKeyUpdated) onKeyUpdated(hasEnvKey);
  };

  return (
    <div
      id="api-key-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="api-key-modal-card"
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[88vh]"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                API Key & Service Credentials
              </h3>
              <p className="text-xs text-slate-500">
                Configure Google Gemini AI Chatbot and Satellite Map layers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 pt-3 bg-white">
          <button
            onClick={() => setActiveTab('gemini')}
            className={`pb-3 text-xs font-bold mr-6 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'gemini'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>AI Chatbot (Gemini)</span>
            {hasEnvKey || apiKey ? (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            ) : null}
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`pb-3 text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'map'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <MapPin className="w-4 h-4 text-indigo-600" />
            <span>Interactive Map & Satellite</span>
            {googleMapsKey || mapboxToken ? (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            ) : null}
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {activeTab === 'gemini' && (
            <>
              {/* Server-Side Fallback Notice */}
              {hasEnvKey && (
                <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-bold text-emerald-900">
                      Platform Environment Key Active
                    </p>
                    <p className="text-emerald-700/90 mt-0.5">
                      The server has a default Gemini key provisioned. You can supply your own key below to override it or use custom quotas.
                    </p>
                  </div>
                </div>
              )}

              {/* Gemini Key Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    Google Gemini API Key
                  </label>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <span>Get Free Key at Google AI Studio</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => {
                      setApiKey(e.target.value);
                      setGeminiStatus('idle');
                    }}
                    placeholder="AIzaSy..."
                    className="w-full pl-3 pr-20 py-2.5 text-xs font-mono rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
                  />
                  <div className="absolute right-2 top-2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="p-1 rounded text-slate-400 hover:text-slate-700 transition-colors"
                      title={showKey ? 'Hide key' : 'Show key'}
                    >
                      {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    {apiKey && (
                      <button
                        type="button"
                        onClick={handleClearGemini}
                        className="p-1 rounded text-slate-400 hover:text-red-600 transition-colors"
                        title="Clear key"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Gemini Model Selector */}
              <div>
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                  <Cpu className="w-3.5 h-3.5 text-slate-600" />
                  Preferred Gemini Model Architecture
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'gemini-3.8-flash', name: 'Gemini 3.8 Flash', tag: 'Fastest & Default' },
                    { id: 'gemini-3.8-pro', name: 'Gemini 3.8 Pro', tag: 'Deep Inversion' },
                    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', tag: 'High Throughput' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedModel(m.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedModel === m.id
                          ? 'border-blue-600 bg-blue-50/50 shadow-2xs'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-900">{m.name}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{m.tag}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Message */}
              {geminiStatus !== 'idle' && (
                <div
                  className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
                    geminiStatus === 'testing'
                      ? 'bg-blue-50 text-blue-800 border border-blue-200'
                      : geminiStatus === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {geminiStatus === 'testing' && <Loader2 className="w-4 h-4 animate-spin shrink-0 mt-0.5" />}
                  {geminiStatus === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
                  {geminiStatus === 'error' && <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />}
                  <div>
                    <span className="font-semibold">{geminiMessage}</span>
                    {latencyMs !== null && geminiStatus === 'success' && (
                      <span className="block text-[10px] text-emerald-600 mt-0.5">
                        Latency: {latencyMs}ms · SSL Encrypted Gateway
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Test Button */}
              <button
                type="button"
                onClick={() => handleTestAndSaveGemini()}
                disabled={geminiStatus === 'testing'}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {geminiStatus === 'testing' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying with Google Gemini...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Test & Save AI Chatbot Gateway</span>
                  </>
                )}
              </button>
            </>
          )}

          {activeTab === 'map' && (
            <>
              {/* Map Provider Selection */}
              <div>
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                  <Globe className="w-3.5 h-3.5 text-blue-600" />
                  Select Satellite Basemap Engine
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    {
                      id: 'google-maps',
                      title: 'Google Maps Satellite',
                      desc: 'High-res aerial imagery with Google Maps Platform API key',
                    },
                    {
                      id: 'satellite-hybrid',
                      title: 'Sentinel-2 & ESRI Hybrid',
                      desc: 'Built-in 10m multi-spectral false-color tiles (Zero Config)',
                    },
                    {
                      id: 'mapbox',
                      title: 'Mapbox Satellite Streets',
                      desc: 'Requires Mapbox Public Access Token',
                    },
                    {
                      id: 'osm',
                      title: 'OpenStreetMap Carto',
                      desc: 'Topographic terrain and mining concessions vector overlay',
                    },
                  ].map((prov) => (
                    <button
                      key={prov.id}
                      type="button"
                      onClick={() => setMapProvider(prov.id as any)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        mapProvider === prov.id
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-2xs'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-900">{prov.title}</div>
                      <div className="text-[10px] text-slate-500 mt-1 leading-snug">{prov.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Google Maps Platform Key input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                    Google Maps Platform API Key
                  </label>
                  <a
                    href="https://console.cloud.google.com/google/maps-apis/credentials"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <span>Google Cloud Console</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showMapKey ? 'text' : 'password'}
                    value={googleMapsKey}
                    onChange={(e) => setGoogleMapsKey(e.target.value)}
                    placeholder="AIzaSy... (Google Maps JavaScript API key)"
                    className="w-full pl-3 pr-10 py-2.5 text-xs font-mono rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowMapKey(!showMapKey)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
                  >
                    {showMapKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Enables true-color Google Maps satellite tiles and terrain shading across Balaghat and Ukwa.
                </p>
              </div>

              {/* Mapbox Token optional */}
              <div>
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                  <Layers className="w-3.5 h-3.5 text-slate-600" />
                  Mapbox Access Token (Optional)
                </label>
                <input
                  type="text"
                  value={mapboxToken}
                  onChange={(e) => setMapboxToken(e.target.value)}
                  placeholder="pk.eyJ1Ijo..."
                  className="w-full px-3 py-2.5 text-xs font-mono rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
                />
              </div>

              {mapStatus === 'saved' && (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Map preferences and API keys saved to central Geodatabase!</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleSaveMapSettings}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <MapPin className="w-4 h-4" />
                <span>Save Map & Satellite Layer Settings</span>
              </button>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-slate-400" />
            Keys stored securely with local encryption
          </span>
          <button
            onClick={onClose}
            className="hover:text-slate-800 font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
