import React, { useState } from 'react';
import {
  Map as MapIcon,
  Activity,
  Target,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { InteractiveMap } from './InteractiveMap';
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
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  targets,
  clusters,
  boreholeAssays,
  onOpenFullExplorer,
  verifiedCount,
  onVerifyTarget,
  onOpenApiKeyModal,
}) => {
  const [selectedTarget, setSelectedTarget] = useState<ExplorationTarget | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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
      {/* Yellow Warning Banner matching screenshot */}
      <div
        id="demo-alert-banner"
        className="bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2.5 shadow-2xs"
      >
        <AlertCircle className="w-4 h-4 text-[#D97706] shrink-0" />
        <span>
          DEMO / SIMULATED DATA: Values shown are for illustrative prototype
          purposes.
        </span>
      </div>

      {/* 5 KPI Metric Cards Row matching screenshot */}
      <div
        id="kpi-metrics-row"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5"
      >
        {/* 1. Exploration Area */}
        <div
          id="kpi-exploration-area"
          className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Exploration Area
            </span>
            <MapIcon className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-black tracking-tight text-slate-900 font-sans">
              1,000
            </span>
            <span className="text-xs font-bold text-slate-500">km²</span>
          </div>
        </div>

        {/* 2. Candidate Cells */}
        <div
          id="kpi-candidate-cells"
          className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Candidate Cells
            </span>
            <Activity className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black tracking-tight text-slate-900 font-sans">
              10,000
            </span>
          </div>
        </div>

        {/* 3. High-Priority Targets */}
        <div
          id="kpi-high-priority-targets"
          className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              High-Priority Targets
            </span>
            <div className="text-orange-500">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black tracking-tight text-slate-900 font-sans">
              100
            </span>
          </div>
        </div>

        {/* 4. Field Verified */}
        <div
          id="kpi-field-verified"
          className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Field Verified
            </span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black tracking-tight text-slate-900 font-sans">
              {verifiedCount}
            </span>
          </div>
        </div>

        {/* 5. Model Status */}
        <div
          id="kpi-model-status"
          className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Model Status
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              ONLINE
            </span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black tracking-tight text-emerald-600 font-sans">
              Ready
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid matching screenshot layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Left Map View (~68% on large screens) */}
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

        {/* Right Top Priority Targets List (~32% on large screens) */}
        <div className="lg:col-span-4 min-h-[520px]">
          <TopPriorityTargets
            targets={targets}
            selectedTarget={selectedTarget}
            onSelectTarget={handleSelectTarget}
            onOpenTargetDetail={handleOpenTargetDetail}
          />
        </div>
      </div>

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
