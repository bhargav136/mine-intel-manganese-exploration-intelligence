import React, { useState } from 'react';
import {
  Compass,
  Satellite,
  Database,
  TrendingUp,
  Brain,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Layers,
  MapPin,
  Activity,
  ShieldCheck,
  Zap,
  Server,
  CloudRain,
  Wrench,
  FileCheck,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sliders,
  HardHat,
  Cpu,
} from 'lucide-react';
import { NavigationTab } from '../types';

interface ProjectOverviewViewProps {
  onNavigateTab: (tab: NavigationTab) => void;
  appliedRecoveryMT?: number;
}

export const ProjectOverviewView: React.FC<ProjectOverviewViewProps> = ({
  onNavigateTab,
  appliedRecoveryMT = 980,
}) => {
  const [activeDataCategory, setActiveDataCategory] = useState<'inputs' | 'outputs'>('inputs');

  const inputCategories = [
    {
      category: 'Geological Data',
      badge: 'Subsurface',
      icon: <Layers className="w-5 h-5 text-blue-600" />,
      items: 'Rock type, mineral composition (braunite, pyrolusite), ore grade (% Mn), GSI geological maps & Sausar formation contacts.',
      sampleValue: 'Mansar Formation (Quartz-muscovite schist with gondite), 44.6% Mn grade',
    },
    {
      category: 'Drilling Data',
      badge: 'Core Assays',
      icon: <CrosshairIcon className="w-5 h-5 text-emerald-600" />,
      items: 'Borehole depth, drill collar GPS locations, core recovery percentage, manganese concentration by bench.',
      sampleValue: '100+ GSI & MOIL boreholes (e.g. BH-BLG-UG-102 at 85m depth, 46.8% Mn)',
    },
    {
      category: 'Historical Production',
      badge: 'Mine Telemetry',
      icon: <TrendingUp className="w-5 h-5 text-amber-600" />,
      items: 'Daily/monthly ore production tonnage, planned targets vs actual production run rates across MOIL pits.',
      sampleValue: 'Monthly Target: 13,200 MT | Actual Run Rate: 10,824 MT (Deficit: -2,376 MT)',
    },
    {
      category: 'Equipment Data',
      badge: 'HEMM Fleet',
      icon: <Wrench className="w-5 h-5 text-purple-600" />,
      items: 'Machine availability, operating hours, breakdown logs, MTBF (Mean Time Between Failures), shovel & dumper downtime.',
      sampleValue: 'Excavator EX-04 hydraulic seal failure: 45% equipment downtime in Pit Zone A',
    },
    {
      category: 'Mining Operations',
      badge: 'Pit Scheduling',
      icon: <Activity className="w-5 h-5 text-rose-600" />,
      items: 'Blasting schedules, bench excavation rates, dumper cycle times, shift logs, powder factor.',
      sampleValue: 'Blasting delayed by 24h due to excessive muck fragmentation and bench water',
    },
    {
      category: 'Weather Data',
      badge: 'IMD Radar',
      icon: <CloudRain className="w-5 h-5 text-sky-600" />,
      items: 'Rainfall (mm/24h), ambient temperature, relative humidity, monsoon forecast alerts.',
      sampleValue: '72mm localized precipitation at Balaghat pit causing haul ramp slurry slipping',
    },
    {
      category: 'Satellite Data',
      badge: 'Space Tech',
      icon: <Satellite className="w-5 h-5 text-indigo-600" />,
      items: 'ASTER SWIR (B12/B11), Sentinel-2 MSI, soil moisture, vegetation index (NDVI stress), land surface temperature (LST).',
      sampleValue: 'SWIR 1.94 (Mn-oxide absorption), NDVI 0.32 stress, LST 35.8°C thermal contrast',
    },
    {
      category: 'Location Data',
      badge: 'GIS Spatial',
      icon: <MapPin className="w-5 h-5 text-teal-600" />,
      items: 'GPS coordinates, mine boundaries (1,000 km²), digital elevation model (SRTM terrain), bench contours.',
      sampleValue: 'Balaghat Mine Concession: 21.812°N, 80.185°E | Elevation: 320m ASL',
    },
    {
      category: 'Operational Constraints',
      badge: 'Bottlenecks',
      icon: <ShieldCheck className="w-5 h-5 text-red-600" />,
      items: 'Blasting delays, transportation bottlenecks, haul road slip, pit dewatering capacity, manpower availability.',
      sampleValue: 'Pump P-03 maintenance backlog + haul ramp gradient reduction = 750 MT/day shortfall',
    },
  ];

  const outputCategories = [
    {
      title: 'Manganese Reserve Map',
      targetTab: 'command-center' as NavigationTab,
      badge: 'Interactive GIS',
      icon: <MapPin className="w-5 h-5 text-blue-600" />,
      desc: 'Predicted spatial locations and continuous 3D zones with potential manganese reserves displayed on an interactive Leaflet map.',
      stat: '82% High Confidence Zone',
    },
    {
      title: 'Reserve Estimation',
      targetTab: 'prospectivity-explorer' as NavigationTab,
      badge: 'UNFC 111/121',
      icon: <Layers className="w-5 h-5 text-emerald-600" />,
      desc: 'Estimated quantity (Million Tonnes) and metallurgical grade (% Mn) of manganese ore with 3D geological Kriging models.',
      stat: '48.6 MT Predicted (+42% vs baseline)',
    },
    {
      title: 'Production Forecast',
      targetTab: 'production-intelligence' as NavigationTab,
      badge: 'SARIMA ML',
      icon: <TrendingUp className="w-5 h-5 text-amber-600" />,
      desc: 'Expected production tonnage for upcoming days and months projected 3–4 weeks forward against the 13,200 MT monthly target.',
      stat: '10,824 MT Projected (Week 4)',
    },
    {
      title: 'Shortfall Prediction',
      targetTab: 'production-intelligence' as NavigationTab,
      badge: 'Early Warning',
      icon: <AlertTriangleIcon className="w-5 h-5 text-rose-600" />,
      desc: 'Probability and exact expected amount of production shortfall (e.g. 18% deficit / -750 MT daily) before it impacts dispatch.',
      stat: '🔴 HIGH RISK (-18% / -750 MT)',
    },
    {
      title: 'Risk Alerts',
      targetTab: 'production-intelligence' as NavigationTab,
      badge: 'Real-Time',
      icon: <CloudRain className="w-5 h-5 text-sky-600" />,
      desc: 'Automated warnings on weather risks (monsoon rainfall), equipment breakdowns, and blasting schedule delays.',
      stat: '3 Active Critical Alerts',
    },
    {
      title: 'Cause Analysis (Root-Cause AI)',
      targetTab: 'production-intelligence' as NavigationTab,
      badge: 'Multi-Factor',
      icon: <Brain className="w-5 h-5 text-purple-600" />,
      desc: 'Identifies the precise operational reasons behind predicted deficits: Equipment downtime 45% + Heavy rainfall 35% + Blasting 20%.',
      stat: 'Exact Bottleneck Pinpointed',
    },
    {
      title: 'Recommended Corrective Actions',
      targetTab: 'corrective-actions' as NavigationTab,
      badge: 'Prescriptive AI',
      icon: <Sparkles className="w-5 h-5 text-emerald-600" />,
      desc: 'Quantified instructions to recover lost production: Redeploy excavator EX-04, adjust blast timing, and activate dewatering pumps.',
      stat: `+${appliedRecoveryMT.toLocaleString()} MT Recovered (+8%)`,
    },
    {
      title: 'Interactive MOIL Dashboard',
      targetTab: 'command-center' as NavigationTab,
      badge: 'Unified View',
      icon: <Activity className="w-5 h-5 text-indigo-600" />,
      desc: 'Consolidated real-time maps, trend graphs, live alerts, and 1-click simulation for common persons and mine officers.',
      stat: '100% Cohesive Platform',
    },
  ];

  return (
    <div id="project-overview-page" className="p-6 space-y-6 max-w-[1500px] mx-auto bg-[#F8FAFC]">
      {/* Hero Banner: Clean Light Theme */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 max-w-5xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
              MOIL LIMITED · MINISTRY OF STEEL
            </span>
            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              GEO-AI MANGANESE RESERVE & PRODUCTION PLATFORM
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            MINE-INTEL: Project Overview & Complete Working Flow
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            A straightforward, data-driven platform built for MOIL Limited: <strong>Inputs = Mine + Geological + Equipment + Weather + Satellite data</strong> ➔ <strong>Outputs = Reserve Map + Production Forecast + Shortfall Alert + Corrective Action</strong>. Designed for instant clarity at a single glance.
          </p>

          {/* 4 Core Quantitative Highlights */}
          <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <div className="text-xs text-slate-500 font-semibold">Reserve Confidence</div>
              <div className="text-xl sm:text-2xl font-black text-emerald-600 font-sans mt-0.5">82% ↑</div>
              <div className="text-[10px] text-slate-400 font-medium">Predicted Reserve: 48.6 MT</div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <div className="text-xs text-slate-500 font-semibold">Monthly Target Capacity</div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 font-sans mt-0.5">13,200 T</div>
              <div className="text-[10px] text-slate-400 font-medium">Balaghat Flagship Sector</div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <div className="text-xs text-slate-500 font-semibold">Shortfall Alert (4-Wk)</div>
              <div className="text-xl sm:text-2xl font-black text-rose-600 font-sans mt-0.5">-18%</div>
              <div className="text-[10px] text-slate-400 font-medium">-750 MT/day Deficit</div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <div className="text-xs text-slate-500 font-semibold">Recovered via AI Action</div>
              <div className="text-xl sm:text-2xl font-black text-blue-600 font-sans mt-0.5">
                +{appliedRecoveryMT.toLocaleString()} MT
              </div>
              <div className="text-[10px] text-slate-400 font-medium">+8% Output Restored</div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔄 Simple Project Flow: Exactly what was analyzed for the lecturer */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              The End-to-End Project Flow (Input ➔ Model ➔ Output)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              How raw mine telemetry and satellite passes turn into actionable decisions for mine superintendents
            </p>
          </div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
            Straightforward Logic
          </span>
        </div>

        {/* Visual Step-by-Step Flow Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
          {[
            {
              step: 'Step 1',
              title: 'Multi-Source Inputs',
              desc: 'Geological, Drilling, Production, Equipment, Weather & Satellite',
              color: 'border-blue-300 bg-blue-50/50',
              badge: '9 Raw Datasets',
              icon: <Database className="w-5 h-5 text-blue-600" />,
            },
            {
              step: 'Step 2',
              title: 'Data Processing',
              desc: 'Spectral inversion, cleaning borehole logs, telemetry feature extraction',
              color: 'border-purple-300 bg-purple-50/50',
              badge: 'Feature Engineering',
              icon: <Cpu className="w-5 h-5 text-purple-600" />,
            },
            {
              step: 'Step 3',
              title: 'AI / ML Models',
              desc: '3D Spatial Kriging, SARIMA Time-Series, Multi-Factor Diagnosis',
              color: 'border-indigo-300 bg-indigo-50/50',
              badge: 'Predictive Core',
              icon: <Brain className="w-5 h-5 text-indigo-600" />,
            },
            {
              step: 'Step 4',
              title: 'Forecasts & Alerts',
              desc: 'Reserve Heatmap (82%), Shortfall Forecast (-18%), Root-Cause Pinpointing',
              color: 'border-amber-300 bg-amber-50/50',
              badge: 'Actionable Intelligence',
              icon: <TrendingUp className="w-5 h-5 text-amber-600" />,
            },
            {
              step: 'Step 5',
              title: 'Corrective Dispatch',
              desc: `Equipment redeployment, blasting reschedule, and dewatering (+${appliedRecoveryMT.toLocaleString()} MT recovered)`,
              color: 'border-emerald-300 bg-emerald-50/50',
              badge: 'Execution on Map',
              icon: <Sparkles className="w-5 h-5 text-emerald-600" />,
            },
          ].map((item, idx) => (
            <div
              key={item.step}
              className={`p-4 rounded-xl border ${item.color} flex flex-col justify-between relative group hover:shadow-sm transition-all`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                    {item.step}
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                    {item.badge}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-lg bg-white shadow-2xs border border-slate-200">
                    {item.icon}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🔹 Core Toggle: 9 Inputs vs 8 Outputs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-blue-600" />
              Detailed System Breakdown: Inputs & Outputs
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Everything the system takes in vs. everything the system provides to MOIL officers
            </p>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveDataCategory('inputs')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeDataCategory === 'inputs'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🔹 9 System Inputs
            </button>
            <button
              onClick={() => setActiveDataCategory('outputs')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeDataCategory === 'outputs'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🔹 8 System Outputs
            </button>
          </div>
        </div>

        {/* 9 Inputs Grid */}
        {activeDataCategory === 'inputs' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in duration-200">
            {inputCategories.map((item) => (
              <div
                key={item.category}
                className="bg-slate-50/70 hover:bg-white rounded-xl border border-slate-200 p-4 transition-all hover:shadow-sm hover:border-blue-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                        {item.icon}
                      </div>
                      <h4 className="text-xs font-bold text-slate-900">{item.category}</h4>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {item.badge}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed mt-2">
                    {item.items}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Live Example in Prototype:
                  </span>
                  <p className="text-[10px] text-blue-900 bg-blue-50/70 p-2 rounded border border-blue-100 font-mono">
                    {item.sampleValue}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 8 Outputs Grid */}
        {activeDataCategory === 'outputs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-200">
            {outputCategories.map((output) => (
              <div
                key={output.title}
                className="bg-slate-50/70 hover:bg-white rounded-xl border border-slate-200 p-4 transition-all hover:shadow-sm hover:border-blue-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs">
                      {output.icon}
                    </div>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {output.badge}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {output.title}
                  </h4>

                  <p className="text-[11px] text-slate-600 leading-relaxed mt-1.5 font-normal">
                    {output.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/80">
                  <div className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 mb-2 truncate">
                    {output.stat}
                  </div>
                  <button
                    onClick={() => onNavigateTab(output.targetTab)}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-white hover:bg-blue-600 text-slate-700 hover:text-white text-xs font-bold border border-slate-200 hover:border-blue-600 transition-all cursor-pointer shadow-2xs"
                  >
                    <span>View Module</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Direct Link to Big Accurate Leaflet Map */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold mb-2">
            <Satellite className="w-3.5 h-3.5 text-blue-400" />
            BIG ACCURATE LEAFLET GIS MAP
          </div>
          <h3 className="text-lg font-black text-white">
            Explore the High-Resolution Leaflet Reserve Map
          </h3>
          <p className="text-xs text-blue-200/80 mt-1 max-w-2xl">
            Inspect all MOIL borehole collars, 3D Kriging continuous reserve zones, true Esri satellite imagery, and high-grade ore bodies across Balaghat & Ukwa.
          </p>
        </div>
        <button
          onClick={() => onNavigateTab('command-center')}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0"
        >
          <span>Open Big Reserve Map</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

function CrosshairIcon(props: any) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" d="M12 3v3m0 12v3m-9-9h3m12 0h3" />
    </svg>
  );
}

function AlertTriangleIcon(props: any) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}
