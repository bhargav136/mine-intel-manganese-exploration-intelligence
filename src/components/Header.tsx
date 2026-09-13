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
  LogOut,
  Menu,
  Download,
  FileSpreadsheet,
} from 'lucide-react';
import { getCustomApiKey } from '../lib/geminiApi';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onAnalyzeClick: () => void;
  onViewPreviousClick: () => void;
  onOpenApiKeyModal?: (tab?: 'gemini' | 'map') => void;
  onOpenLoginModal?: () => void;
  onOpenDatabaseModal?: () => void;
  selectedRegion?: string;
  onRegionChange?: (region: string) => void;
  onOpenShowcase?: () => void;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onAnalyzeClick,
  onViewPreviousClick,
  onOpenApiKeyModal,
  onOpenLoginModal,
  onOpenDatabaseModal,
  selectedRegion = 'Balaghat, Madhya Pradesh',
  onRegionChange,
  onOpenShowcase,
  onToggleSidebar,
}) => {
  const { user, logout } = useAuth();
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);

  const regions = [
    { name: 'Balaghat District, MP', area: '1,000 km²', note: 'Primary Sausar Belt Hub (Balaghat & Ukwa Mines)' },
    { name: 'Bhandara District, Maharashtra', area: '750 km²', note: 'Dongri Buzurg & Chikla Mines' },
    { name: 'Nagpur District, Maharashtra', area: '820 km²', note: 'Mansar, Kandri & Gumgaon Mines' },
    { name: 'Chhindwara District, MP', area: '600 km²', note: 'Tirodi & Sitapatore Mines' },
  ];

  const handleExportMiningData = () => {
    const csvContent = [
      'MOIL LIMITED - MINE-INTEL EXECUTIVE MINING REPORT',
      `Export Timestamp: ${new Date().toISOString()}`,
      `Selected Exploration Sector: ${selectedRegion}`,
      '',
      '--- PRODUCTION KPI SUMMARY ---',
      'Metric,Target,Actual Run-rate,Variance,Status',
      'Balaghat Flagship Sector,13200 MT/mo,10824 MT/mo,-2376 MT (-18%),CRITICAL SHORTFALL',
      'Daily Target,3500 MT/day,2750 MT/day,-750 MT/day,Excavator EX-04 Breakdown',
      'Overall Recovery Potential,+980 MT/day,Quantified Prescriptive Workorders,,RECOVERY PLAN READY',
      '',
      '--- TOP VERIFIED MANGANESE DRILL TARGETS (UNFC 111/121) ---',
      'Target ID,Location Name,Latitude,Longitude,Ore Grade (% Mn),Reserve Potential (MT),Drill Depth (m),Lithology,Status',
      'T-003,North Bharweli Extension,21.8485,80.2154,44.6%,2.45 MT,28m,Mansar Formation,Verified High Grade',
      'T-019,Waraseoni West Gondite,21.8211,80.1742,43.8%,1.82 MT,19m,Mansar Schist & Quartzite,Verified High Grade',
      'T-025,Ukwa Syncline Strike,21.9682,80.4681,42.4%,3.10 MT,34m,Chorbaoli Formation,Drilling Priority',
      'T-047,Dongri Buzurg Western Flank,21.5350,79.7120,46.2%,1.95 MT,22m,Sitasaongi Formation,Battery-Grade Braunite',
      'T-084,Mansar South Outcrop,21.3920,79.2550,41.8%,1.60 MT,26m,Mansar Formation,Verified High Grade',
      '',
      '--- AI PRESCRIPTIVE WORKORDERS ---',
      'Workorder ID,Category,Action Summary,Expected Recovery,Urgency',
      'ACT-01,Equipment Redeployment,Re-deploy 4x 50-T Dumpers from Waste Dump to South Ore Body Bench 4,+380 MT,Immediate',
      'ACT-02,Blasting Optimization,Adjust Pre-Split Blast Burden to 3.0m and Optimize Delay Timing (17ms),+220 MT,Within Shift',
      'ACT-03,Dewatering,Activate Secondary 150 HP Submersible Dewatering Pumps in Pit Sump 2,+260 MT,Immediate',
      'ACT-04,Mine Scheduling,Blend Stockpile-B Braunite Ore to Compensate Inundated Bench Runrate,+350 MT,Next 24h',
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `MOIL_MINE_INTEL_Mining_Report_${selectedRegion.split(',')[0].replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <header
      id="main-app-header"
      className="bg-white border-b border-slate-200 px-4 sm:px-6 md:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4 select-none shrink-0"
    >
      <div className="flex items-start gap-3">
        {/* Three Bars (Hamburger) Button to toggle sidebar */}
        {onToggleSidebar && (
          <button
            type="button"
            id="btn-toggle-sidebar"
            onClick={onToggleSidebar}
            className="mt-0.5 p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-colors cursor-pointer shrink-0"
            title="Toggle Sidebar (Hide / Show Dashboard)"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}

        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-sans">
              MINE-INTEL
            </h1>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-slate-100 text-slate-700 tracking-wide border border-slate-200">
              MOIL LIMITED · MINISTRY OF STEEL
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
      </div>

      <div className="flex items-center flex-wrap gap-2 sm:gap-2.5">
        {/* Export Mining Report Button */}
        <button
          id="btn-export-mining-data"
          type="button"
          onClick={handleExportMiningData}
          className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-blue-50 hover:bg-blue-100/80 text-blue-700 border border-blue-200 transition-colors shadow-2xs"
          title="Export MOIL Executive Mining Report (CSV)"
        >
          <Download className="w-3.5 h-3.5 text-blue-600" />
          <span className="font-bold">Export Report</span>
        </button>

        {/* User Account Badge */}
        {user && (
          <div
            className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50/70 text-left shadow-2xs"
            title="Active Officer Session"
          >
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
          </div>
        )}

        {/* Logout Button */}
        {user && (
          <button
            type="button"
            id="header-btn-logout"
            onClick={logout}
            className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-slate-600 hover:text-rose-700 text-xs font-semibold transition-all bg-white shadow-2xs"
            title="Log Out & Return to Login Screen"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-500" />
            <span className="hidden sm:inline">Logout</span>
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
