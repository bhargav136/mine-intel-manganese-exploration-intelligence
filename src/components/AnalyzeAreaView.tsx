import React, { useState } from 'react';
import {
  Satellite,
  Layers,
  Thermometer,
  CloudRain,
  Compass,
  Sparkles,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { InfoTooltip } from './InfoTooltip';

export const AnalyzeAreaView: React.FC<{ onRunScan: () => void }> = ({ onRunScan }) => {
  const [activeLayer, setActiveLayer] = useState<
    'true-color' | 'ndvi' | 'lst' | 'soil-moisture' | 'swir-ratio' | 'aeromagnetic'
  >('swir-ratio');
  const [opacity, setOpacity] = useState<number>(85);

  return (
    <div id="analyze-area-view" className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Satellite className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Space Technology & Multispectral Remote Sensing
              </h2>
              <p className="text-xs text-slate-500">
                Balaghat Manganese Belt · Sentinel-2, Landsat-9 TIR, and Sentinel-1 SAR Fusion
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onRunScan}
          className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          <span>Trigger New AI Satellite Inversion</span>
        </button>
      </div>

      {/* Grid: Left Controls & Layer Switcher, Right Satellite Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Layer Switcher */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-700" />
              Earth Observation Layers
            </h3>

            <div className="space-y-1.5">
              {[
                {
                  id: 'swir-ratio',
                  name: 'SWIR Band 11 / 12 Mineral Ratio',
                  desc: 'Diagnostic absorption for Manganese pyrolusite & braunite',
                  source: 'Sentinel-2 MSI (10m)',
                  color: 'text-purple-600',
                  bg: 'bg-purple-50',
                  termKey: 'swir',
                },
                {
                  id: 'ndvi',
                  name: 'NDVI (Vegetation Index)',
                  desc: 'Vegetation stress over manganese gossan outcrops',
                  source: 'Sentinel-2 (10m)',
                  color: 'text-emerald-600',
                  bg: 'bg-emerald-50',
                  termKey: 'ndvi',
                },
                {
                  id: 'lst',
                  name: 'Land Surface Temp (LST)',
                  desc: 'Thermal inertia contrast indicating shallow ore bodies',
                  source: 'Landsat-9 TIR (30m)',
                  color: 'text-amber-600',
                  bg: 'bg-amber-50',
                  termKey: 'lst',
                },
                {
                  id: 'soil-moisture',
                  name: 'Soil Moisture & SAR Roughness',
                  desc: 'Surface dielectric constant & moisture filtering',
                  source: 'Sentinel-1 C-Band SAR',
                  color: 'text-blue-600',
                  bg: 'bg-blue-50',
                  termKey: 'soilMoisture',
                },
                {
                  id: 'aeromagnetic',
                  name: 'Aeromagnetic & Bouguer Gravity',
                  desc: 'Subsurface structural faults & Sausar gondite trends',
                  source: 'GSI Airborne Survey',
                  color: 'text-rose-600',
                  bg: 'bg-rose-50',
                  termKey: 'magneticAnomaly',
                },
                {
                  id: 'true-color',
                  name: 'High-Res Optical True Color',
                  desc: 'Baseline visual topography & open pit benches',
                  source: 'Sentinel-2 RGB',
                  color: 'text-slate-600',
                  bg: 'bg-slate-100',
                  tooltipText: 'Natural true-color satellite imagery combining red, green, and blue spectral bands.',
                },
              ].map((layer) => {
                const isSelected = activeLayer === layer.id;
                return (
                  <div
                    key={layer.id}
                    onClick={() => setActiveLayer(layer.id as any)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/50 shadow-2xs'
                        : 'border-slate-200/80 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 flex items-center">
                        <span>{layer.name}</span>
                        <InfoTooltip termKey={layer.termKey} text={layer.tooltipText} position="top" />
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {layer.desc}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[10px]">
                      <span className="font-semibold text-slate-400">
                        Source: {layer.source}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Layer Opacity Slider */}
            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-600 mb-1 font-medium">
                <span className="flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5" /> Spectral Overlay Opacity
                </span>
                <span className="font-bold">{opacity}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Mineral Spectral Absorption Guide */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs text-xs space-y-2">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-purple-600" />
              Manganese Spectral Absorption Signatures
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Pyrolusite (MnO₂) and Braunite (3Mn₂O₃·MnSiO₃) exhibit marked
              spectral reflectance dips in SWIR at <strong>2.20 µm</strong> and{' '}
              <strong>2.32 µm</strong> due to crystal field transitions of Mn³⁺ ions,
              differentiating them from surrounding muscovite schists.
            </p>
          </div>
        </div>

        {/* Right Satellite Viewer Visualizer */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col h-[580px]">
            <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800">
                  Active Layer:{' '}
                  <span className="text-blue-600 uppercase">
                    {activeLayer.replace('-', ' ')}
                  </span>
                </span>
                <span className="text-xs text-slate-400 ml-2">
                  (Overlay Opacity: {opacity}%)
                </span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Cloud Cover: 4.2% (Pass Validated)
              </span>
            </div>

            {/* Satellite Canvas Visualization */}
            <div className="flex-1 relative bg-slate-900 overflow-hidden flex items-center justify-center">
              {/* Simulated False-Color Satellite Matrix based on active layer */}
              <svg
                className="w-full h-full absolute inset-0"
                viewBox="0 0 800 500"
                preserveAspectRatio="none"
              >
                <defs>
                  {/* Radial Heatmap Gradients */}
                  <radialGradient id="mn-anomaly-1" cx="45%" cy="35%" r="30%">
                    <stop
                      offset="0%"
                      stopColor={
                        activeLayer === 'swir-ratio'
                          ? '#D946EF'
                          : activeLayer === 'ndvi'
                          ? '#10B981'
                          : activeLayer === 'lst'
                          ? '#EF4444'
                          : '#3B82F6'
                      }
                      stopOpacity={opacity / 100}
                    />
                    <stop offset="60%" stopColor="#F59E0B" stopOpacity={(opacity / 100) * 0.5} />
                    <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
                  </radialGradient>

                  <radialGradient id="mn-anomaly-2" cx="65%" cy="55%" r="25%">
                    <stop
                      offset="0%"
                      stopColor={
                        activeLayer === 'swir-ratio'
                          ? '#EC4899'
                          : activeLayer === 'ndvi'
                          ? '#059669'
                          : '#DC2626'
                      }
                      stopOpacity={opacity / 100}
                    />
                    <stop offset="70%" stopColor="#D97706" stopOpacity={(opacity / 100) * 0.4} />
                    <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Base Dark Satellite Imagery / Terrain */}
                <rect width="800" height="500" fill="#1E293B" />
                <path
                  d="M 0,200 Q 200,150 400,240 T 800,220 L 800,500 L 0,500 Z"
                  fill="#0F172A"
                  opacity="0.8"
                />

                {/* Wainganga River Hydrology Line */}
                <path
                  d="M 320,0 Q 360,180 390,320 T 440,500"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="3"
                  opacity="0.7"
                />

                {/* Active Spectral Anomaly Highlights */}
                <rect width="800" height="500" fill="url(#mn-anomaly-1)" />
                <rect width="800" height="500" fill="url(#mn-anomaly-2)" />

                {/* Sausar Structural Lineaments (N65°E strike) */}
                <line
                  x1="180"
                  y1="280"
                  x2="650"
                  y2="120"
                  stroke="#F8FAFC"
                  strokeWidth="1.5"
                  strokeDasharray="5,5"
                  opacity="0.6"
                />
                <line
                  x1="220"
                  y1="340"
                  x2="700"
                  y2="180"
                  stroke="#F8FAFC"
                  strokeWidth="1.5"
                  strokeDasharray="5,5"
                  opacity="0.6"
                />

                {/* Callout markers for key targets */}
                <g className="font-sans text-[11px] font-bold fill-white">
                  <circle cx="360" cy="180" r="4" fill="#F43F5E" />
                  <text x="370" y="185" fill="#FDA4AF">
                    T-003 (SWIR Peak: 1.94)
                  </text>

                  <circle cx="520" cy="280" r="4" fill="#F43F5E" />
                  <text x="530" y="285" fill="#FDA4AF">
                    T-084 (Thermal Inertia Anomaly)
                  </text>

                  <circle cx="280" cy="220" r="4" fill="#F43F5E" />
                  <text x="290" y="225" fill="#FDA4AF">
                    T-019 (Gondite Contact)
                  </text>
                </g>
              </svg>

              {/* Spectral Legend overlay inside canvas */}
              <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md p-3 rounded-lg border border-slate-700 text-[11px] text-white space-y-1">
                <div className="font-bold text-amber-300">Spectral Intensity</div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2.5 rounded bg-gradient-to-r from-blue-600 via-amber-500 to-pink-500"></div>
                  <span className="text-[10px] text-slate-300">Low &rarr; Extreme</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
