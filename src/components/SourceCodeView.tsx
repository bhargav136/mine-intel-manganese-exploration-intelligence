import React, { useState } from "react";
import { Code, Download, ExternalLink, Copy, Check, Folder, FileCode, Server, Layers, Terminal, Github } from "lucide-react";

export const SourceCodeView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<"frontend" | "backend" | "architecture" | "setup">("frontend");
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedFile(label);
    setTimeout(() => setCopiedFile(null), 2500);
  };

  const backendCode = [
    "// api/index.ts - Express Serverless API",
    "import express from 'express';",
    "import { GoogleGenAI } from '@google/genai';",
    "",
    "const app = express();",
    "app.use(express.json());",
    "",
    "app.post('/api/gemini/chat', async (req, res) => {",
    "  const { message, apiKey } = req.body;",
    "  const ai = new GoogleGenAI({ apiKey: apiKey || process.env.GEMINI_API_KEY });",
    "  const response = await ai.models.generateContent({",
    "    model: 'gemini-2.5-flash',",
    "    contents: message",
    "  });",
    "  res.json({ reply: response.text });",
    "});",
    "",
    "export default app;",
  ].join("\n");

  const frontendCode = [
    "// src/components/LeafletReserveMap.tsx",
    "import React, { useEffect, useRef } from 'react';",
    "import 'leaflet/dist/leaflet.css';",
    "import L from 'leaflet';",
    "",
    "export const LeafletReserveMap = ({ targets }) => {",
    "  const mapRef = useRef(null);",
    "",
    "  useEffect(() => {",
    "    const map = L.map('map', { center: [21.8124, 80.1852], zoom: 13 });",
    "    L.tileLayer('https://server.arcgisonline.com/.../MapServer/tile/{z}/{y}/{x}', {",
    "      attribution: 'Esri World Imagery'",
    "    }).addTo(map);",
    "    targets.forEach(t => {",
    "      L.circleMarker([t.coordinates.lat, t.coordinates.lng], {",
    "        radius: 8, fillColor: '#10b981', color: '#fff'",
    "      }).bindPopup(t.locationName).addTo(map);",
    "    });",
    "    setTimeout(() => map.invalidateSize(), 100);",
    "  }, []);",
    "",
    "  return <div ref={mapRef} id='map' style={{ height: '100%' }} />;",
    "};",
  ].join("\n");

  const archText = [
    "// INPUTS (9 Data Feeds)",
    "  Geological  : Rock type, % Mn grade, Sausar Belt contacts",
    "  Drilling    : 100+ GSI boreholes, core depth, recovery %",
    "  Production  : Daily/monthly targets vs actual 10,824 MT",
    "  Equipment   : EX-04 shovel downtime, hydraulic failure logs",
    "  Weather     : 72mm precipitation, pit slurry alerts (IMD)",
    "  Satellite   : ASTER SWIR B12/B11, Sentinel-2 NDVI, LST",
    "",
    "// AI PROCESSING",
    "  Kriging Engine  : 100 boreholes -> 3D continuous reserve grid",
    "  SARIMA ML       : 4-week production forecast (vs 13,200 MT)",
    "  Root-Cause AI   : EX-04 45% + Rain 35% + Blasting 20%",
    "  Prescriptive    : +980 MT recovery via pit redeployment",
    "",
    "// OUTPUTS (8 Actionable Results)",
    "  Reserve Map     : Leaflet GIS Satellite with borehole pins",
    "  Shortfall Alert : -18% deficit early warning",
    "  Corrective Jobs : Quantified workorders (+980 MT)",
    "  Geodatabase     : MongoDB Atlas audit trail (DGMS)",
  ].join("\n");

  const tabs = [
    { id: "frontend", label: "Frontend Code", icon: <Folder className="w-4 h-4" /> },
    { id: "backend", label: "Backend Code", icon: <Server className="w-4 h-4" /> },
    { id: "architecture", label: "System Architecture", icon: <Layers className="w-4 h-4" /> },
    { id: "setup", label: "Local Setup", icon: <Terminal className="w-4 h-4" /> },
  ] as const;

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 mb-3">
            <Code className="w-3.5 h-3.5" /> Full Stack Source Code
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Frontend &amp; Backend Code Repository
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl mt-1.5 leading-relaxed">
            Complete MOIL MINE-INTEL codebase: React + TypeScript + Tailwind CSS + Leaflet GIS + Express Serverless API + MongoDB Atlas + Google Gemini GenAI SDK.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <a
            href="https://github.com/bhargav136/mine-intel-manganese-exploration-intelligence"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold shadow-sm transition-all"
          >
            <Github className="w-4 h-4" />
            <span>GitHub Repository</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>
          <a
            href="https://github.com/bhargav136/mine-intel-manganese-exploration-intelligence/archive/refs/heads/main.zip"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download ZIP</span>
          </a>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id)}
            className={
              "cursor-pointer px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all " +
              (activeCategory === tab.id
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200")
            }
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Frontend Panel */}
      {activeCategory === "frontend" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "Framework", value: "React 18 + Vite", color: "text-blue-600", desc: "TypeScript SPA with instant HMR" },
              { label: "GIS Satellite Map", value: "Leaflet.js + Esri", color: "text-emerald-600", desc: "Satellite tiles, drill pins, reserve polygons" },
              { label: "Styling", value: "Tailwind CSS v4", color: "text-purple-600", desc: "Pure white/light enterprise theme" },
            ].map((card) => (
              <div key={card.label} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <span className={"text-[10px] font-extrabold uppercase " + card.color}>{card.label}</span>
                <h4 className="font-bold text-slate-900 text-sm mt-0.5">{card.value}</h4>
                <p className="text-xs text-slate-500 mt-1">{card.desc}</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-800">LeafletReserveMap.tsx</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">GIS Map</span>
              </div>
              <button
                onClick={() => copyToClipboard(frontendCode, "frontend")}
                className="cursor-pointer text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 px-2.5 py-1 rounded bg-white border border-slate-200"
              >
                {copiedFile === "frontend" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedFile === "frontend" ? "Copied!" : "Copy"}</span>
              </button>
            </div>
            <pre className="p-4 text-xs font-mono text-slate-100 overflow-x-auto bg-slate-900 max-h-[350px] whitespace-pre">
              <code>{frontendCode}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Backend Panel */}
      {activeCategory === "backend" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "AI Intelligence", value: "Google Gemini 2.5 Flash", color: "text-rose-600", desc: "Root-cause analysis and geological query answering" },
              { label: "Cloud Storage", value: "MongoDB Atlas", color: "text-emerald-600", desc: "Users, verified targets, audit logs, settings" },
              { label: "Runtime", value: "Vercel Serverless", color: "text-amber-600", desc: "Auto-scaling Node.js on AWS Mumbai" },
            ].map((card) => (
              <div key={card.label} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <span className={"text-[10px] font-extrabold uppercase " + card.color}>{card.label}</span>
                <h4 className="font-bold text-slate-900 text-sm mt-0.5">{card.value}</h4>
                <p className="text-xs text-slate-500 mt-1">{card.desc}</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-rose-600" />
                <span className="text-xs font-bold text-slate-800">api/index.ts</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold">Serverless API</span>
              </div>
              <button
                onClick={() => copyToClipboard(backendCode, "backend")}
                className="cursor-pointer text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 px-2.5 py-1 rounded bg-white border border-slate-200"
              >
                {copiedFile === "backend" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedFile === "backend" ? "Copied!" : "Copy"}</span>
              </button>
            </div>
            <pre className="p-4 text-xs font-mono text-slate-100 overflow-x-auto bg-slate-900 max-h-[350px] whitespace-pre">
              <code>{backendCode}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Architecture Panel */}
      {activeCategory === "architecture" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">System Architecture &amp; Data Flow</h3>
          <pre className="p-5 rounded-xl bg-slate-900 text-emerald-400 text-xs font-mono leading-relaxed overflow-x-auto whitespace-pre">
            <code>{archText}</code>
          </pre>
        </div>
      )}

      {/* Setup Panel */}
      {activeCategory === "setup" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          <h3 className="text-base font-bold text-slate-900">Running the Project Locally</h3>
          {[
            { n: "1", title: "Clone the Repository", code: "git clone https://github.com/bhargav136/mine-intel-manganese-exploration-intelligence.git" },
            { n: "2", title: "Install Dependencies", code: "cd mine-intel-manganese-exploration-intelligence\nnpm install" },
            { n: "3", title: "Start Development Server", code: "npm run dev" },
          ].map((step) => (
            <div key={step.n} className="flex items-start gap-4">
              <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">{step.n}</span>
              <div className="flex-1 space-y-2">
                <p className="text-xs font-bold text-slate-900">{step.title}</p>
                <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg font-mono text-xs whitespace-pre">{step.code}</pre>
              </div>
            </div>
          ))}
          <p className="text-xs text-slate-500 mt-2">Opens at <span className="font-mono text-blue-600">http://localhost:5173</span> with full hot-reloading.</p>
        </div>
      )}
    </div>
  );
};
