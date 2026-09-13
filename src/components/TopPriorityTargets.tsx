import React from 'react';
import { Target, ChevronRight } from 'lucide-react';
import { ExplorationTarget } from '../types';

interface TopPriorityTargetsProps {
  targets: ExplorationTarget[];
  selectedTarget: ExplorationTarget | null;
  onSelectTarget: (target: ExplorationTarget) => void;
  onOpenTargetDetail: (target: ExplorationTarget) => void;
}

export const TopPriorityTargets: React.FC<TopPriorityTargetsProps> = ({
  targets,
  selectedTarget,
  onSelectTarget,
  onOpenTargetDetail,
}) => {
  return (
    <div
      id="top-priority-targets-card"
      className="bg-white rounded-xl border border-slate-200/90 shadow-xs flex flex-col h-full overflow-hidden"
    >
      {/* Header matching screenshot */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2.5">
        <div className="p-1 rounded-full text-slate-700">
          <Target className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">
          Top Priority Targets
        </h3>
      </div>

      {/* Target Items List */}
      <div className="divide-y divide-slate-100 overflow-y-auto flex-1 p-2 space-y-0.5">
        {targets.map((target) => {
          const isSelected = selectedTarget?.id === target.id;

          return (
            <div
              key={target.id}
              id={`priority-target-row-${target.id}`}
              onClick={() => {
                onSelectTarget(target);
                onOpenTargetDetail(target);
              }}
              className={`px-3 py-3 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                isSelected
                  ? 'bg-blue-50/90 border border-blue-200/80 shadow-2xs'
                  : 'hover:bg-slate-50'
              }`}
            >
              {/* Left Rank & ID */}
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-bold text-slate-900 w-16">
                  {target.rank}. {target.id}
                </span>

                {/* Badge: VERY HIGH in red / HIGH in orange */}
                <span
                  className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wide ${
                    target.priority === 'VERY HIGH'
                      ? 'bg-[#FEE2E2] text-[#DC2626]'
                      : 'bg-[#FFEDD5] text-[#EA580C]'
                  }`}
                >
                  {target.priority}
                </span>
              </div>

              {/* Right Score */}
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <span
                    className={`text-sm font-bold ${
                      target.score >= 90
                        ? 'text-[#DC2626]'
                        : target.score >= 80
                        ? 'text-[#EA580C]'
                        : 'text-amber-600'
                    }`}
                  >
                    {target.score}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">/100</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
