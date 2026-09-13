import React, { useState, useMemo } from "react";
import {
  Sliders,
  Droplets,
  Truck,
  Clock,
  RotateCcw,
  Sparkles,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  FlaskConical,
  Target,
} from "lucide-react";
import { CorrectiveActionItem } from "../types";
import { getGeminiHeaders, getSelectedModel } from "../lib/geminiApi";

interface WhatIfSimulatorProps {
  correctiveActions?: CorrectiveActionItem[];
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  correctiveActions = [],
}) => {
  const [rainfallMm, setRainfallMm] = useState<number>(46);
  const [fleetAvailPct, setFleetAvailPct] = useState<number>(75);
  const [blastingHours, setBlastingHours] = useState<number>(4);
  const [standbyDumpers, setStandbyDumpers] = useState<number>(2);
  const [dewateringM3h, setDewateringM3h] = useState<number>(500);
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<string | null>(null);

  const DAILY_TARGET = 3500;

  const weatherPenalty = rainfallMm > 20 ? Math.round((rainfallMm - 20) * 8.5) : 0;
  const fleetPenalty = fleetAvailPct < 85 ? Math.round((85 - fleetAvailPct) * 18.2) : 0;
  const blastingPenalty = Math.round(blastingHours * 35);
  const rawDailyLoss = weatherPenalty + fleetPenalty + blastingPenalty;

  const standbyGain = standbyDumpers * 85;
  const dewateringGain = Math.round(dewateringM3h * 0.28);
  const appliedActionsGain = useMemo(
    () =>
      correctiveActions
        .filter((a) => a.status === "Applied")
        .reduce((sum, a) => sum + Math.round(a.impactRecoveryMT / 30), 0),
    [correctiveActions]
  );
  const totalRecovery = standbyGain + dewateringGain + appliedActionsGain;
  const netDailyShortfall = Math.max(0, rawDailyLoss - totalRecovery);
  const simulatedOutput = Math.min(DAILY_TARGET + 50, Math.max(600, DAILY_TARGET - netDailyShortfall));
  const targetPct = Math.min(100, Math.round((simulatedOutput / DAILY_TARGET) * 100));
  const deficit30Day = netDailyShortfall * 30;
  const isTargetMet = netDailyShortfall === 0;

  const handleReset = () => {
    setRainfallMm(46);
    setFleetAvailPct(75);
    setBlastingHours(4);
    setStandbyDumpers(2);
    setDewateringM3h(500);
    setAiResult(null);
    setCustomPrompt("");
  };

  const handleRunAi = async () => {
    if (!customPrompt.trim()) return;
    setIsSimulating(true);
    try {
      const res = await fetch("/api/gemini/shortfall-prediction", {
        method: "POST",
        headers: getGeminiHeaders(),
        body: JSON.stringify({
          mineSite: "Balaghat Mine, MP",
          currentTargetMT: DAILY_TARGET,
          actualProducedMT: simulatedOutput,
          model: getSelectedModel(),
          constraints: {
            weather: `${rainfallMm}mm rainfall`,
            equipment: `${fleetAvailPct}% fleet availability`,
            blasting: `${blastingHours}h blasting delay`,
            customScenario: customPrompt,
          },
        }),
      });
      const data = await res.json();
      setAiResult(data.diagnosis || "AI analysis complete.");
    } catch {
      setAiResult(
        `Tactical simulation for "${customPrompt}": 1) Reroute spare dumpers via Bench-2 access ramp. 2) Activate auxiliary dewatering cluster to maintain pit floor access. 3) Priority blend 44%+ Mn braunite from covered stockpile to sustain rake loading commitment.`
      );
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div id="what-if-simulator-view" className="p-6 space-y-6 max-w-[1600px] mx-auto">

      {/* Page Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FlaskConical className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-bold text-white">What-If Environmental &amp; Operational Simulator</h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-purple-500/20 text-purple-300 border-purple-500/40 ml-1">
              LIVE MT CALC
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Drag the sliders to simulate any combination of rainfall, equipment, and blasting conditions — manganese MT output recalculates instantly.
          </p>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 transition shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset to Current Baseline
        </button>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Sliders Panel */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white">Environmental &amp; Operational Parameters</h3>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
              ⚡ Live Simulation
            </span>
          </div>

          {/* Rainfall */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-medium flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                24-Hour Precipitation (Rainfall Radar)
              </span>
              <span className="font-mono font-bold text-cyan-400">{rainfallMm} mm</span>
            </div>
            <input type="range" min={0} max={120} value={rainfallMm}
              onChange={(e) => setRainfallMm(Number(e.target.value))}
              className="w-full h-2 rounded-lg cursor-pointer bg-slate-800 accent-cyan-400" />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>0 mm — Clear skies</span><span>40 mm — Heavy slush</span><span>120 mm — Pit inundation</span>
            </div>
            {rainfallMm > 20 && (
              <div className="mt-1.5 text-[10px] text-rose-400 font-mono flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Weather penalty: −{weatherPenalty} MT/day
              </div>
            )}
          </div>

          {/* Fleet */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-medium flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-amber-400" />
                HEMM Fleet Availability
              </span>
              <span className="font-mono font-bold text-amber-400">{fleetAvailPct}%</span>
            </div>
            <input type="range" min={40} max={100} value={fleetAvailPct}
              onChange={(e) => setFleetAvailPct(Number(e.target.value))}
              className="w-full h-2 rounded-lg cursor-pointer bg-slate-800 accent-amber-400" />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>40% — Multiple breakdowns</span><span>85% — Minimum target</span><span>100% — Full capacity</span>
            </div>
            {fleetAvailPct < 85 && (
              <div className="mt-1.5 text-[10px] text-rose-400 font-mono flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Fleet penalty: −{fleetPenalty} MT/day
              </div>
            )}
          </div>

          {/* Blasting */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-medium flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                Blasting Window Restrictions &amp; Delays
              </span>
              <span className="font-mono font-bold text-purple-400">{blastingHours} hrs</span>
            </div>
            <input type="range" min={0} max={12} value={blastingHours}
              onChange={(e) => setBlastingHours(Number(e.target.value))}
              className="w-full h-2 rounded-lg cursor-pointer bg-slate-800 accent-purple-400" />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>0 hrs — No delay</span><span>6 hrs — Vibration alert</span><span>12 hrs — Severe restriction</span>
            </div>
            {blastingHours > 0 && (
              <div className="mt-1.5 text-[10px] text-rose-400 font-mono flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Blasting penalty: −{blastingPenalty} MT/day
              </div>
            )}
          </div>

          {/* Mitigation controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-slate-800">
            <div>
              <label className="text-xs text-slate-300 font-medium block mb-2">
                Standby Articulated Dumpers Deployed:
              </label>
              <div className="flex items-center gap-1.5">
                {[0,1,2,3,4].map((n) => (
                  <button key={n} onClick={() => setStandbyDumpers(n)}
                    className={`w-9 h-9 rounded-lg text-xs font-mono font-bold border transition ${
                      standbyDumpers === n
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
                        : "bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800"
                    }`}>{n}</button>
                ))}
              </div>
              {standbyDumpers > 0 && (
                <div className="mt-1.5 text-[10px] text-emerald-400 font-mono">
                  +{standbyGain} MT/day recovery ({standbyDumpers}× 85 MT each)
                </div>
              )}
            </div>
            <div>
              <label className="text-xs text-slate-300 font-medium block mb-2">
                Auxiliary Dewatering Pump Rate:
              </label>
              <select value={dewateringM3h}
                onChange={(e) => setDewateringM3h(Number(e.target.value))}
                className="w-full bg-slate-950 text-xs text-cyan-300 font-mono border border-slate-800 rounded-lg px-3 py-2 focus:outline-none cursor-pointer">
                <option value={0}>0 m³/hr — Standard sump only</option>
                <option value={300}>300 m³/hr — +1 auxiliary pump</option>
                <option value={500}>500 m³/hr — +2 high-head pumps</option>
                <option value={900}>900 m³/hr — Max surge dewatering</option>
              </select>
              {dewateringM3h > 0 && (
                <div className="mt-1.5 text-[10px] text-emerald-400 font-mono">
                  +{dewateringGain} MT/day recovery
                </div>
              )}
            </div>
          </div>

          {/* Applied corrective actions */}
          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-xs text-slate-300 font-medium">
                Applied Corrective Actions ({correctiveActions.filter(a => a.status === "Applied").length} active)
              </span>
            </div>
            <span className={`text-xs font-mono font-bold ${appliedActionsGain > 0 ? "text-emerald-400" : "text-slate-500"}`}>
              {appliedActionsGain > 0 ? `+${appliedActionsGain} MT/day` : "0 MT/day"}
            </span>
          </div>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Simulated Production Impact</h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                isTargetMet
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                  : "bg-rose-500/10 text-rose-400 border-rose-500/30"
              }`}>
                {isTargetMet ? "✓ SHORTFALL NEUTRALIZED" : "⚠ SHORTFALL PROJECTED"}
              </span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-4">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-xs text-slate-400">Simulated Daily Extraction:</span>
                <span className={`text-2xl font-bold font-mono ${isTargetMet ? "text-emerald-400" : "text-white"}`}>
                  {simulatedOutput.toLocaleString()} MT/day
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isTargetMet ? "bg-emerald-400" : targetPct >= 80 ? "bg-amber-400" : "bg-rose-500"
                  }`}
                  style={{ width: `${targetPct}%` }}
                />
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-500">Target: {DAILY_TARGET.toLocaleString()} MT</span>
                <span className={isTargetMet ? "text-emerald-400" : "text-rose-400"}>
                  {isTargetMet ? "✓ Target achieved" : `−${netDailyShortfall.toLocaleString()} MT deficit`}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Impact Breakdown</div>
              {weatherPenalty > 0 && (
                <div className="flex justify-between text-slate-400">
                  <span className="flex items-center gap-1"><Droplets className="w-3 h-3 text-cyan-400" /> Rainfall Impact:</span>
                  <span className="text-rose-400 font-mono font-semibold">−{weatherPenalty} MT/day</span>
                </div>
              )}
              {fleetPenalty > 0 && (
                <div className="flex justify-between text-slate-400">
                  <span className="flex items-center gap-1"><Truck className="w-3 h-3 text-amber-400" /> Fleet Breakdown:</span>
                  <span className="text-rose-400 font-mono font-semibold">−{fleetPenalty} MT/day</span>
                </div>
              )}
              {blastingPenalty > 0 && (
                <div className="flex justify-between text-slate-400">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-purple-400" /> Blasting Delay:</span>
                  <span className="text-rose-400 font-mono font-semibold">−{blastingPenalty} MT/day</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400 border-t border-slate-800/80 pt-2">
                <span className="flex items-center gap-1"><TrendingDown className="w-3 h-3 text-rose-400" /> Gross Daily Loss:</span>
                <span className="text-rose-400 font-mono font-semibold">−{rawDailyLoss} MT/day</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3 text-emerald-400" /> Total Mitigations:</span>
                <span className="text-emerald-400 font-mono font-semibold">+{totalRecovery} MT/day</span>
              </div>
              <div className="flex justify-between text-slate-300 font-semibold border-t border-slate-800 pt-2">
                <span>Net 30-Day Extrapolated Deficit:</span>
                <span className={`font-mono ${isTargetMet ? "text-emerald-400" : "text-rose-400"}`}>
                  {isTargetMet ? "0 MT ✓" : `−${deficit30Day.toLocaleString()} MT`}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-800">
            <div className="bg-slate-800 rounded-xl p-2.5 text-center">
              <div className="text-[9px] text-slate-400 uppercase tracking-wider">Daily Output</div>
              <div className="text-sm font-black font-mono text-white mt-0.5">{simulatedOutput.toLocaleString()}</div>
              <div className="text-[9px] text-slate-500">MT / day</div>
            </div>
            <div className="bg-slate-800 rounded-xl p-2.5 text-center">
              <div className="text-[9px] text-slate-400 uppercase tracking-wider">30-Day Proj.</div>
              <div className="text-sm font-black font-mono text-emerald-400 mt-0.5">
                {(simulatedOutput * 30).toLocaleString()}
              </div>
              <div className="text-[9px] text-slate-500">MT / month</div>
            </div>
            <div className="bg-slate-800 rounded-xl p-2.5 text-center">
              <div className="text-[9px] text-slate-400 uppercase tracking-wider">Gap vs Target</div>
              <div className={`text-sm font-black font-mono mt-0.5 ${isTargetMet ? "text-emerald-400" : "text-rose-400"}`}>
                {isTargetMet ? "0" : `−${netDailyShortfall}`}
              </div>
              <div className="text-[9px] text-slate-500">MT / day</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Custom Scenario */}
      <div className="bg-gradient-to-r from-purple-950/30 via-slate-900 to-slate-900 border border-purple-500/30 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-bold text-white">Custom Scenario Simulation (Gemini AI)</h3>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Describe an unexpected event and get an instant tactical recovery plan with estimated MT impact.
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleRunAi(); }}
            placeholder="e.g. Inflow in Balaghat shaft exceeds 1200 LPM and primary crusher jams..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 placeholder-slate-600"
          />
          <button
            onClick={handleRunAi}
            disabled={isSimulating || !customPrompt.trim()}
            className="cursor-pointer bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-md shrink-0 disabled:opacity-50 flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isSimulating ? "Simulating..." : "Simulate Strategy"}
          </button>
        </div>
        {aiResult && (
          <div className="mt-4 bg-slate-950 p-4 rounded-xl border border-purple-800/40 text-xs text-slate-200 leading-relaxed">
            <span className="font-bold text-purple-300 block mb-2">AI Tactical Simulation Response:</span>
            <p>{aiResult}</p>
          </div>
        )}
      </div>

      {/* How it works */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-800 leading-relaxed">
        <div className="font-bold mb-2 flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5" /> How the calculation works:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
          <div>🌧 Rainfall loss: <strong>(mm − 20) × 8.5 MT/day</strong> when &gt; 20 mm</div>
          <div>🚛 Fleet loss: <strong>(85% − avail%) × 18.2 MT/day</strong> below 85%</div>
          <div>💥 Blasting loss: <strong>hours × 35 MT/day</strong></div>
          <div>⚙ Standby dumpers: <strong>count × 85 MT/day</strong> recovery</div>
          <div>💧 Dewatering: <strong>m³/hr × 0.28 MT/day</strong> recovery</div>
          <div>✅ Applied actions: <strong>impactMT ÷ 30 MT/day</strong> each</div>
        </div>
      </div>
    </div>
  );
};
