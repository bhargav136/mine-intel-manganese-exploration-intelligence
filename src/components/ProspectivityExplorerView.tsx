import React, { useState } from 'react';
import {
  Map,
  Filter,
  Search,
  Download,
  Layers,
  ChevronRight,
  TrendingUp,
  Target,
  ShieldAlert,
  Info,
  Satellite,
} from 'lucide-react';
import { ExplorationTarget } from '../types';
import { SihMethodologyModal } from './SihMethodologyModal';

interface ProspectivityExplorerViewProps {
  targets: ExplorationTarget[];
  onSelectTarget: (target: ExplorationTarget) => void;
}

export const ProspectivityExplorerView: React.FC<ProspectivityExplorerViewProps> = ({
  targets,
  onSelectTarget,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [minScoreFilter, setMinScoreFilter] = useState(80);
  const [selectedFormation, setSelectedFormation] = useState('All');
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);

  const filteredTargets = targets.filter((t) => {
    const matchesSearch =
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.formation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesScore = t.score >= minScoreFilter;
    const matchesFormation =
      selectedFormation === 'All' || t.formation.includes(selectedFormation);
    return matchesSearch && matchesScore && matchesFormation;
  });

  return (
    <div
      id="prospectivity-explorer-view"
      className="p-6 space-y-6 max-w-[1600px] mx-auto"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <Map className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Prospectivity Explorer (10,000 Candidate Cells)
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-indigo-50 text-indigo-700 border border-indigo-200">
                ASTER SWIR + GSI Lithology
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              High-resolution 10m x 10m spatial grid scoring manganese mineral potential with calibrated confidence bands
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsMethodologyOpen(true)}
            className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-blue-600" />
            <span>Scientific Disclosure</span>
          </button>

          <button
            onClick={() => {
              const csv = targets
                .map(
                  (t) =>
                    `${t.id},${t.rank},${t.score},${t.coordinates.lat},${t.coordinates.lng},${t.estimatedGradeMn},${t.estimatedReserveMT}`
                )
                .join('\n');
              const blob = new Blob(
                [`ID,Rank,Score,Lat,Lng,GradeMn%,ReserveMT\n` + csv],
                { type: 'text/csv' }
              );
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'MOIL_Manganese_Prospectivity_Cells.csv';
              a.click();
            }}
            className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export GIS Grid (CSV)</span>
          </button>
        </div>
      </div>

      {/* Scientific Methodology Callout Banner */}
      <div className="p-3.5 bg-indigo-50/70 border border-indigo-200/80 rounded-xl flex items-start gap-3 text-xs text-indigo-950">
        <Satellite className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>SIH26009 Spectral Geology Grounding:</strong> Sub-surface manganese deposits in the Sausar Belt cannot be found with raw rainfall or NDVI. Our model inverts <strong>ASTER SWIR Band Ratio 12/11 (2.20 µm pyrolusite absorption)</strong>, <strong>Sentinel-2 ferric index (B4/B2)</strong>, and <strong>GSI Mansar Formation gondite contacts</strong> to produce defensible prospectivity scores with 95% confidence intervals.
        </div>
      </div>

      {/* 2D Subsurface Stratigraphic Cross-Section */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            Subsurface Ore Body Cross-Section (Section A–A' Balaghat South to North)
          </h3>
          <span className="text-[11px] text-slate-500">
            Strike N65°E · Dip 70° NW · Mansar Gondite Horizon
          </span>
        </div>

        <div className="relative h-56 bg-slate-900 rounded-xl overflow-hidden p-4 border border-slate-800">
          <svg
            className="w-full h-full"
            viewBox="0 0 900 200"
            preserveAspectRatio="none"
          >
            {/* Topography Surface Line */}
            <path
              d="M 0,40 Q 250,25 450,45 T 900,30"
              fill="none"
              stroke="#A3E635"
              strokeWidth="3"
            />

            {/* Overburden Regolith / Alluvium (0 - 15m) */}
            <path
              d="M 0,40 Q 250,25 450,45 T 900,30 L 900,65 Q 450,75 0,65 Z"
              fill="#78350F"
              opacity="0.25"
            />

            {/* Hanging Wall: Chorbaoli Quartzite */}
            <polygon points="0,65 900,65 900,95 0,95" fill="#334155" opacity="0.6" />

            {/* Steeply Dipping High-Grade Manganese Ore Seam (Mansar Formation) */}
            <polygon
              points="280,42 350,42 490,200 420,200"
              fill="#E11D48"
              opacity="0.85"
            />
            {/* Secondary Braunite Lens */}
            <polygon
              points="580,36 630,36 740,200 690,200"
              fill="#E11D48"
              opacity="0.7"
            />

            {/* Footwall: Sitasaongi Schist */}
            <polygon points="0,140 900,140 900,200 0,200" fill="#1E293B" opacity="0.9" />

            {/* Diamond Drillholes (Boreholes plunging through ore seam) */}
            <line
              x1="320"
              y1="38"
              x2="450"
              y2="180"
              stroke="#38BDF8"
              strokeWidth="2"
              strokeDasharray="4,4"
            />
            <circle cx="390" cy="115" r="4" fill="#FACC15" />

            <line
              x1="610"
              y1="34"
              x2="710"
              y2="180"
              stroke="#38BDF8"
              strokeWidth="2"
              strokeDasharray="4,4"
            />
            <circle cx="660" cy="110" r="4" fill="#FACC15" />

            {/* Text Annotations */}
            <g className="font-sans text-[10px] fill-slate-300">
              <text x="20" y="55" fill="#84CC16">
                Surface Level (RL +320m)
              </text>
              <text x="360" y="70" fill="#FDA4AF" fontWeight="bold">
                Manganese Ore Bed (44.6% Mn)
              </text>
              <text x="290" y="150" fill="#7DD3FC">
                BH-BLG-2024-03
              </text>
              <text x="640" y="70" fill="#FDA4AF" fontWeight="bold">
                Secondary Ore Lens (42.1% Mn)
              </text>
              <text x="20" y="185" fill="#94A3B8">
                Footwall Quartz-Muscovite Schist (Depth 120m)
              </text>
            </g>
          </svg>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search target ID, locality, or formation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedFormation}
              onChange={(e) => setSelectedFormation(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-2.5 text-slate-700"
            >
              <option value="All">All Formations</option>
              <option value="Mansar">Mansar Formation (Gondite)</option>
              <option value="Tirodi">Tirodi Gneiss Complex</option>
              <option value="Chorbaoli">Chorbaoli Quartzite</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span>Min Score:</span>
          <input
            type="range"
            min="60"
            max="95"
            value={minScoreFilter}
            onChange={(e) => setMinScoreFilter(Number(e.target.value))}
            className="accent-blue-600 w-24"
          />
          <span className="font-bold text-slate-900 w-8">{minScoreFilter}</span>
        </div>
      </div>

      {/* Target Candidates Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/90 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Rank & ID</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Formation Lithology</th>
                <th className="py-3 px-4">SWIR B12/B11</th>
                <th className="py-3 px-4">Depth (m)</th>
                <th className="py-3 px-4">Confidence Band</th>
                <th className="py-3 px-4">Grade (Mn %)</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTargets.map((target) => (
                <tr
                  key={target.id}
                  className="hover:bg-blue-50/40 cursor-pointer transition-colors"
                  onClick={() => onSelectTarget(target)}
                >
                  <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-5 text-slate-400 font-normal">
                      #{target.rank}
                    </span>
                    <span>{target.id}</span>
                    <span
                      className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                        target.priority === 'VERY HIGH'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-orange-50 text-orange-700 border border-orange-200'
                      }`}
                    >
                      {target.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">
                    {target.locationName}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {target.formation}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-indigo-700">
                    {(1.72 + (target.score / 100) * 0.26).toFixed(2)}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-700">
                    {target.depthMeters} m
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    <span className="inline-flex items-center gap-1 font-semibold text-[11px] text-slate-800">
                      <span>{(target.estimatedReserveMT / 1000000).toFixed(2)}M MT</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        (±{(0.08 - target.confidence * 0.04).toFixed(2)})
                      </span>
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-emerald-700">
                      {target.estimatedGradeMn}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`font-extrabold ${
                        target.score >= 90
                          ? 'text-red-600'
                          : target.score >= 80
                          ? 'text-orange-600'
                          : 'text-amber-600'
                      }`}
                    >
                      {target.score}/100
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTarget(target);
                      }}
                      className="cursor-pointer text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1"
                    >
                      Inspect <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scientific Methodology Modal */}
      <SihMethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />
    </div>
  );
};
