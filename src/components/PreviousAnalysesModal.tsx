import React from 'react';
import {
  X,
  RotateCcw,
  Calendar,
  Satellite,
  Target,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Layers,
  ArrowUpRight,
} from 'lucide-react';

interface PreviousAnalysesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestoreAnalysis: (analysisId: string) => void;
}

export const PreviousAnalysesModal: React.FC<PreviousAnalysesModalProps> = ({
  isOpen,
  onClose,
  onRestoreAnalysis,
}) => {
  if (!isOpen) return null;

  const previousRuns = [
    {
      id: 'RUN-2026-0912-A',
      date: '12 Sep 2026, 18:30 IST',
      satellites: ['Sentinel-2 MSI (Level-2A)', 'Landsat-9 TIR', 'Sentinel-1 SAR'],
      region: 'Balaghat District, MP (1,000 km²)',
      candidateCells: 10000,
      highPriorityTargets: 100,
      avgConfidence: '94.2%',
      primaryHotspot: 'North Bharweli & Tirodi Contact (T-003, T-019)',
      status: 'Current Active Inversion',
      isCurrent: true,
    },
    {
      id: 'RUN-2026-0908-B',
      date: '08 Sep 2026, 09:15 IST',
      satellites: ['Sentinel-2 MSI', 'Landsat-9 LST'],
      region: 'Balaghat District, MP (1,000 km²)',
      candidateCells: 10000,
      highPriorityTargets: 94,
      avgConfidence: '91.8%',
      primaryHotspot: 'Ukwa East Manganese Extension',
      status: 'Archived Baseline',
      isCurrent: false,
    },
    {
      id: 'RUN-2026-0828-C',
      date: '28 Aug 2026, 14:00 IST',
      satellites: ['Sentinel-1 C-Band SAR', 'SMAP Soil Moisture'],
      region: 'Balaghat South Benches & Wainganga Valley',
      candidateCells: 7500,
      highPriorityTargets: 82,
      avgConfidence: '88.4%',
      primaryHotspot: 'Monsoon Saturation & Regolith Filtering',
      status: 'Monsoon Calibrated',
      isCurrent: false,
    },
    {
      id: 'RUN-2026-0810-D',
      date: '10 Aug 2026, 11:20 IST',
      satellites: ['GSI Bouguer Gravity', 'Aeromagnetic Survey (NGRI)'],
      region: 'Sausar Belt Regional Basement (Balaghat - Bhandara)',
      candidateCells: 12000,
      highPriorityTargets: 78,
      avgConfidence: '86.5%',
      primaryHotspot: 'Mansar Gondite Structural Lineament',
      status: 'Deep Basement Survey',
      isCurrent: false,
    },
  ];

  return (
    <div
      id="previous-analyses-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="previous-analyses-modal-card"
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Satellite Inversion Run History
              </h3>
              <p className="text-xs text-slate-500">
                Audit trail of multi-spectral passes, Earth Observation inputs, and AI reserve inferences
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Previous Analyses */}
        <div className="p-6 overflow-y-auto space-y-3.5">
          {previousRuns.map((run) => (
            <div
              key={run.id}
              className={`p-4 rounded-xl border transition-all ${
                run.isCurrent
                  ? 'border-blue-300 bg-blue-50/40 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-900">
                    {run.id}
                  </span>
                  {run.isCurrent && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                      Active Inversion
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{run.date}</span>
                </div>
              </div>

              <div className="mt-2 text-xs text-slate-600 font-medium">
                {run.region}
              </div>

              {/* Satellite sources pills */}
              <div className="mt-2 flex flex-wrap gap-1.5">
                {run.satellites.map((sat, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700"
                  >
                    <Satellite className="w-3 h-3 text-slate-500" />
                    {sat}
                  </span>
                ))}
              </div>

              {/* Stats & Actions */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">
                      TARGETS
                    </span>
                    <span className="font-bold text-slate-800">
                      {run.highPriorityTargets} High Priority
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">
                      AVG CONFIDENCE
                    </span>
                    <span className="font-bold text-emerald-600">
                      {run.avgConfidence}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onRestoreAnalysis(run.id);
                    onClose();
                  }}
                  className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    run.isCurrent
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200/80'
                  }`}
                >
                  {run.isCurrent ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Loaded</span>
                    </>
                  ) : (
                    <>
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Load Inversion</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            Historical satellite telemetry stored in MOIL GIS Vault
          </span>
          <button
            onClick={onClose}
            className="hover:text-slate-800 font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
