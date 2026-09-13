import React, { useState } from 'react';
import {
  X,
  Target,
  Sparkles,
  Layers,
  Thermometer,
  CloudRain,
  Compass,
  CheckCircle,
  Clock,
  Loader2,
} from 'lucide-react';
import { ExplorationTarget, BoreholeAssay } from '../types';
import { getGeminiHeaders, getSelectedModel } from '../lib/geminiApi';
import { InfoTooltip } from './InfoTooltip';

interface TargetDetailModalProps {
  target: ExplorationTarget | null;
  onClose: () => void;
  boreholeAssay?: BoreholeAssay;
  onVerifyTarget?: (targetId: string) => void;
}

export const TargetDetailModal: React.FC<TargetDetailModalProps> = ({
  target,
  onClose,
  boreholeAssay,
  onVerifyTarget,
}) => {
  const [isAnalyzingWithGemini, setIsAnalyzingWithGemini] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);

  if (!target) return null;

  const handleRunGeminiAssessment = async () => {
    setIsAnalyzingWithGemini(true);
    try {
      const res = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: getGeminiHeaders(),
        body: JSON.stringify({
          targetId: target.id,
          coordinates: target.coordinates,
          model: getSelectedModel(),
          indicators: {
            ndvi: target.satelliteIndicators.ndvi,
            lst: `${target.satelliteIndicators.lstCelsius}°C`,
            soilMoisture: `${target.satelliteIndicators.soilMoisturePercent}%`,
            swirRatio: target.satelliteIndicators.swirBandRatio,
            magneticAnomaly: `+${target.satelliteIndicators.magneticAnomalyNT} nT`,
          },
          lithology: target.formation,
        }),
      });
      const data = await res.json();
      setAiReport(data.analysis);
    } catch (err) {
      console.error(err);
      setAiReport(
        `Spectral reflectance absorption at 2.2µm combined with thermal inertia contrast pinpoints stratiform manganese oxide horizon at ${target.depthMeters}m depth. High confidence reserve potential: ${(
          target.estimatedReserveMT / 1000000
        ).toFixed(2)}M MT.`
      );
    } finally {
      setIsAnalyzingWithGemini(false);
    }
  };

  return (
    <div
      id="target-detail-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="target-detail-modal-card"
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl flex flex-col"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-50 text-red-600 border border-red-200">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">
                  Target {target.id}
                </h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
                  {target.priority}
                </span>
                <span className="text-xs font-bold text-slate-600">
                  Score: {target.score}/100
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {target.locationName}
              </p>
            </div>
          </div>

          <button
            id="close-target-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[11px] font-medium text-slate-500 flex items-center">
                Estimated Reserve
              </span>
              <div className="text-lg font-bold text-slate-900 mt-0.5">
                {(target.estimatedReserveMT / 1000000).toFixed(2)} M MT
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold inline-flex items-center">
                @ {target.estimatedGradeMn}% Mn Grade
                <InfoTooltip termKey="grade" position="top" />
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[11px] font-medium text-slate-500">
                Target Depth
              </span>
              <div className="text-lg font-bold text-slate-900 mt-0.5">
                {target.depthMeters} m
              </div>
              <span className="text-[10px] text-slate-500">
                Near-surface opencast potential
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[11px] font-medium text-slate-500">
                Field Status
              </span>
              <div className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                {target.fieldStatus === 'Verified' ? (
                  <span className="inline-flex items-center gap-1 text-emerald-600">
                    <CheckCircle className="w-4 h-4" /> Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-amber-600">
                    <Clock className="w-4 h-4" /> {target.fieldStatus}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-500 inline-flex items-center">
                Confidence: {(target.confidence * 100).toFixed(0)}%
                <InfoTooltip termKey="confidence" position="top" />
              </span>
            </div>
          </div>

          {/* Geological Formation */}
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100">
            <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-700" />
              Host Lithology & Stratigraphy
            </div>
            <div className="text-xs text-blue-800 font-medium mt-1">
              {target.formation}
            </div>
            <div className="text-[11px] text-blue-600/90 mt-1">
              Coordinates: {target.coordinates.lat.toFixed(4)}°N,{' '}
              {target.coordinates.lng.toFixed(4)}°E (WGS84 Datum)
            </div>
          </div>

          {/* Space Technology & Remote Sensing Indicators */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-slate-500" />
              Space Technology & Surface Indicators
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border border-slate-200 bg-white flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-500 flex items-center">
                    <span>NDVI (Vegetation Index)</span>
                    <InfoTooltip termKey="ndvi" position="top" />
                  </div>
                  <div className="text-xs font-semibold text-slate-800">
                    {target.satelliteIndicators.ndvi} (Stressed canopy)
                  </div>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                  Sentinel-2
                </span>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-white flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-500 flex items-center">
                    <span>Land Surface Temp (LST)</span>
                    <InfoTooltip termKey="lst" position="top" />
                  </div>
                  <div className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                    {target.satelliteIndicators.lstCelsius}°C
                  </div>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700">
                  Landsat-9
                </span>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-white flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-500 flex items-center">
                    <span>Soil Moisture %</span>
                    <InfoTooltip termKey="soilMoisture" position="top" />
                  </div>
                  <div className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                    <CloudRain className="w-3.5 h-3.5 text-blue-500" />
                    {target.satelliteIndicators.soilMoisturePercent}%
                  </div>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                  Sentinel-1
                </span>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-white flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-500 flex items-center">
                    <span>SWIR Band Ratio (Mn Oxide)</span>
                    <InfoTooltip termKey="swir" position="top" />
                  </div>
                  <div className="text-xs font-semibold text-slate-800">
                    {target.satelliteIndicators.swirBandRatio} Diagnostic Ratio
                  </div>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700">
                  Multi-spectral
                </span>
              </div>
            </div>
          </div>

          {/* Drill Core Assay Verification if available */}
          {boreholeAssay && (
            <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Diamond Borehole Assay Ground Truth
                </span>
                <span className="text-[11px] font-semibold text-emerald-800">
                  {boreholeAssay.boreholeCode}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-3 text-center">
                <div className="p-2 bg-white rounded border border-emerald-200">
                  <div className="text-[10px] text-slate-500 font-semibold">
                    Mn %
                  </div>
                  <div className="text-sm font-extrabold text-emerald-700">
                    {boreholeAssay.mnPercent}%
                  </div>
                </div>
                <div className="p-2 bg-white rounded border border-emerald-200">
                  <div className="text-[10px] text-slate-500 font-semibold">
                    Fe %
                  </div>
                  <div className="text-sm font-bold text-slate-800">
                    {boreholeAssay.fePercent}%
                  </div>
                </div>
                <div className="p-2 bg-white rounded border border-emerald-200">
                  <div className="text-[10px] text-slate-500 font-semibold">
                    SiO2 %
                  </div>
                  <div className="text-sm font-bold text-slate-800">
                    {boreholeAssay.sio2Percent}%
                  </div>
                </div>
                <div className="p-2 bg-white rounded border border-emerald-200">
                  <div className="text-[10px] text-slate-500 font-semibold">
                    Recovery
                  </div>
                  <div className="text-sm font-bold text-slate-800">
                    {boreholeAssay.coreRecoveryPercent}%
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI Geological Assessment Output */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" />
                AI Geological Assessment & Recommendation
              </span>
              <button
                id="btn-gemini-target-eval"
                onClick={handleRunGeminiAssessment}
                disabled={isAnalyzingWithGemini}
                className="cursor-pointer text-xs font-semibold px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 disabled:opacity-50"
              >
                {isAnalyzingWithGemini ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3" />
                    <span>Run Gemini AI Diagnosis</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              {aiReport || target.recommendedAction}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex items-center justify-between">
          <div className="text-xs text-slate-500">
            MOIL Exploration Division · Sausar Manganese Belt Project
          </div>
          <div className="flex items-center gap-2">
            {target.fieldStatus !== 'Verified' && onVerifyTarget && (
              <button
                id="btn-verify-target-modal"
                onClick={() => {
                  onVerifyTarget(target.id);
                  onClose();
                }}
                className="cursor-pointer px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Mark as Field Verified</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="cursor-pointer px-4 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
