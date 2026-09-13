import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Play,
  RotateCcw,
  Key,
  ChevronDown,
  Database,
  User,
  ShieldCheck,
  LogIn,
} from 'lucide-react';
import { getCustomApiKey } from '../lib/geminiApi';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onAnalyzeClick: () => void;
  onViewPreviousClick: () => void;
  onOpenApiKeyModal: (tab?: 'gemini' | 'map') => void;
  onOpenLoginModal?: () => void;
  onOpenDatabaseModal?: () => void;
  selectedRegion?: string;
  onRegionChange?: (region: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onAnalyzeClick,
  onViewPreviousClick,
  onOpenApiKeyModal,
  onOpenLoginModal,
  onOpenDatabaseModal,
  selectedRegion = 'Balaghat, Madhya Pradesh',
  onRegionChange,
}) => {
  const { user } = useAuth();
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);
  const [dbTargetCount, setDbTargetCount] = useState(3);

  const regions = [
    { name: 'Balaghat District, MP', area: '1,000 km²', note: 'Primary Sausar Belt Hub (Balaghat & Ukwa Mines)' },
    { name: 'Bhandara District, Maharashtra', area: '750 km²', note: 'Dongri Buzurg & Chikla Mines' },
    { name: 'Nagpur District, Maharashtra', area: '820 km²', note: 'Mansar, Kandri & Gumgaon Mines' },
    { name: 'Chhindwara District, MP', area: '600 km²', note: 'Tirodi & Sitapatore Mines' },
  ];

  useEffect(() => {
    const checkKey = async () => {
      const customKey = getCustomApiKey();
      if (customKey) {
        setHasApiKey(true);
        return;
      }
      try {
        const res = await fetch('/api/gemini/status');
        const data = await res.json();
        setHasApiKey(data.configured || false);
      } catch {
        setHasApiKey(false);
      }
    };
    checkKey();

    fetch('/api/database/status')
      .then((res) => res.json())
      .then((d) => {
        if (d?.verifiedTargetsCount) setDbTargetCount(d.verifiedTargetsCount);
      })
      .catch(() => {});
  }, []);

  return (
    <header
      id="main-app-header"
      className="bg-white border-b border-slate-200 px-4 sm:px-6 md:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4 select-none shrink-0"
    >
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-sans">
            MINE-INTEL
          </h1>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-slate-100 text-slate-700 tracking-wide border border-slate-200">
            MOIL LIMITED · SIH26009
          </span>
        </div>
        <p className="text-xs font-medium text-slate-500 mt-0.5">
          Manganese Exploration Intelligence & Production Shortfall Prevention Platform
        </p>

        {/* Region selector dropdown */}
        <div className="mt-1.5 relative inline-block text-left">
          <button
            type="button"
            id="region-pill-badge"
            onClick={() => setIsRegionDropdownOpen(!isRegionDropdownOpen)}
            className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs hover:bg-blue-100/70 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>Region: {selectedRegion}</span>
            <ChevronDown className="w-3 h-3 text-blue-500 ml-0.5" />
          </button>

          {isRegionDropdownOpen && (
            <div
              id="region-dropdown-menu"
              className="absolute left-0 mt-1.5 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                Select Exploration Sector
              </div>
              {regions.map((reg) => (
                <button
                  key={reg.name}
                  onClick={() => {
                    if (onRegionChange) onRegionChange(reg.name);
                    setIsRegionDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs hover:bg-blue-50 flex flex-col transition-colors cursor-pointer ${
                    selectedRegion.includes(reg.name.split(',')[0])
                      ? 'bg-blue-50/60 font-bold text-blue-700'
                      : 'text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{reg.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{reg.area}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-normal">{reg.note}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center flex-wrap gap-2 sm:gap-2.5">
        {/* Database Status Button */}
        {onOpenDatabaseModal && (
          <button
            id="btn-database-status"
            type="button"
            onClick={onOpenDatabaseModal}
            className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 border border-emerald-200 transition-colors shadow-2xs"
            title="Open Geodatabase Management"
          >
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Central DB</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </button>
        )}

        {/* API Key Modal Button (Map + AI) */}
        <button
          id="btn-api-key-settings"
          type="button"
          onClick={() => onOpenApiKeyModal('gemini')}
          className={`cursor-pointer inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
            hasApiKey
              ? 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-300 animate-pulse'
          }`}
          title="Configure Gemini & Map API Keys"
        >
          <Key className="w-3.5 h-3.5 text-current" />
          <span className="hidden sm:inline">API Keys</span>
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              hasApiKey ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
          ></span>
        </button>

        {/* User Account / Login Button */}
        {onOpenLoginModal && (
          <button
            id="btn-header-user-login"
            type="button"
            onClick={onOpenLoginModal}
            className="cursor-pointer inline-flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/60 transition-all bg-white text-left shadow-2xs"
            title="Switch User or View Profile"
          >
            {user ? (
              <>
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-6 h-6 rounded-full object-cover border border-slate-300"
                />
                <div className="hidden lg:block leading-tight">
                  <div className="text-xs font-bold text-slate-800 truncate max-w-[120px]">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate max-w-[120px]">
                    {user.role.replace('Superintendent', 'Supt.')}
                  </div>
                </div>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-blue-600">Sign In</span>
              </>
            )}
          </button>
        )}

        {/* Analyze Area button */}
        <button
          id="btn-analyze-exploration-area"
          type="button"
          onClick={onAnalyzeClick}
          className="cursor-pointer inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold shadow-xs transition-colors"
        >
          <Play className="w-3 h-3 fill-white" />
          <span>Analyze Area</span>
        </button>

        {/* History */}
        <button
          id="btn-view-previous-analysis"
          type="button"
          onClick={onViewPreviousClick}
          className="cursor-pointer inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors py-2 px-2 rounded-lg hover:bg-slate-100"
          title="Inversion History"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden xl:inline">History</span>
        </button>
      </div>
    </header>
  );
};
