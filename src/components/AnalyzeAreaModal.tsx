import React, { useState, useEffect } from 'react';
import { X, Play, Satellite, CheckCircle, Database, Sparkles, Loader2 } from 'lucide-react';

interface AnalyzeAreaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteScan: () => void;
}

export const AnalyzeAreaModal: React.FC<AnalyzeAreaModalProps> = ({
  isOpen,
  onClose,
  onCompleteScan,
}) => {
  const [stage, setStage] = useState<'idle' | 'scanning' | 'completed'>('idle');
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('');
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setStage('idle');
      setProgress(0);
      setLogs([]);
    }
  }, [isOpen]);

  const handleStartAnalysis = () => {
    setStage('scanning');
    setProgress(5);
    setLogs(['[00:01] Initializing Sentinel-2 Level-2A BOA reflectance ingestion...']);

    const steps = [
      {
        delay: 600,
        progress: 25,
        task: 'Extracting SWIR Band 11 / Band 12 absorption dip for Mn/Fe oxides...',
        log: '[00:02] SWIR absorption calculated: high-contrast gondite anomalies isolated.',
      },
      {
        delay: 1300,
        progress: 48,
        task: 'Inverting Landsat-9 Thermal Infrared (TIR) for Land Surface Temp & thermal inertia...',
        log: '[00:03] LST calibrated: thermal inertia contrast detected at 15-35m depth.',
      },
      {
        delay: 2000,
        progress: 70,
        task: 'Fusing Sentinel-1 SAR backscatter & SMAP soil moisture with IMD rainfall...',
        log: '[00:04] Soil moisture noise masked. Water-saturated regolith corrected.',
      },
      {
        delay: 2700,
        progress: 90,
        task: 'Executing Sausar Group deep neural net prospectivity weighting across 10,000 cells...',
        log: '[00:05] Model inference complete: 100 high-priority targets mapped.',
      },
      {
        delay: 3400,
        progress: 100,
        task: 'Analysis complete! 1,000 km² Balaghat block prospectivity grid updated.',
        log: '[00:06] Ready for field validation and drilling borehole dispatch.',
      },
    ];

    steps.forEach((step) => {
      setTimeout(() => {
        setProgress(step.progress);
        setCurrentTask(step.task);
        setLogs((prev) => [...prev, step.log]);
        if (step.progress === 100) {
          setStage('completed');
        }
      }, step.delay);
    });
  };

  if (!isOpen) return null;

  return (
    <div
      id="analyze-area-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="analyze-area-modal-box"
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Satellite className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                AI & Space Technology Area Analysis
              </h3>
              <p className="text-xs text-slate-500">
                Region: Balaghat, MP · Survey Envelope: 1,000 km²
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {stage === 'idle' && (
            <div className="space-y-4 text-center py-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-inner">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto">
                <h4 className="text-sm font-bold text-slate-900">
                  Run Satellite & Geological Multi-Layer Inversion
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Ingests the latest Earth Observation passes (Sentinel-2,
                  Landsat-9, Sentinel-1 SAR) to compute SWIR mineral indices,
                  thermal inertia, vegetation stress, and ground gravity anomalies
                  to refresh manganese ore prospectivity.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-left bg-slate-50 p-3 rounded-xl border border-slate-200/70 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block">
                    SENSOR PASS
                  </span>
                  <span className="font-semibold text-slate-700">
                    Sentinel-2 MSI
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block">
                    GRID RESOLUTION
                  </span>
                  <span className="font-semibold text-slate-700">10m x 10m</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block">
                    ALGORITHM
                  </span>
                  <span className="font-semibold text-slate-700">
                    Sausar AI Net
                  </span>
                </div>
              </div>

              <button
                id="btn-confirm-start-analysis"
                onClick={handleStartAnalysis}
                className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm transition-all"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Start Multi-Spectral Analysis</span>
              </button>
            </div>
          )}

          {stage === 'scanning' && (
            <div className="space-y-4 py-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-700 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                  {currentTask}
                </span>
                <span className="text-blue-600 font-bold">{progress}%</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              {/* Terminal Logs */}
              <div className="bg-slate-950 text-slate-200 p-3 rounded-xl font-mono text-[11px] h-36 overflow-y-auto space-y-1">
                {logs.map((log, i) => (
                  <div key={i} className="text-emerald-400">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}

          {stage === 'completed' && (
            <div className="space-y-4 text-center py-3">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  Analysis Successfully Completed
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  10,000 candidate cells evaluated · 100 high-priority targets
                  updated with high confidence.
                </p>
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-900 text-left">
                <strong>Key Findings:</strong> Strongest spectral absorption
                concentrated around North Bharweli (T-003) and Waraseoni West
                Gondite belt (T-019). Recommended drill priority confirmed.
              </div>

              <button
                id="btn-apply-analysis-results"
                onClick={() => {
                  onCompleteScan();
                  onClose();
                }}
                className="cursor-pointer px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                Apply Updated Prospectivity to Command Center
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5" /> MOIL GIS Space Intelligence Hub
          </span>
          <button
            onClick={onClose}
            className="hover:text-slate-800 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
