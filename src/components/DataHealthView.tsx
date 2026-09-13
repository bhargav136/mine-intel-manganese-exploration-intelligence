import React, { useState } from 'react';
import {
  Database,
  Satellite,
  Radio,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Server,
  Wifi,
  Layers,
  Wrench,
  TrendingUp,
  CloudRain,
  MapPin,
  ShieldCheck,
  Activity,
  HardHat,
  Search,
} from 'lucide-react';

export const DataHealthView: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Subsurface' | 'Telemetry' | 'Space'>('All');

  const nineInputs = [
    {
      id: 'input-1',
      category: '1. Geological Data',
      group: 'Subsurface',
      icon: <Layers className="w-5 h-5 text-blue-600" />,
      inputs: ['Rock type (Quartz-muscovite schist)', 'Mineral composition (Braunite, Pyrolusite, Psilomelane)', 'Ore grade (% Mn)', 'GSI 1:50,000 geological stratigraphy maps'],
      source: 'Geological Survey of India (GSI) & MOIL Exploration Archives',
      status: 'Synchronized',
      lastUpdate: 'Daily at 06:00 IST',
      recordCount: '1,420 mapped polygons',
    },
    {
      id: 'input-2',
      category: '2. Drilling Data',
      group: 'Subsurface',
      icon: <HardHat className="w-5 h-5 text-emerald-600" />,
      inputs: ['Borehole depth (15m - 120m)', 'Drill collar GPS coordinates', 'Manganese concentration (%) per run', 'Core recovery percentage (avg 94.2%)'],
      source: 'Central Laboratory LIMS & Infill Diamond Drilling Fleet',
      status: 'Synchronized',
      lastUpdate: 'Today 08:30 IST',
      recordCount: '100+ diamond core assays',
    },
    {
      id: 'input-3',
      category: '3. Historical Production',
      group: 'Telemetry',
      icon: <TrendingUp className="w-5 h-5 text-amber-600" />,
      inputs: ['Daily & monthly ore tonnage produced', 'Target vs actual dispatch rate', 'Sump stockpiles and blending silo inventory'],
      source: 'MOIL SAP ERP & Weighbridge Automatic Telemetry',
      status: 'Live Stream',
      lastUpdate: '15 mins ago',
      recordCount: '3 years historical run rate',
    },
    {
      id: 'input-4',
      category: '4. Equipment Data',
      group: 'Telemetry',
      icon: <Wrench className="w-5 h-5 text-purple-600" />,
      inputs: ['Machine availability (OEE %)', 'Operating hours and shift logs', 'Breakdown occurrences and hydraulic pressure logs', 'Downtime attribution (EX-04 Shovel)'],
      source: 'Komatsu & BEML Heavy Earth Moving Machinery (HEMM) CANBus IoT',
      status: 'Live Stream',
      lastUpdate: 'Real-time (1 Hz edge mesh)',
      recordCount: '24 dumpers, 6 shovels active',
    },
    {
      id: 'input-5',
      category: '5. Mining Operations',
      group: 'Telemetry',
      icon: <Activity className="w-5 h-5 text-rose-600" />,
      inputs: ['Blasting schedules & delay sequences', 'Bench excavation advance rate', 'Daily shift rosters and dumper cycle times'],
      source: 'Mine Dispatch Control Office (Balaghat & Ukwa)',
      status: 'Synchronized',
      lastUpdate: 'Shift handover (14:00 IST)',
      recordCount: '4 working benches logged',
    },
    {
      id: 'input-6',
      category: '6. Weather Data',
      group: 'Telemetry',
      icon: <CloudRain className="w-5 h-5 text-sky-600" />,
      inputs: ['Precipitation (mm/24h radar)', 'Ambient pit temperature (°C)', 'Relative humidity (%)', 'Extreme rainfall early warnings'],
      source: 'IMD Doppler Meteorological Radar (Nagpur Station) & On-site Davis Weather Station',
      status: 'Live Stream',
      lastUpdate: '4 mins ago',
      recordCount: '72mm rain recorded in pit',
    },
    {
      id: 'input-7',
      category: '7. Satellite Data',
      group: 'Space',
      icon: <Satellite className="w-5 h-5 text-indigo-600" />,
      inputs: ['Soil moisture radar (Sentinel-1 C-band)', 'Vegetation index (NDVI stress over gossan)', 'Land surface temperature (Landsat-9 TIR)', 'ASTER SWIR (B12/B11) mineral absorption'],
      source: 'ESA Copernicus Open Access Hub & NASA EarthData',
      status: 'Healthy',
      lastUpdate: '14 hrs ago (Tile 44QMF)',
      recordCount: '10m x 10m multi-spectral grid',
    },
    {
      id: 'input-8',
      category: '8. Location Data',
      group: 'Space',
      icon: <MapPin className="w-5 h-5 text-teal-600" />,
      inputs: ['Mine lease boundary coordinates', 'GPS collar coordinates for all targets', 'Digital Elevation Models (SRTM 30m terrain)', 'Haul road slope gradient and bench topography'],
      source: 'DGMS Concession Cadastral Database & Drone Orthophotos',
      status: 'Synchronized',
      lastUpdate: 'Current Leasehold Cycle',
      recordCount: '1,000 km² Balaghat concession',
    },
    {
      id: 'input-9',
      category: '9. Operational Constraints',
      group: 'Telemetry',
      icon: <ShieldCheck className="w-5 h-5 text-red-600" />,
      inputs: ['Blasting clearance delays', 'Transportation haulage slowdowns', 'Dewatering pump capacity (P-03)', 'DGMS safety compliance restrictions'],
      source: 'DGMS Safety Compliance Officer & Mine Manager Log',
      status: 'Active Monitoring',
      lastUpdate: '1 hour ago',
      recordCount: '3 active operational alerts',
    },
  ];

  const filteredInputs = selectedFilter === 'All'
    ? nineInputs
    : nineInputs.filter(item => item.group === selectedFilter);

  return (
    <div id="data-health-view" className="p-6 space-y-6 max-w-[1600px] mx-auto bg-[#F8FAFC]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                System Data Inputs & Telemetry Feeds
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                9 Active Feeds
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive catalogue of all 9 multi-source data categories ingested by the MINE-INTEL AI pipeline
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          {(['All', 'Subsurface', 'Telemetry', 'Space'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                selectedFilter === filter
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* 9 Inputs Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInputs.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3 hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900 leading-snug">
                      {item.category}
                    </h3>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {item.group} Data
                    </span>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  {item.status}
                </span>
              </div>

              {/* Data Items List */}
              <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/80 mt-3 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Ingested Parameters:
                </span>
                {item.inputs.map((param, pIdx) => (
                  <div key={pIdx} className="flex items-start gap-1.5 text-xs text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                    <span>{param}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Source & Frequency Footer */}
            <div className="pt-3 border-t border-slate-100 space-y-1.5 text-[11px]">
              <div className="flex justify-between text-slate-600">
                <span className="text-slate-400">Data Source:</span>
                <span className="font-semibold text-slate-800 text-right truncate max-w-[180px]" title={item.source}>
                  {item.source}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="text-slate-400">Update Cadence:</span>
                <span className="font-semibold text-blue-600">{item.lastUpdate}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="text-slate-400">Sample Records:</span>
                <span className="font-bold text-emerald-700 font-mono">{item.recordCount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
