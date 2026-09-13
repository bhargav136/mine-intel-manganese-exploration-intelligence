import React, { useState } from 'react';
import {
  Code,
  Download,
  ExternalLink,
  Copy,
  Check,
  Folder,
  FileCode,
  Server,
  Layers,
  Terminal,
  Database,
  Github,
} from 'lucide-react';

export const SourceCodeView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'frontend' | 'backend' | 'architecture' | 'setup'>('frontend');
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFile(label);
    setTimeout(() => setCopiedFile(null), 2500);
  };

  const codeSnippets = {
    backendApi: `// api/index.ts - Vercel Serverless Backend / Express API Entry
import express from 'express';
import { GoogleGenAI } from '@google/genai';
import { getMongoDb, getMongoStatus, getUsersAsync } from '../server_mongo';

const app = express();
app.use(express.json());

// 1. Google Gemini AI Generative Route
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { message, context, apiKey } = req.body;
    const activeKey = apiKey || process.env.GEMINI_API_KEY;
    if (!activeKey) {
      return res.status(400).json({ error: 'Gemini API key missing' });
    }
    const ai = new GoogleGenAI({ apiKey: activeKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: \`System Context: MOIL Manganese Exploration Platform. \${context}\\n\\nUser: \${message}\`
    });
    return res.json({ reply: response.text });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// 2. MongoDB Atlas Target & Auth Routes
app.get('/api/database/status', async (req, res) => {
  const status = await getMongoStatus();
  res.json(status);
});

export default app;`,

    serverMongo: `// server_mongo.ts - MongoDB Atlas Cloud Connection & Schema Models
import { MongoClient, Db } from 'mongodb';

let client: MongoClient | null = null;
let db: Db | null = null;

const MONGODB_URI = process.env.MONGODB_URI || '';
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'mine_intel';

export async function getMongoDb(): Promise<Db | null> {
  if (db) return db;
  if (!MONGODB_URI) return null;
  try {
    client = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    await client.connect();
    db = client.db(MONGODB_DB_NAME);
    console.log('MongoDB Atlas Connected successfully');
    return db;
  } catch (err) {
    console.error('MongoDB Atlas Connection Error:', err);
    return null;
  }
}

export async function getVerifiedTargets() {
  const database = await getMongoDb();
  if (!database) return [];
  return database.collection('verified_targets').find({}).toArray();
}`,

    leafletMap: `// src/components/LeafletReserveMap.tsx - Leaflet Satellite Engine
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export const LeafletReserveMap: React.FC<{ targets: any[] }> = ({ targets }) => {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map('leaflet-map-canvas', {
        center: [21.8124, 80.1852],
        zoom: 13,
      });

      // Esri High-Resolution World Satellite Tiles
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Esri, Maxar, Earthstar Geographics, CNES/Airbus DS',
        maxZoom: 19,
      }).addTo(map);

      // Render Borehole Drill Markers with Manganese Grade
      targets.forEach((t) => {
        const marker = L.circleMarker([t.coordinates.lat, t.coordinates.lng], {
          radius: 8,
          fillColor: t.score > 85 ? '#ef4444' : '#10b981',
          color: '#ffffff',
          weight: 2,
          fillOpacity: 0.9,
        }).addTo(map);

        marker.bindPopup(\`<b>\${t.id}: \${t.locationName}</b><br/>Mn Grade: \${t.estimatedGradeMn}%<br/>Reserve: \${t.estimatedReserveMT} MT\`);
      });

      mapRef.current = map;
    }
  }, [targets]);

  return <div id="leaflet-map-canvas" className="w-full h-full min-h-[500px] rounded-xl" />;
};`,

    appRouter: `// src/App.tsx - Dynamic Router & Authentication Engine
import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { LoginPage } from './components/LoginPage';
import { LandingPage } from './components/LandingPage';
import { ProjectOverviewView } from './components/ProjectOverviewView';

export default function App() {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<'login' | 'home' | 'register'>('login');

  // Authenticated State -> Enters Dashboard directly
  if (user) {
    return <DashboardView initialTab="project-overview" />;
  }

  // Unauthenticated State -> Shows Login by default
  if (currentView === 'home') {
    return <LandingPage onOpenLogin={() => setCurrentView('login')} />;
  }

  return (
    <LoginPage
      isOpen={true}
      initialTab={currentView === 'register' ? 'signup' : 'signin'}
      onViewLanding={() => setCurrentView('home')}
    />
  );
}`,
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200/80 mb-3">
            <Code className="w-3.5 h-3.5" /> Full Stack Source Code & Architecture
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Frontend & Backend Code Repository
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl mt-1.5 leading-relaxed">
            Access the complete production codebase for MOIL MINE-INTEL. Built with modern TypeScript, React, Tailwind CSS, Leaflet GIS, Express Serverless API, MongoDB Atlas, and Google Gemini GenAI SDK.
          </p>
        </div>

        {/* Action Buttons */}
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
            <span>Download ZIP Code</span>
          </a>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'frontend', label: 'Frontend Code (React + Leaflet)', icon: <Folder className="w-4 h-4" /> },
          { id: 'backend', label: 'Backend Code (Express + MongoDB)', icon: <Server className="w-4 h-4" /> },
          { id: 'architecture', label: 'Architecture & System Pipeline', icon: <Layers className="w-4 h-4" /> },
          { id: 'setup', label: 'Local Setup & Run Instructions', icon: <Terminal className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id as any)}
            className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeCategory === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Panels */}
      {activeCategory === 'frontend' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-extrabold uppercase text-blue-600">Framework</span>
              <h4 className="font-bold text-slate-900 text-sm mt-0.5">React 18 + Vite</h4>
              <p className="text-xs text-slate-500 mt-1">High-performance SPA with TypeScript compilation and instant HMR.</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-extrabold uppercase text-emerald-600">GIS Satellite Mapping</span>
              <h4 className="font-bold text-slate-900 text-sm mt-0.5">Leaflet.js + Esri World Imagery</h4>
              <p className="text-xs text-slate-500 mt-1">Satellite tile layers, borehole drill collar pins, and continuous reserve polygons.</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-extrabold uppercase text-purple-600">Styling & UI</span>
              <h4 className="font-bold text-slate-900 text-sm mt-0.5">Tailwind CSS v4</h4>
              <p className="text-xs text-slate-500 mt-1">Pure light theme design matching professional enterprise dashboards.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-800">src/components/LeafletReserveMap.tsx</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">GIS Map</span>
              </div>
              <button
                onClick={() => copyToClipboard(codeSnippets.leafletMap, 'leaflet')}
                className="cursor-pointer text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 px-2.5 py-1 rounded bg-white border border-slate-200"
              >
                {copiedFile === 'leaflet' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedFile === 'leaflet' ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
            <pre className="p-4 text-xs font-mono text-slate-100 overflow-x-auto bg-slate-900 max-h-[350px]">
              <code>{codeSnippets.leafletMap}</code>
            </pre>
          </div>
        </div>
      )}

      {activeCategory === 'backend' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-extrabold uppercase text-rose-600">AI Intelligence</span>
              <h4 className="font-bold text-slate-900 text-sm mt-0.5">Google Gemini GenAI SDK</h4>
              <p className="text-xs text-slate-500 mt-1">Automated root-cause analysis, reserve synthesis, and geological query answering.</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-extrabold uppercase text-emerald-600">Cloud Storage</span>
              <h4 className="font-bold text-slate-900 text-sm mt-0.5">MongoDB Atlas</h4>
              <p className="text-xs text-slate-500 mt-1">Multi-collection persistence for users, verified targets, logs, and settings.</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-extrabold uppercase text-amber-600">Runtime</span>
              <h4 className="font-bold text-slate-900 text-sm mt-0.5">Vercel Serverless / Node.js</h4>
              <p className="text-xs text-slate-500 mt-1">Zero-maintenance autoscaling serverless functions on AWS Mumbai cluster.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-rose-600" />
                <span className="text-xs font-bold text-slate-800">api/index.ts</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold">Serverless Router</span>
              </div>
              <button
                onClick={() => copyToClipboard(codeSnippets.backendApi, 'backendApi')}
                className="cursor-pointer text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 px-2.5 py-1 rounded bg-white border border-slate-200"
              >
                {copiedFile === 'backendApi' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedFile === 'backendApi' ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
            <pre className="p-4 text-xs font-mono text-slate-100 overflow-x-auto bg-slate-900 max-h-[350px]">
              <code>{codeSnippets.backendApi}</code>
            </pre>
          </div>
        </div>
      )}

      {activeCategory === 'architecture' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900">System Architecture & Data Flow</h3>
          <div className="p-4 rounded-xl bg-slate-900 text-emerald-400 text-xs font-mono leading-relaxed overflow-x-auto">
            <div className="text-blue-400 font-bold">// 1. MULTI-SOURCE INPUTS (9 Feeds)</div>
            <div>├── Geological Data (Rock Type, % Mn Grade, Sausar Belt Contacts)</div>
            <div>├── Drilling Data (100+ GSI Borehole Cores, Depth, Recovery %)</div>
            <div>├── Historical Telemetry (Daily/Monthly targets vs actual 10,824 MT)</div>
            <div>├── Equipment Telemetry (EX-04 Shovel availability, hydraulic failure logs)</div>
            <div>├── Weather Radar (72mm precipitation, pit slurry slipping)</div>
            <div>└── Satellite Observations (ASTER SWIR B12/B11, Sentinel-2 NDVI, LST)</div>
            <br />
            <div className="text-emerald-400 font-bold">// 2. AI/ML PROCESSING LAYER</div>
            <div>├── Spatial Kriging Engine (Converts 100 borehole points into 3D continuous reserve grid)</div>
            <div>├── SARIMA Production Forecaster (Projects 4-week output vs 13,200 MT monthly capacity)</div>
            <div>├── Root-Cause Attribution Engine (EX-04 downtime 45% + Rain 35% + Blasting 20%)</div>
            <div>└── Prescriptive Optimization Algorithm (+980 MT recovered via pit redeployment)</div>
            <br />
            <div className="text-purple-400 font-bold">// 3. ACTIONABLE OUTPUTS & PERSISTENCE</div>
            <div>├── Interactive Leaflet Satellite GIS Map (High confidence drill coordinates)</div>
            <div>├── Production Shortfall Early Warning (-18% deficit alert)</div>
            <div>├── Quantified Corrective Action Workorders (+980 MT recovery)</div>
            <div>└── MongoDB Atlas Geodatabase (Audit trail, verified targets, DGMS compliance)</div>
          </div>
        </div>
      )}

      {activeCategory === 'setup' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900">Running the Project Locally</h3>
          <ol className="space-y-4 text-xs text-slate-700">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">
                1
              </span>
              <div className="space-y-1.5 flex-1">
                <span className="font-bold text-slate-900">Clone the GitHub Repository</span>
                <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg font-mono">
                  git clone https://github.com/bhargav136/mine-intel-manganese-exploration-intelligence.git
                </pre>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">
                2
              </span>
              <div className="space-y-1.5 flex-1">
                <span className="font-bold text-slate-900">Install Node.js Dependencies</span>
                <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg font-mono">
                  cd mine-intel-manganese-exploration-intelligence
                  npm install
                </pre>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">
                3
              </span>
              <div className="space-y-1.5 flex-1">
                <span className="font-bold text-slate-900">Launch the Development Server</span>
                <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg font-mono">
                  npm run dev
                </pre>
                <p className="text-slate-500">Opens instantly at http://localhost:5173 with full hot-reloading.</p>
              </div>
            </li>
          </ol>
        </div>
      )}
    </div>
  );
};
