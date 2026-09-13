import React from 'react';
import {
  Database,
  Satellite,
  Radio,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Server,
  Wifi,
} from 'lucide-react';

export const DataHealthView: React.FC = () => {
  const telemetryFeeds = [
    {
      name: 'ESA Sentinel-2 Multispectral MSI',
      type: 'Earth Observation Satellite',
      frequency: 'Every 5 Days',
      lastPass: '14 hours ago (Tile 44QMF)',
      status: 'Healthy',
      latency: '2.1 hrs processing delay',
    },
    {
      name: 'USGS Landsat-9 Thermal Infrared (TIR)',
      type: 'Thermal Inertia & LST',
      frequency: 'Every 8 Days',
      lastPass: '2 days ago',
      status: 'Healthy',
      latency: '3.4 hrs processing delay',
    },
    {
      name: 'NASA / ESA Sentinel-1 SAR & SMAP',
      type: 'Soil Moisture Radar',
      frequency: 'Every 6 Days',
      lastPass: '18 hours ago',
      status: 'Healthy',
      latency: '1.8 hrs processing delay',
    },
    {
      name: 'IMD Doppler Weather Radar (Nagpur Station)',
      type: 'Meteorological Radar',
      frequency: 'Real-time (15 min interval)',
      lastPass: '4 mins ago',
      status: 'Healthy',
      latency: '30 sec stream latency',
    },
    {
      name: 'HEMM Heavy Equipment CANBus IoT Fleet',
      type: 'Komatsu & BEML Shovels/Dumpers',
      frequency: 'Continuous 1 Hz Telemetry',
      lastPass: 'Active (24/24 trucks online)',
      status: 'Healthy',
      latency: 'Sub-second edge mesh',
    },
    {
      name: 'MOIL Central Laboratory LIMS Assay Sync',
      type: 'Core Chemical Assay Database',
      frequency: 'Batch Daily Sync',
      lastPass: 'Today at 08:30 IST',
      status: 'Healthy',
      latency: 'Synchronized',
    },
  ];

  return (
    <div
      id="data-health-view"
      className="p-6 space-y-6 max-w-[1600px] mx-auto"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Data Health & Earth Observation Telemetry Feeds
            </h2>
            <p className="text-xs text-slate-500">
              Operational status of space assets, satellite passes, IoT vehicle telemetry, and borehole LIMS
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            All 6 Telemetry Ingest Pipelines Operational
          </span>
        </div>
      </div>

      {/* Telemetry Stream Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {telemetryFeeds.map((feed, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-600">
                  <Satellite className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                    {feed.name}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {feed.type}
                  </span>
                </div>
              </div>

              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3" />
                {feed.status}
              </span>
            </div>

            <div className="space-y-1 text-xs pt-2 border-t border-slate-100">
              <div className="flex justify-between text-slate-600">
                <span className="text-slate-400">Revisit Frequency:</span>
                <span className="font-semibold">{feed.frequency}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="text-slate-400">Last Telemetry Pass:</span>
                <span className="font-semibold text-slate-800">{feed.lastPass}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="text-slate-400">Data Pipeline Latency:</span>
                <span className="font-semibold text-blue-600">{feed.latency}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
