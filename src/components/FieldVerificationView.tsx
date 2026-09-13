import React, { useState } from 'react';
import {
  HardHat,
  CheckCircle,
  Clock,
  FileSpreadsheet,
  Layers,
  ChevronRight,
  TestTube,
} from 'lucide-react';
import { ExplorationTarget, BoreholeAssay } from '../types';

interface FieldVerificationViewProps {
  targets: ExplorationTarget[];
  boreholeAssays: BoreholeAssay[];
  onVerifyTarget: (targetId: string) => void;
  verifiedCount: number;
}

export const FieldVerificationView: React.FC<FieldVerificationViewProps> = ({
  targets,
  boreholeAssays,
  onVerifyTarget,
  verifiedCount,
}) => {
  const [selectedAssay, setSelectedAssay] = useState<BoreholeAssay>(
    boreholeAssays[0]
  );

  const pendingTargets = targets.filter((t) => t.fieldStatus !== 'Verified');

  return (
    <div
      id="field-verification-view"
      className="p-6 space-y-6 max-w-[1600px] mx-auto"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
            <HardHat className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Field Verification & Diamond Core Assay Logging
            </h2>
            <p className="text-xs text-slate-500">
              Ground-truthing AI satellite targets with exploratory diamond drilling and chemical assay validation
            </p>
          </div>
        </div>

        {/* Verification Status Progress */}
        <div className="flex items-center gap-4 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
          <div>
            <div className="text-[11px] text-slate-500 font-semibold">
              Verification Progress
            </div>
            <div className="text-sm font-bold text-slate-900">
              {verifiedCount} / 100 Targets Verified
            </div>
          </div>
          <div className="w-28 h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${(verifiedCount / 100) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Grid: Core Box Visualizer & Assay Data */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Drill Core Visualizer Box */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <TestTube className="w-4 h-4 text-emerald-600" />
                Drill Core Box: {selectedAssay.boreholeCode}
              </h3>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {selectedAssay.status}
              </span>
            </div>

            {/* Realistic Core Box Visualization */}
            <div className="bg-[#5C3A21] p-3 rounded-xl border-4 border-[#3D2513] shadow-inner space-y-2">
              <div className="text-[10px] text-amber-200 font-mono flex justify-between px-1">
                <span>Box 1: {selectedAssay.depthFrom}m</span>
                <span>To: {selectedAssay.depthTo}m</span>
              </div>

              {/* 4 Core Trays */}
              {[1, 2, 3, 4].map((tray) => (
                <div
                  key={tray}
                  className="h-8 bg-[#2A1810] rounded-sm p-1 flex items-center gap-1 border border-[#3E2316]"
                >
                  {/* Cylindrical Core Segments (Metallic dark charcoal/black manganese ore) */}
                  <div className="h-full flex-1 bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 rounded-xs shadow-inner flex items-center justify-center text-[9px] text-slate-400 font-mono">
                    {tray === 2 ? (
                      <span className="text-emerald-400 font-bold">
                        ★ High-Grade Braunite ({selectedAssay.mnPercent}% Mn)
                      </span>
                    ) : tray === 3 ? (
                      <span className="text-slate-300">
                        Pyrolusite Band (Rec. {selectedAssay.coreRecoveryPercent}%)
                      </span>
                    ) : (
                      'Gondite Schist Host'
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Core Box Stats */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Mn Grade</span>
                <span className="font-extrabold text-emerald-700 text-sm">
                  {selectedAssay.mnPercent}%
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block">True Width</span>
                <span className="font-bold text-slate-800 text-sm">
                  {selectedAssay.trueThickness} m
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Core Recovery</span>
                <span className="font-bold text-slate-800 text-sm">
                  {selectedAssay.coreRecoveryPercent}%
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200/80">
              <strong>Mineralogical Petrography:</strong> {selectedAssay.mineralogy}.
              Low phosphorus penalty (P: {selectedAssay.pPercent}%), optimal for ferro-manganese smelting.
            </p>
          </div>

          {/* Quick Verify Pending Targets Action */}
          {pendingTargets.length > 0 && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs space-y-2">
              <div className="flex items-center justify-between font-bold text-amber-900">
                <span>Targets Pending Field Validation ({pendingTargets.length})</span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-amber-800 text-[11px]">
                Target {pendingTargets[0].id} ({pendingTargets[0].locationName}) has high spectral anomaly.
              </p>
              <button
                onClick={() => onVerifyTarget(pendingTargets[0].id)}
                className="cursor-pointer w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Validate & Confirm Target {pendingTargets[0].id}</span>
              </button>
            </div>
          )}
        </div>

        {/* Right: Borehole Assays Table */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-slate-600" />
                Diamond Drilling Laboratory Assay Database
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                MOIL Central Chemical Laboratory (ISO 17025)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-3">Borehole</th>
                    <th className="py-3 px-3">Target</th>
                    <th className="py-3 px-3">Depth (m)</th>
                    <th className="py-3 px-3">Mn %</th>
                    <th className="py-3 px-3">Fe %</th>
                    <th className="py-3 px-3">SiO2 %</th>
                    <th className="py-3 px-3">P %</th>
                    <th className="py-3 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {boreholeAssays.map((assay) => {
                    const isSelected = selectedAssay.id === assay.id;
                    return (
                      <tr
                        key={assay.id}
                        onClick={() => setSelectedAssay(assay)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-blue-50/70 font-semibold' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-3 px-3 font-bold text-slate-900">
                          {assay.boreholeCode}
                        </td>
                        <td className="py-3 px-3 text-blue-600">{assay.targetId}</td>
                        <td className="py-3 px-3 text-slate-600">
                          {assay.depthFrom} – {assay.depthTo} ({assay.trueThickness}m)
                        </td>
                        <td className="py-3 px-3 font-bold text-emerald-700">
                          {assay.mnPercent}%
                        </td>
                        <td className="py-3 px-3 text-slate-700">{assay.fePercent}%</td>
                        <td className="py-3 px-3 text-slate-700">{assay.sio2Percent}%</td>
                        <td className="py-3 px-3 text-slate-700">{assay.pPercent}%</td>
                        <td className="py-3 px-3 text-right">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {assay.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
