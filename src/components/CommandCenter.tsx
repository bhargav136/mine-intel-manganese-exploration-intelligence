import React, { useState } from 'react';
import {
  Map as MapIcon,
  Activity,
  Target,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Sparkles,
  Wrench,
  Truck,
  CloudRain,
  ArrowRight,
  ShieldAlert,
  Satellite,
} from 'lucide-react';
import { InteractiveMap } from './InteractiveMap';
import { LeafletReserveMap } from './LeafletReserveMap';
import { TopPriorityTargets } from './TopPriorityTargets';
import { TargetDetailModal } from './TargetDetailModal';
import {
  ExplorationTarget,
  TargetCluster,
  BoreholeAssay,
} from '../types';

interface CommandCenterProps {
  targets: ExplorationTarget[];
  clusters: TargetCluster[];
  boreholeAssays: BoreholeAssay[];
  onOpenFullExplorer: () => void;
  verifiedCount: number;
  onVerifyTarget: (targetId: string) => void;
  onOpenApiKeyModal?: (tab?: 'gemini' | 'map') => void;
  onNavigateToProduction?: () => void;
  selectedRegion?: string;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  targets,
  clusters,
  boreholeAssays,
  onOpenFullExplorer,
  verifiedCount,
  onVerifyTarget,
  onOpenApiKeyModal,
  onNavigateToProduction,
  selectedRegion = 'Balaghat, Madhya Pradesh',
}) => {
  const [selectedTarget, setSelectedTarget] = useState<ExplorationTarget | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [mapEngine, setMapEngine] = useState<'leaflet' | 'schematic'>('leaflet');

  const handleSelectCluster = (cluster: TargetCluster) => {
    if (cluster.primaryTargetId) {
      const found = targets.find((t) => t.id === cluster.primaryTargetId);
      if (found) {
        setSelectedTarget(found);
      }
    }
  };

  const handleSelectTarget = (target: ExplorationTarget) => {
    setSelectedTarget(target);
  };

  const handleOpenTargetDetail = (target: ExplorationTarget) => {
    setSelectedTarget(target);
    setIsModalOpen(true);
  };

  const currentAssay = selectedTarget
    ? boreholeAssays.find((b) => b.targetId === selectedTarget.id)
    : undefined;

  return (
    <div id="command-center-view" className="p-6 space-y-4 max-w-[1600px] mx-auto">
      {/* Yellow Warning Banner */}
      <div
        id="demo-alert-banner"
        className="bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between shadow-2xs"
      >
        <div className="flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-[#D97706] shrink-0" />
          <span>
            MOIL AI MINING INTELLIGENCE: Live multi-satellite synthesis, SARIMA shortfall forecasting & prescriptive dispatch optimization.
          </span>
        </div>
        <span className="hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          BALAGHAT SAUSAR BELT
        </span>
      </div>

      {/* 5 Hackathon Executive KPI Cards */}
      <div
        id="kpi-metrics-row"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5"
      >
        {/* 1. Reserve Potential */}
        <div
          id="kpi-reserve-potential"
          className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between group hover:border-emerald-300 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Reserve Potential
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
              🛰️ Space AI
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black tracking-tight text-slate-900 font-sans">
              82%
            </span>
            <span className="text-xs font-extrabold text-emerald-600 flex items-center">
              &uarr; High
            </span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-medium truncate">
            NDVI + Soil Moisture + Kriging
          </div>
        </div>

        {/* 2. Expected Production */}
        <div
          id="kpi-expected-production"
          className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between group hover:border-blue-300 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Expected Production
            </span>
            <Activity className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-black tracking-tight text-slate-900 font-sans">
              12,450
            </span>
            <span className="text-xs font-bold text-slate-500">T / mo</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-medium truncate">
            Monthly Target: 13,200 T
          </div>
        </div>

        {/* 3. Production Shortfall Risk */}
        <div
          id="kpi-shortfall-risk"
          className="bg-white rounded-xl border border-rose-200/90 p-4 shadow-xs flex flex-col justify-between bg-rose-50/20 group hover:border-rose-400 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-700">
              Shortfall Risk
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-black px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping" />
              🔴 HIGH
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-black tracking-tight text-rose-600 font-sans">
              -18%
            </span>
            <span className="text-xs font-bold text-rose-500">(-750 MT)</span>
          </div>
          <div className="text-[10px] text-rose-600/90 mt-1 font-semibold truncate">
            ⚠️ 3-Week Forecast Deficit
          </div>
        </div>

        {/* 4. Equipment Availability */}
        <div
          id="kpi-equipment-availability"
          className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between group hover:border-amber-300 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Equipment Availability
            </span>
            <Wrench className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-black tracking-tight text-slate-900 font-sans">
              76%
            </span>
            <span className="text-xs font-bold text-amber-600">Available</span>
          </div>
          <div className="text-[10px] text-amber-700 mt-1 font-medium truncate">
            EX-04 Shovel Outage (Bench 4)
          </div>
        </div>

        {/* 5. Field Verified Targets */}
        <div
          id="kpi-field-verified"
          className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between group hover:border-emerald-300 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Field Verified
            </span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-black tracking-tight text-slate-900 font-sans">
              {verifiedCount}
            </span>
            <span className="text-xs font-bold text-slate-500">/ 100 Targets</span>
          </div>
          <div className="text-[10px] text-emerald-700 mt-1 font-semibold truncate">
            1,000 km² Sausar Formation
          </div>
        </div>
      </div>

      {/* 🧠 Root-Cause AI & 🎯 Prescriptive Action Recommendation Hero */}
      <div
        id="root-cause-decision-hero"
        className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-2xl border border-blue-900/60 p-5 text-white shadow-xl relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          {/* Left: Root-Cause AI Diagnostic */}
          <div className="space-y-2 lg:max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-400/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                ⚠️ Production Shortfall Predictor (-18%)
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30">
                🧠 Root-Cause AI
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex flex-wrap items-center gap-2">
              <span className="text-rose-400 font-extrabold">High Shortfall Risk</span>
              <span className="text-slate-400">&rarr;</span>
              <span className="text-amber-300 font-bold">
                Equipment Downtime 45% + Heavy Rainfall Forecast (72mm)
              </span>
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Multi-Layer Diagnostic:</strong> GPM monsoon radar detects deep convective rain band reaching Balaghat within 36 hours. Simultaneous hydraulic pump failure on shovel <span className="font-mono text-amber-300">EX-04</span> at Bench 4 restricts pit hauling throughput by <strong>750 MT/day</strong>.
            </p>
          </div>

          {/* Right: AI Action Recommendation */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 lg:w-96 shrink-0 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                🎯 AI Action Recommendation
              </span>
              <span className="text-[10px] font-black text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-400/30">
                +8% Recovery (+980 MT)
              </span>
            </div>

            <p className="text-xs text-slate-100 font-medium leading-relaxed">
              &ldquo;Move excavator <strong className="text-amber-300">EX-04 to Mine Zone B</strong> &rarr; reschedule blasting by 1 day &rarr; engage auxiliary dewatering pump P-03 to protect high-grade ore faces.&rdquo;
            </p>

            <button
              id="btn-apply-recommendation-hero"
              type="button"
              onClick={onNavigateToProduction || onOpenFullExplorer}
              className="w-full flex items-center justify-center gap-2 py-2 px-3.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 text-xs font-black transition-all shadow-md cursor-pointer group"
            >
              <span>Simulate & Recover Shortfall</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Map Engine Switcher Bar */}
      <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <MapIcon className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-bold text-slate-800">Manganese Reserve GIS Visualizer:</span>
        </div>
        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setMapEngine('leaflet')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
              mapEngine === 'leaflet'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Satellite className="w-3.5 h-3.5" />
            <span>Big Leaflet GIS Satellite Map (Recommended)</span>
          </button>
          <button
            onClick={() => setMapEngine('schematic')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
              mapEngine === 'schematic'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Regional Sector Schematic</span>
          </button>
        </div>
      </div>

      {/* Main Map View based on MapEngine selection */}
      {mapEngine === 'leaflet' ? (
        <div className="space-y-4">
          <LeafletReserveMap
            selectedTarget={selectedTarget}
            onSelectTarget={handleSelectTarget}
            selectedRegion={selectedRegion}
          />

          {/* Bottom Table of Top Targets under Big Map */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Top Priority Manganese Exploration Targets (100 Targets Evaluated)
                </h4>
              </div>
              <button
                onClick={onOpenFullExplorer}
                className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Open Full Explorer &rarr;
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {targets.slice(0, 4).map((target) => (
                <div
                  key={target.id}
                  onClick={() => handleSelectTarget(target)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedTarget?.id === target.id
                      ? 'border-blue-500 bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black text-slate-900">{target.id}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {target.estimatedGradeMn}% Mn
                    </span>
                  </div>
                  <div className="text-xs text-slate-700 font-semibold truncate">{target.locationName}</div>
                  <div className="text-[10px] text-slate-500 mt-1 flex justify-between">
                    <span>Reserve: {(target.estimatedReserveMT / 1000000).toFixed(1)} MT</span>
                    <span>Depth: {target.depthMeters}m</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          <div className="lg:col-span-8 min-h-[520px]">
            <InteractiveMap
              clusters={clusters}
              selectedTarget={selectedTarget}
              onSelectCluster={handleSelectCluster}
              onSelectTarget={handleSelectTarget}
              onOpenFullExplorer={onOpenFullExplorer}
              targets={targets}
              onOpenApiKeyModal={onOpenApiKeyModal}
            />
          </div>
          <div className="lg:col-span-4 min-h-[520px]">
            <TopPriorityTargets
              targets={targets}
              selectedTarget={selectedTarget}
              onSelectTarget={handleSelectTarget}
              onOpenTargetDetail={handleOpenTargetDetail}
            />
          </div>
        </div>
      )}

      {/* Target Detail Modal */}
      {isModalOpen && selectedTarget && (
        <TargetDetailModal
          target={selectedTarget}
          onClose={() => setIsModalOpen(false)}
          boreholeAssay={currentAssay}
          onVerifyTarget={onVerifyTarget}
        />
      )}
    </div>
  );
};
