import React from 'react';
import {
  FileText,
  Download,
  Award,
  DollarSign,
  Layers,
  CheckCircle,
  TrendingUp,
  Printer,
} from 'lucide-react';

export const ReportsImpactView: React.FC = () => {
  return (
    <div
      id="reports-impact-view"
      className="p-6 space-y-6 max-w-[1600px] mx-auto"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Executive Reports & Reserve Impact Audit
            </h2>
            <p className="text-xs text-slate-500">
              UNFC / JORC compliant reserve classification upgrades and economic value creation for MOIL Limited
            </p>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print / Export Dossier</span>
        </button>
      </div>

      {/* Value Creation Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">
            New Proved Reserves (UNFC 111)
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-1 font-sans">
            +18.4 M MT
          </div>
          <span className="text-[11px] text-slate-500">
            Average Grade: 43.8% Mn
          </span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">
            Exploration Cost Reduction
          </div>
          <div className="text-2xl font-black text-blue-600 mt-1 font-sans">
            ₹3.82 Crore
          </div>
          <span className="text-[11px] text-slate-500">
            Saved 32 blind drilling meters
          </span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">
            Avoided Shortfall Penalties
          </div>
          <div className="text-2xl font-black text-indigo-600 mt-1 font-sans">
            ₹1.95 Crore
          </div>
          <span className="text-[11px] text-slate-500">
            Preserved SAIL contract rake supply
          </span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">
            Drilling Hit Success Rate
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-1 font-sans">
            91.2%
          </div>
          <span className="text-[11px] text-slate-500">
            Up from manual 58% baseline
          </span>
        </div>
      </div>

      {/* UNFC Resource Classification Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            UNFC 1997 / 2004 Code Reserve Inventory (Balaghat District)
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Certified Competent Person Review (PERC / JORC)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">UNFC Category</th>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Tonnage (Million MT)</th>
                <th className="py-3 px-4">Grade (Mn %)</th>
                <th className="py-3 px-4">Fe %</th>
                <th className="py-3 px-4">SiO2 %</th>
                <th className="py-3 px-4">Economic Viability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">
                  Proved Mineral Reserve
                </td>
                <td className="py-3 px-4 font-mono font-bold text-blue-600">
                  111
                </td>
                <td className="py-3 px-4 font-bold text-slate-800">12.45 M</td>
                <td className="py-3 px-4 font-bold text-emerald-700">44.6%</td>
                <td className="py-3 px-4 text-slate-600">6.1%</td>
                <td className="py-3 px-4 text-slate-600">7.2%</td>
                <td className="py-3 px-4 text-emerald-600 font-semibold">
                  Commercially Extractable
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">
                  Probable Mineral Reserve
                </td>
                <td className="py-3 px-4 font-mono font-bold text-blue-600">
                  121 / 122
                </td>
                <td className="py-3 px-4 font-bold text-slate-800">8.90 M</td>
                <td className="py-3 px-4 font-bold text-emerald-700">42.2%</td>
                <td className="py-3 px-4 text-slate-600">6.8%</td>
                <td className="py-3 px-4 text-slate-600">8.4%</td>
                <td className="py-3 px-4 text-blue-600 font-semibold">
                  Feasibility Approved
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">
                  Inferred Mineral Resource
                </td>
                <td className="py-3 px-4 font-mono font-bold text-blue-600">
                  333
                </td>
                <td className="py-3 px-4 font-bold text-slate-800">14.20 M</td>
                <td className="py-3 px-4 font-bold text-emerald-700">39.5%</td>
                <td className="py-3 px-4 text-slate-600">7.5%</td>
                <td className="py-3 px-4 text-slate-600">9.8%</td>
                <td className="py-3 px-4 text-slate-600 font-semibold">
                  Under Geological Appraisal
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
