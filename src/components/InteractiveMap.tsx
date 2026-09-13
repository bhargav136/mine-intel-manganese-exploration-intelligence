import React, { useState, useEffect } from 'react';
import { Plus, Minus, Layers, Key, MapPin, Eye, Satellite } from 'lucide-react';
import { TargetCluster, ExplorationTarget } from '../types';

interface InteractiveMapProps {
  clusters: TargetCluster[];
  selectedTarget: ExplorationTarget | null;
  onSelectCluster: (cluster: TargetCluster) => void;
  onSelectTarget: (target: ExplorationTarget) => void;
  onOpenFullExplorer: () => void;
  targets: ExplorationTarget[];
  onOpenApiKeyModal?: (tab?: 'gemini' | 'map') => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  clusters,
  selectedTarget,
  onSelectCluster,
  onSelectTarget,
  onOpenFullExplorer,
  targets,
  onOpenApiKeyModal,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [hoveredCluster, setHoveredCluster] = useState<TargetCluster | null>(null);
  const [mapLayer, setMapLayer] = useState<'spectral' | 'google-satellite' | 'geological' | 'lineaments'>('spectral');
  const [hasMapKey, setHasMapKey] = useState(false);

  useEffect(() => {
    const key = localStorage.getItem('mine_intel_google_maps_key') || '';
    setHasMapKey(!!key);
  }, []);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 2.0));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.8));
  };

  return (
    <div
      id="regional-overview-card"
      className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col h-full"
    >
      {/* Card Header */}
      <div className="px-5 py-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Regional Overview: Prospectivity Map
            </h3>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
              SIH26009 ASTER SWIR
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Balaghat, MP · 1,000 km² · Mansar & Tirodi Formation Contacts
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Map Layer Switcher */}
          <select
            value={mapLayer}
            onChange={(e: any) => setMapLayer(e.target.value)}
            className="cursor-pointer text-[11px] font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg px-2.5 py-1 focus:outline-none"
            title="Switch Map Satellite Layer"
          >
            <option value="spectral">ASTER Band 12/11 (Mn-Oxides)</option>
            <option value="google-satellite">Google Maps / ESRI True Satellite</option>
            <option value="geological">GSI Gondite & Quartzite Contact</option>
            <option value="lineaments">Aeromagnetic Fault Lineaments</option>
          </select>

          {/* Map API Key button */}
          {onOpenApiKeyModal && (
            <button
              id="btn-map-api-key"
              type="button"
              onClick={() => onOpenApiKeyModal('map')}
              className={`cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                hasMapKey
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/80'
              }`}
              title="Configure Google Maps or Mapbox API Key"
            >
              <Key className="w-3 h-3 text-indigo-600" />
              <span>Map Key</span>
              {hasMapKey && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
            </button>
          )}

          <button
            id="btn-full-explorer"
            onClick={onOpenFullExplorer}
            className="cursor-pointer text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors py-1 px-2.5 rounded-md hover:bg-blue-50"
          >
            Full Explorer &rarr;
          </button>
        </div>
      </div>

      {/* Map Display Container */}
      <div className="relative flex-1 min-h-[460px] bg-[#E5ECE3] overflow-hidden select-none">
        {/* Zoom Controls */}
        <div className="absolute top-3 left-3 z-20 flex flex-col bg-white rounded-md shadow-md border border-slate-200 overflow-hidden">
          <button
            id="map-zoom-in-btn"
            onClick={handleZoomIn}
            className="p-1.5 hover:bg-slate-100 text-slate-700 transition-colors border-b border-slate-200"
            title="Zoom in"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            id="map-zoom-out-btn"
            onClick={handleZoomOut}
            className="p-1.5 hover:bg-slate-100 text-slate-700 transition-colors"
            title="Zoom out"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Scalable Map Canvas */}
        <div
          className="w-full h-full relative transition-transform duration-300 ease-out origin-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* SVG Map Base Layer: Topography, Drainage & Roads */}
          <svg
            className="w-full h-full absolute inset-0 pointer-events-none"
            viewBox="0 0 1000 700"
            preserveAspectRatio="none"
          >
            <defs>
              {/* Forest / Hill Patches */}
              <pattern
                id="forest-pattern"
                width="30"
                height="30"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="5" cy="5" r="4" fill="#B9CEB4" opacity="0.6" />
                <circle cx="20" cy="18" r="6" fill="#A8C4A2" opacity="0.7" />
                <circle cx="25" cy="8" r="3" fill="#B9CEB4" opacity="0.5" />
              </pattern>
            </defs>

            {/* Background terrain base */}
            <rect width="1000" height="700" fill="#E4EDE2" />

            {/* Highland & Forest Patches (Balaghat Satpura ranges) */}
            <path
              d="M 100,0 Q 250,80 400,40 T 700,20 Q 880,90 1000,30 L 1000,0 Z"
              fill="#D5E4D1"
            />
            <path
              d="M 680,200 Q 820,280 920,420 T 1000,600 L 1000,100 Z"
              fill="#D8E7D4"
            />
            <path
              d="M 0,350 Q 80,480 180,520 T 260,700 L 0,700 Z"
              fill="#DAE8D6"
            />

            {/* Wainganga River & Tributaries (blue hydrology lines) */}
            <path
              d="M 390,0 Q 420,120 440,240 T 450,380 Q 430,480 480,590 T 520,700"
              fill="none"
              stroke="#97BEE3"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M 280,180 Q 360,210 430,250"
              fill="none"
              stroke="#B3D1EE"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M 610,140 Q 530,280 450,360"
              fill="none"
              stroke="#B3D1EE"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M 460,450 Q 560,490 640,580"
              fill="none"
              stroke="#B3D1EE"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Road Networks (light gray/tan lines) */}
            <path
              d="M 80,420 Q 280,390 470,410 T 820,440"
              fill="none"
              stroke="#CBD5E1"
              strokeWidth="2"
              strokeDasharray="6,4"
            />
            <path
              d="M 470,410 Q 510,210 530,30"
              fill="none"
              stroke="#CBD5E1"
              strokeWidth="2"
              strokeDasharray="6,4"
            />
            <path
              d="M 470,410 Q 430,550 420,700"
              fill="none"
              stroke="#CBD5E1"
              strokeWidth="2"
              strokeDasharray="6,4"
            />
            <path
              d="M 240,680 Q 350,560 470,410"
              fill="none"
              stroke="#CBD5E1"
              strokeWidth="1.8"
            />

            {/* 1,000 km² Exploration Boundary (Dashed Blue Line, matches screenshot) */}
            <polygon
              points="310,60 580,60 690,670 290,670"
              fill="#2563EB"
              fillOpacity="0.04"
              stroke="#2563EB"
              strokeWidth="2.5"
              strokeDasharray="8,6"
            />

            {/* Geographic Labels (Towns & Mine Sites) */}
            <g className="font-sans font-medium text-[11px] fill-slate-600 select-none">
              <text x="465" y="395" fontWeight="bold" fill="#1E293B" fontSize="13">
                Balaghat
              </text>
              <circle cx="458" cy="392" r="3" fill="#1E293B" />

              <text x="350" y="540" fontWeight="600" fill="#334155" fontSize="11">
                Waraseoni
              </text>
              <circle cx="344" cy="537" r="2.5" fill="#475569" />

              <text x="210" y="515" fontWeight="600" fill="#475569" fontSize="11">
                Katangi
              </text>
              <circle cx="204" cy="512" r="2.5" fill="#475569" />

              <text x="510" y="40" fontWeight="600" fill="#475569" fontSize="11">
                Baihar
              </text>

              <text x="540" y="300" fontWeight="600" fill="#1D4ED8" fontSize="11">
                ★ Bharweli (MOIL)
              </text>

              <text x="630" y="240" fontWeight="500" fill="#475569" fontSize="10">
                Ukwa Belt
              </text>

              <text x="315" y="380" fontWeight="400" fill="#64748B" fontSize="10">
                Lalburra
              </text>
            </g>
          </svg>

          {/* Interactive Target Clusters (Red / Amber Badges matching screenshot) */}
          {clusters.map((cluster) => {
            const isHovered = hoveredCluster?.id === cluster.id;
            const isSelected =
              selectedTarget &&
              cluster.primaryTargetId === selectedTarget.id;

            return (
              <div
                key={cluster.id}
                id={`cluster-badge-${cluster.id}`}
                onClick={() => {
                  onSelectCluster(cluster);
                  if (cluster.primaryTargetId) {
                    const found = targets.find(
                      (t) => t.id === cluster.primaryTargetId
                    );
                    if (found) onSelectTarget(found);
                  }
                }}
                onMouseEnter={() => setHoveredCluster(cluster)}
                onMouseLeave={() => setHoveredCluster(null)}
                style={{
                  left: `${cluster.x}%`,
                  top: `${cluster.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className={`absolute cursor-pointer transition-all duration-200 z-10 ${
                  isHovered || isSelected ? 'scale-110 z-30' : 'hover:scale-105'
                }`}
              >
                {/* Cluster Pill */}
                <div
                  className={`px-2 py-1 rounded-md text-[11px] font-bold tracking-tight text-white shadow-md flex items-center gap-1.5 border whitespace-nowrap ${
                    cluster.avgScore >= 85
                      ? 'bg-[#C92A2A] border-[#A61E1E]' // Deep red for Very High
                      : cluster.avgScore >= 80
                      ? 'bg-[#E03131] border-[#C92A2A]' // Red
                      : 'bg-[#E8590C] border-[#D9480F]' // Orange for High
                  } ${
                    isSelected
                      ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-white'
                      : ''
                  }`}
                >
                  <span>{cluster.label}</span>
                </div>

                {/* Subsurface Target Ping Indicator if Selected */}
                {isSelected && (
                  <span className="absolute -inset-1 rounded-md bg-blue-400/40 animate-ping pointer-events-none"></span>
                )}
              </div>
            );
          })}

          {/* Individual Highlight Marker for Selected Target */}
          {selectedTarget && (
            <div
              id="selected-target-marker"
              style={{
                left: `${
                  selectedTarget.id === 'T-003'
                    ? 49
                    : selectedTarget.id === 'T-019'
                    ? 34
                    : selectedTarget.id === 'T-025'
                    ? 57
                    : selectedTarget.id === 'T-038'
                    ? 41
                    : 47
                }%`,
                top: `${
                  selectedTarget.id === 'T-003'
                    ? 26
                    : selectedTarget.id === 'T-019'
                    ? 27
                    : selectedTarget.id === 'T-025'
                    ? 22
                    : selectedTarget.id === 'T-038'
                    ? 36
                    : 52
                }%`,
                transform: 'translate(-50%, -100%)',
              }}
              className="absolute z-40 pointer-events-none flex flex-col items-center"
            >
              <div className="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap mb-1 animate-bounce">
                🎯 {selectedTarget.id} ({selectedTarget.estimatedGradeMn}% Mn)
              </div>
              <div className="w-3 h-3 bg-blue-600 rotate-45 border-2 border-white shadow-md"></div>
            </div>
          )}
        </div>

        {/* Hovered Cluster Tooltip */}
        {hoveredCluster && (
          <div
            id="cluster-hover-tooltip"
            className="absolute top-4 right-4 z-30 bg-slate-900/90 backdrop-blur-xs text-white p-3 rounded-lg text-xs shadow-xl border border-slate-700/60 max-w-xs animate-in fade-in duration-150"
          >
            <div className="font-bold text-sm text-amber-300">
              {hoveredCluster.label}
            </div>
            <div className="text-slate-300 mt-1">
              Sector: Balaghat Manganese Belt
            </div>
            <div className="text-slate-300 text-[11px] mt-0.5">
              Avg Prospectivity Score:{' '}
              <span className="font-bold text-emerald-400">
                {hoveredCluster.avgScore}/100
              </span>
            </div>
            <div className="text-[10px] text-blue-300 mt-1">
              Click to inspect primary target ({hoveredCluster.primaryTargetId})
            </div>
          </div>
        )}

        {/* Prospectivity Legend (Bottom-Left as in Screenshot) */}
        <div
          id="map-prospectivity-legend"
          className="absolute bottom-3 left-3 z-20 bg-white/95 backdrop-blur-xs p-3 rounded-lg border border-slate-200/90 shadow-sm text-xs font-sans"
        >
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">
            PROSPECTIVITY
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#C92A2A] shrink-0"></span>
              <span className="text-slate-700 text-[11px] font-medium">
                Very High (0.8–1.0)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#E8590C] shrink-0"></span>
              <span className="text-slate-700 text-[11px] font-medium">
                High (0.6–0.8)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#FAB005] shrink-0"></span>
              <span className="text-slate-700 text-[11px] font-medium">
                Medium (0.35–0.6)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
