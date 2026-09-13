import React from 'react';
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
} from 'lucide-react';
import { NavigationTab } from '../types';

interface ProjectOverviewViewProps {
  onNavigateTab: (tab: NavigationTab) => void;
}

export const ProjectOverviewView: React.FC<ProjectOverviewViewProps> = ({ onNavigateTab }) => {
  const workflowSteps = [
    {
      step: '01',
      title: 'Satellite-Based Multi-Spectral Prospecting',
      subtitle: 'Space-Borne Remote Sensing Inversion',
      icon: <Satellite className="w-5 h-5 text-blue-600" />,
      color: 'blue',
      badge: 'Space Tech',
      description:
        'Uses ASTER SWIR (B12/B11 ratio), Sentinel-2 MSI, NDVI vegetative stress anomalies, and Land Surface Temperature (LST) across 1,000 km² in Balaghat to identify oxidized manganese horizons hidden beneath soil cover.',
      actionLabel: 'Launch Spectral Scanner',
      targetTab: 'analyze-area' as NavigationTab,
      tags: ['ASTER SWIR', 'Sentinel-2', 'NDVI Stress', 'LST Heatmap', 'SRTM Terrain'],
    },
    {
      step: '02',
      title: 'AI Continuous Reserve Prediction & Kriging',
      subtitle: 'Geological Core + Space Data Synthesis',
      icon: <Layers className="w-5 h-5 text-emerald-600" />,
      color: 'emerald',
      badge: 'AI Kriging',
      description:
        'Merges 100+ GSI borehole core assays and aeromagnetic fault lineaments with satellite spectral indices to predict 3D continuous reserve heatmaps, achieving 82% reserve confidence rather than relying only on isolated drill holes.',
      actionLabel: 'Explore Prospectivity Grid',
      targetTab: 'prospectivity-explorer' as NavigationTab,
      tags: ['3D Kriging', 'Borehole Assays', 'Braunite Strike', '82% Confidence'],
    },
    {
      step: '03',
      title: 'Predictive Production Shortfall Engine',
      subtitle: 'SARIMA Machine Learning Forecast',
      icon: <TrendingUp className="w-5 h-5 text-amber-600" />,
      color: 'amber',
      badge: 'Predictive ML',
      description:
        'Continuously models mine haulage against the 13,200 MT monthly target. Projects operational gaps 3 to 4 weeks ahead (e.g. -18% shortfall / -750 MT deficit) based on pit equipment downtime, monsoon rainfall radar, and blasting cycles.',
      actionLabel: 'View Shortfall Simulator',
      targetTab: 'production-intelligence' as NavigationTab,
      tags: ['SARIMA Model', '4-Week Lookahead', '-18% Risk Alert', 'Monsoon Radar'],
    },
    {
      step: '04',
      title: 'Root-Cause AI Diagnostic Engine',
      subtitle: 'Multi-Factor Bottleneck Attribution',
      icon: <Brain className="w-5 h-5 text-purple-600" />,
      color: 'purple',
      badge: 'Root-Cause AI',
      description:
        'Explains the exact operational drivers behind predicted deficits instead of generic alarms: "High shortfall risk → Equipment downtime 45% (EX-04 Shovel hydraulic seal failure) + Heavy rainfall forecast (72mm in Balaghat pit)."',
      actionLabel: 'Review Diagnostic Details',
      targetTab: 'production-intelligence' as NavigationTab,
      tags: ['Downtime 45%', '72mm Rain Forecast', 'EX-04 Shovel', 'Pit Dewatering'],
    },
    {
      step: '05',
      title: 'Prescriptive AI Action Recommendations',
      subtitle: 'Autonomous Dispatch Optimization',
      icon: <Sparkles className="w-5 h-5 text-emerald-600" />,
      color: 'emerald',
      badge: 'Prescriptive AI',
      description:
        'Generates quantified corrective instructions to eliminate deficits: "Redeploy excavator EX-04 to Mine Zone B → shift blasting schedule by 24h → engage auxiliary pump P-03 → recovers +8% planned production (+980 MT)."',
      actionLabel: 'Apply Corrective Actions',
      targetTab: 'corrective-actions' as NavigationTab,
      tags: ['Zone B Redeployment', '+8% Recovery', '+980 MT Saved', 'Zero Blasting Halt'],
    },
    {
      step: '06',
      title: 'Central Cloud Geodatabase Synchronization',
      subtitle: 'MongoDB Atlas Enterprise Data Fabric',
      icon: <Database className="w-5 h-5 text-blue-600" />,
      color: 'blue',
      badge: 'MongoDB Atlas',
      description:
        'Persistently synchronizes all geological borehole logs, registered exploration officers, AI inversion runs, and DGMS safety compliance audit records in a real-time cloud database cluster.',
      actionLabel: 'Manage Cloud Database',
      targetTab: 'data-health' as NavigationTab,
      tags: ['MongoDB Atlas', 'Real-Time Sync', 'DGMS Compliance', 'Audit Trail'],
    },
  ];

  return (
    <div id="project-overview-page" className="p-6 space-y-6 max-w-[1500px] mx-auto bg-[#F8FAFC]">
      {/* Hero Banner: Clean Light Theme with Professional Blue Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="relative z-10 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
              MOIL LIMITED · MINISTRY OF STEEL
            </span>
            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              SIH26009 NATIONAL AI PLATFORM
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            MINE-INTEL: End-to-End Operational Architecture & Working Flow
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            An integrated satellite remote sensing, machine learning reserve kriging, and predictive mine dispatch infrastructure built for MOIL to eliminate exploration guesswork and recover <strong>up to 750 MT/day</strong> in production shortfalls.
          </p>

          {/* Quick Stat Highlights */}
          <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <div className="text-xs text-slate-500 font-semibold">Reserve Potential</div>
              <div className="text-xl sm:text-2xl font-black text-emerald-600 font-sans mt-0.5">82% &uarr;</div>
              <div className="text-[10px] text-slate-400 font-medium">NDVI + SWIR Inversion</div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <div className="text-xs text-slate-500 font-semibold">Target Production</div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 font-sans mt-0.5">13,200 T</div>
              <div className="text-[10px] text-slate-400 font-medium">Monthly Mine Capacity</div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <div className="text-xs text-slate-500 font-semibold">Shortfall Predictor</div>
              <div className="text-xl sm:text-2xl font-black text-rose-600 font-sans mt-0.5">-18%</div>
              <div className="text-[10px] text-slate-400 font-medium">4-Week Lookahead</div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <div className="text-xs text-slate-500 font-semibold">AI Action Recovery</div>
              <div className="text-xl sm:text-2xl font-black text-blue-600 font-sans mt-0.5">+980 MT</div>
              <div className="text-[10px] text-slate-400 font-medium">+8% Output Recovered</div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Workflow Flowchart */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Complete System Working Flow (From Orbit to Pit Face)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Click on any phase below to immediately jump into that module in the live application
            </p>
          </div>
          <span className="text-xs font-bold text-slate-400 hidden sm:inline">6 Connected Stages</span>
        </div>

        {/* 6 Connected Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {workflowSteps.map((stepItem, idx) => (
            <div
              key={stepItem.step}
              className="bg-slate-50/70 hover:bg-white rounded-xl border border-slate-200 p-5 transition-all hover:shadow-md hover:border-blue-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-7 h-7 rounded-lg bg-blue-100/80 text-blue-700 font-black text-xs flex items-center justify-center font-mono">
                    {stepItem.step}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white text-slate-700 border border-slate-200 shadow-2xs">
                    {stepItem.badge}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 mb-2">
                  <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs">
                    {stepItem.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {stepItem.title}
                    </h3>
                    <div className="text-[10px] font-semibold text-slate-500">
                      {stepItem.subtitle}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mt-2.5 font-normal">
                  {stepItem.description}
                </p>

                {/* Technical Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-200/60">
                  {stepItem.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded text-[10px] font-medium bg-white text-slate-600 border border-slate-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigateTab(stepItem.targetTab)}
                className="mt-4 w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white hover:bg-blue-50 text-blue-700 hover:text-blue-800 text-xs font-bold border border-slate-200 hover:border-blue-300 transition-all cursor-pointer shadow-2xs group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600"
              >
                <span>{stepItem.actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* The 5 Key Differentiators Comparison Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          Why MINE-INTEL Wins: Traditional Mining vs. Our AI Platform
        </h2>
        <p className="text-xs text-slate-500 mb-5">
          How our 5 core pillars solve the real-world operational bottlenecks faced by MOIL Limited
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-3.5 rounded-l-lg">Core Pillar</th>
                <th className="p-3.5">Conventional MOIL Operations</th>
                <th className="p-3.5 text-blue-700 bg-blue-50/50">MINE-INTEL AI Solution</th>
                <th className="p-3.5 rounded-r-lg">Measured Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2">
                  <Satellite className="w-4 h-4 text-blue-600" />
                  Satellite Prospecting
                </td>
                <td className="p-3.5 text-slate-600">Manual geological surface traverses; blind exploratory drilling.</td>
                <td className="p-3.5 font-semibold text-blue-700 bg-blue-50/30">
                  Automated ASTER SWIR (B12/B11), Sentinel-2, NDVI vegetative stress, and LST mapping.
                </td>
                <td className="p-3.5 font-bold text-emerald-600">70% reduction in blind drilling costs</td>
              </tr>

              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  AI Reserve Kriging
                </td>
                <td className="p-3.5 text-slate-600">Isolated 2D drill points without spatial continuity.</td>
                <td className="p-3.5 font-semibold text-blue-700 bg-blue-50/30">
                  Continuous 3D probabilistic reserve heatmaps with 82% confidence scores.
                </td>
                <td className="p-3.5 font-bold text-emerald-600">82% reserve confidence model</td>
              </tr>

              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-600" />
                  Shortfall Predictor
                </td>
                <td className="p-3.5 text-slate-600">Reactive reporting after end-of-month deficit occurs.</td>
                <td className="p-3.5 font-semibold text-blue-700 bg-blue-50/30">
                  4-week forward SARIMA forecasting predicting exact daily deficit (-18% / -750 MT).
                </td>
                <td className="p-3.5 font-bold text-amber-600">21-day advance bottleneck warning</td>
              </tr>

              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-600" />
                  Root-Cause AI
                </td>
                <td className="p-3.5 text-slate-600">Ambiguous downtime logs without actionable multi-variable insight.</td>
                <td className="p-3.5 font-semibold text-blue-700 bg-blue-50/30">
                  Synthesizes weather radar (72mm rain) with telemetry (EX-04 45% pump downtime).
                </td>
                <td className="p-3.5 font-bold text-purple-600">Instant bottleneck pinpointing</td>
              </tr>

              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Prescriptive Recommendations
                </td>
                <td className="p-3.5 text-slate-600">Manual superintendent guessing under pressure.</td>
                <td className="p-3.5 font-semibold text-blue-700 bg-blue-50/30">
                  Automated instructions: &ldquo;Move EX-04 to Zone B &rarr; shift blasting by 1 day &rarr; engage P-03.&rdquo;
                </td>
                <td className="p-3.5 font-bold text-emerald-600">+8% output recovery (+980 MT)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
