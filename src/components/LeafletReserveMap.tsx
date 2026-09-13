import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Layers,
  MapPin,
  Satellite,
  Search,
  Eye,
  Crosshair,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  Database,
  Activity,
  AlertTriangle,
} from 'lucide-react';
import { ExplorationTarget } from '../types';
import { TOP_PRIORITY_TARGETS, MOIL_MINE_SITES } from '../data/mockData';

interface LeafletReserveMapProps {
  onSelectTarget?: (target: ExplorationTarget) => void;
  selectedTarget?: ExplorationTarget | null;
}

export const LeafletReserveMap: React.FC<LeafletReserveMapProps> = ({
  onSelectTarget,
  selectedTarget: propSelectedTarget,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const zonesLayerRef = useRef<L.LayerGroup | null>(null);

  const [activeBasemap, setActiveBasemap] = useState<'satellite' | 'streets' | 'topo'>('satellite');
  const [showHeatmapZones, setShowHeatmapZones] = useState(true);
  const [showBoreholes, setShowBoreholes] = useState(true);
  const [selectedTarget, setSelectedTarget] = useState<ExplorationTarget | null>(
    propSelectedTarget || TOP_PRIORITY_TARGETS[0]
  );
  const [filterMinGrade, setFilterMinGrade] = useState<number>(40);
  const [searchQuery, setSearchQuery] = useState('');

  // MOIL Mine Central Coordinates (Balaghat district, MP)
  const CENTER_LAT = 21.825;
  const CENTER_LNG = 80.21;

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Fix default Leaflet icon path issues in Vite
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    const map = L.map(mapContainerRef.current, {
      center: [CENTER_LAT, CENTER_LNG],
      zoom: 11,
      zoomControl: false,
    });

    // Zoom control at top-left
    L.control.zoom({ position: 'topleft' }).addTo(map);

    // Basemaps definition
    const satelliteLayer = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: 'Tiles &copy; Esri, Maxar, Earthstar Geographics',
        maxZoom: 18,
      }
    );

    const streetsLayer = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18,
      }
    );

    const topoLayer = L.tileLayer(
      'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      {
        attribution: '&copy; OpenTopoMap contributors',
        maxZoom: 17,
      }
    );

    satelliteLayer.addTo(map);
    (map as any)._baseLayers = {
      satellite: satelliteLayer,
      streets: streetsLayer,
      topo: topoLayer,
    };

    const layerGroup = L.layerGroup().addTo(map);
    const zonesGroup = L.layerGroup().addTo(map);

    layerGroupRef.current = layerGroup;
    zonesLayerRef.current = zonesGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Basemap Layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const baseLayers = (map as any)._baseLayers;
    if (!baseLayers) return;

    Object.values(baseLayers).forEach((layer: any) => {
      if (map.hasLayer(layer)) {
        map.removeLayer(layer);
      }
    });

    if (activeBasemap === 'satellite') baseLayers.satellite.addTo(map);
    if (activeBasemap === 'streets') baseLayers.streets.addTo(map);
    if (activeBasemap === 'topo') baseLayers.topo.addTo(map);
  }, [activeBasemap]);

  // Update Markers & Zones
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    const zonesGroup = zonesLayerRef.current;
    if (!map || !layerGroup || !zonesGroup) return;

    layerGroup.clearLayers();
    zonesGroup.clearLayers();

    // 1. Draw High-Confidence Reserve Heatmap Zones (Polygons & Circles)
    if (showHeatmapZones) {
      // Balaghat Central Zone
      L.circle([21.815, 80.205], {
        color: '#10B981',
        fillColor: '#10B981',
        fillOpacity: 0.25,
        weight: 2,
        dashArray: '5, 5',
        radius: 3500,
      })
        .bindTooltip('<b>Zone A: Balaghat Central</b><br/>82% Probable Manganese Reserve (~21.4 MT)', {
          permanent: false,
          direction: 'top',
        })
        .addTo(zonesGroup);

      // Ukwa Syncline Zone
      L.circle([21.968, 80.468], {
        color: '#8B5CF6',
        fillColor: '#8B5CF6',
        fillOpacity: 0.22,
        weight: 2,
        dashArray: '5, 5',
        radius: 4200,
      })
        .bindTooltip('<b>Zone B: Ukwa Northeast Syncline</b><br/>79% High Grade Strike (~9.8 MT)', {
          permanent: false,
          direction: 'top',
        })
        .addTo(zonesGroup);

      // Waraseoni West Outcrop
      L.circle([21.821, 80.174], {
        color: '#F59E0B',
        fillColor: '#F59E0B',
        fillOpacity: 0.2,
        weight: 2,
        dashArray: '4, 4',
        radius: 2800,
      })
        .bindTooltip('<b>Zone C: Waraseoni Gondite Belt</b><br/>Near-Surface Braunite (~4.2 MT)', {
          permanent: false,
          direction: 'top',
        })
        .addTo(zonesGroup);

      // 1,000 km2 Exploration Boundary Polygon
      L.polygon(
        [
          [21.72, 80.08],
          [21.98, 80.15],
          [22.02, 80.52],
          [21.78, 80.45],
        ],
        {
          color: '#3B82F6',
          weight: 2,
          fillColor: '#3B82F6',
          fillOpacity: 0.05,
          dashArray: '8, 6',
        }
      )
        .bindTooltip('<b>1,000 km² MOIL Exploration Boundary</b><br/>Balaghat–Sausar Metallogenic Belt', {
          permanent: false,
        })
        .addTo(zonesGroup);
    }

    // 2. Filter Targets
    const visibleTargets = TOP_PRIORITY_TARGETS.filter((t) => {
      const matchGrade = t.estimatedGradeMn >= filterMinGrade;
      const matchSearch =
        t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.formation.toLowerCase().includes(searchQuery.toLowerCase());
      return matchGrade && matchSearch;
    });

    // 3. Render Borehole & Target Markers
    if (showBoreholes) {
      visibleTargets.forEach((target) => {
        const isHighGrade = target.estimatedGradeMn >= 44.0;
        const isMediumGrade = target.estimatedGradeMn >= 42.0 && target.estimatedGradeMn < 44.0;
        const markerColor = isHighGrade ? '#10B981' : isMediumGrade ? '#F59E0B' : '#EF4444';
        const isSelected = selectedTarget?.id === target.id;

        // Custom HTML Marker Icon with Grade and Pin
        const customIcon = L.divIcon({
          className: 'custom-mine-pin',
          html: `
            <div style="
              display: flex;
              flex-direction: column;
              align-items: center;
              transform: translate(-50%, -100%);
              cursor: pointer;
            ">
              <div style="
                background: ${isSelected ? '#1E293B' : markerColor};
                color: white;
                font-weight: 800;
                font-size: 11px;
                padding: 3px 7px;
                border-radius: 6px;
                border: 2px solid white;
                box-shadow: 0 4px 8px rgba(0,0,0,0.35);
                white-space: nowrap;
                display: flex;
                align-items: center;
                gap: 4px;
              ">
                <span>${target.id}</span>
                <span style="background: rgba(255,255,255,0.25); padding: 1px 4px; border-radius: 3px; font-size: 10px;">
                  ${target.estimatedGradeMn}% Mn
                </span>
              </div>
              <div style="
                width: 0;
                height: 0;
                border-left: 6px solid transparent;
                border-right: 6px solid transparent;
                border-top: 8px solid ${isSelected ? '#1E293B' : markerColor};
                margin-top: -1px;
              "></div>
            </div>
          `,
          iconSize: [0, 0],
        });

        const marker = L.marker([target.coordinates.lat, target.coordinates.lng], {
          icon: customIcon,
        });

        // Click Handler
        marker.on('click', () => {
          setSelectedTarget(target);
          if (onSelectTarget) onSelectTarget(target);
          map.setView([target.coordinates.lat, target.coordinates.lng], Math.max(map.getZoom(), 13), {
            animate: true,
          });
        });

        // Popup
        marker.bindPopup(`
          <div style="font-family: inherit; min-width: 220px;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px; margin-bottom: 8px;">
              <strong style="font-size: 13px; color: #0F172A;">${target.id} — ${target.locationName}</strong>
            </div>
            <div style="font-size: 11px; color: #475569; space-y: 4px;">
              <p style="margin: 2px 0;"><strong>Predicted Reserve:</strong> ${(target.estimatedReserveMT / 1000000).toFixed(2)} Million Tonnes</p>
              <p style="margin: 2px 0;"><strong>Ore Grade:</strong> <span style="color: #059669; font-weight: bold;">${target.estimatedGradeMn}% Mn</span></p>
              <p style="margin: 2px 0;"><strong>Drill Depth:</strong> ${target.depthMeters} meters</p>
              <p style="margin: 2px 0;"><strong>Lithology:</strong> ${target.formation}</p>
              <p style="margin: 2px 0;"><strong>Status:</strong> ${target.fieldStatus}</p>
            </div>
          </div>
        `);

        marker.addTo(layerGroup);
      });
    }
  }, [showHeatmapZones, showBoreholes, filterMinGrade, searchQuery, selectedTarget]);

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([CENTER_LAT, CENTER_LNG], 11, { animate: true });
    }
  };

  return (
    <div id="big-accurate-leaflet-map-card" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[750px]">
      {/* Top Map Control Bar */}
      <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-sm font-black text-slate-900 tracking-tight">
              Interactive Manganese Reserve Map (Balaghat Mining Concession)
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-100 text-blue-700">
              LEAFLET GIS ENGINE
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real satellite orthomosaic, borehole drill collar GPS points, and AI-predicted continuous reserve zones
          </p>
        </div>

        {/* Map Basemap & Layer Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Basemap Switcher */}
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
            <button
              onClick={() => setActiveBasemap('satellite')}
              className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                activeBasemap === 'satellite'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Satellite className="w-3.5 h-3.5" />
              <span>Satellite (Esri)</span>
            </button>
            <button
              onClick={() => setActiveBasemap('streets')}
              className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                activeBasemap === 'streets'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Street Map</span>
            </button>
            <button
              onClick={() => setActiveBasemap('topo')}
              className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                activeBasemap === 'topo'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Terrain (Topo)</span>
            </button>
          </div>

          {/* Toggle Heatmap Layer */}
          <button
            onClick={() => setShowHeatmapZones(!showHeatmapZones)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${
              showHeatmapZones
                ? 'bg-purple-50 text-purple-700 border-purple-200'
                : 'bg-white text-slate-500 border-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Reserve Zones</span>
          </button>

          {/* Toggle Boreholes */}
          <button
            onClick={() => setShowBoreholes(!showBoreholes)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${
              showBoreholes
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-white text-slate-500 border-slate-200'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>Borehole Assays</span>
          </button>

          {/* Reset / Recenter Button */}
          <button
            onClick={handleRecenter}
            className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Recenter Map on Balaghat"
          >
            <Crosshair className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Map + Selected Inspector Sidebar Layout */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 relative">
        {/* Leaflet Map Canvas */}
        <div className="flex-1 h-full min-h-[420px] relative z-10">
          <div ref={mapContainerRef} className="w-full h-full" />

          {/* Floating Search & Filter Bar on Map */}
          <div className="absolute top-3 right-3 z-[1000] bg-white/95 backdrop-blur rounded-xl border border-slate-200 p-2 shadow-lg flex items-center gap-2 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 ml-1" />
            <input
              type="text"
              placeholder="Search target, zone, or village..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs bg-transparent border-none focus:outline-none w-44 placeholder-slate-400 font-medium"
            />
            <select
              value={filterMinGrade}
              onChange={(e) => setFilterMinGrade(Number(e.target.value))}
              className="text-xs border border-slate-200 rounded-md px-1.5 py-1 text-slate-700 font-semibold focus:outline-none bg-slate-50"
            >
              <option value={35}>All Grades (≥35%)</option>
              <option value={40}>Grade ≥ 40% Mn</option>
              <option value={44}>High Grade ≥ 44% Mn</option>
            </select>
          </div>

          {/* Floating Legend on Map */}
          <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur p-3 rounded-xl border border-slate-200 shadow-lg text-xs space-y-1.5 max-w-[210px]">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1 border-b border-slate-100 pb-1">
              Manganese Grade Legend
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
              <span className="font-bold text-slate-800 text-[11px]">High Grade (≥ 44% Mn)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-400 shrink-0" />
              <span className="font-semibold text-slate-700 text-[11px]">Medium Grade (40–43% Mn)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0" />
              <span className="font-medium text-slate-600 text-[11px]">Inferred / Low (&lt; 40% Mn)</span>
            </div>
          </div>
        </div>

        {/* Selected Target Reserve Inspector Sidebar */}
        {selectedTarget && (
          <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-slate-200 bg-white p-5 overflow-y-auto space-y-4 shrink-0 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Header */}
              <div className="border-b border-slate-100 pb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-700">
                    TARGET INSPECTION
                  </span>
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {selectedTarget.fieldStatus}
                  </span>
                </div>
                <h4 className="text-base font-black text-slate-900 leading-tight">
                  {selectedTarget.id} — {selectedTarget.locationName}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  GPS: {selectedTarget.coordinates.lat.toFixed(4)}°N, {selectedTarget.coordinates.lng.toFixed(4)}°E
                </p>
              </div>

              {/* 4 Core Quantitative Metrics (Outputs) */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                  <div className="text-[10px] text-slate-500 font-semibold">Predicted Reserve</div>
                  <div className="text-lg font-black text-slate-900 mt-0.5">
                    {(selectedTarget.estimatedReserveMT / 1000000).toFixed(2)} MT
                  </div>
                  <div className="text-[9px] text-emerald-600 font-bold">UNFC 111 / 121 Proved</div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                  <div className="text-[10px] text-slate-500 font-semibold">Ore Grade (% Mn)</div>
                  <div className="text-lg font-black text-emerald-600 mt-0.5">
                    {selectedTarget.estimatedGradeMn}%
                  </div>
                  <div className="text-[9px] text-slate-500 font-medium">Metallurgical Grade</div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                  <div className="text-[10px] text-slate-500 font-semibold">Borehole Depth</div>
                  <div className="text-lg font-black text-slate-900 mt-0.5">
                    {selectedTarget.depthMeters} m
                  </div>
                  <div className="text-[9px] text-slate-500 font-medium">Overburden: 8-12m</div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                  <div className="text-[10px] text-slate-500 font-semibold">AI Confidence</div>
                  <div className="text-lg font-black text-blue-600 mt-0.5">
                    {Math.round(selectedTarget.confidence * 100)}%
                  </div>
                  <div className="text-[9px] text-slate-500 font-medium">3D Kriging Model</div>
                </div>
              </div>

              {/* Space Tech & Satellite Inputs Feed */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Satellite className="w-3.5 h-3.5 text-blue-600" />
                  <span>Integrated Satellite Inputs</span>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">ASTER SWIR (B12/B11 Ratio):</span>
                    <span className="font-bold text-slate-800">{selectedTarget.satelliteIndicators.swirBandRatio}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Vegetation Index (NDVI):</span>
                    <span className="font-bold text-slate-800">{selectedTarget.satelliteIndicators.ndvi} (Stress Outcrop)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Land Surface Temp (LST):</span>
                    <span className="font-bold text-slate-800">{selectedTarget.satelliteIndicators.lstCelsius}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">SAR Soil Moisture:</span>
                    <span className="font-bold text-slate-800">{selectedTarget.satelliteIndicators.soilMoisturePercent}%</span>
                  </div>
                </div>
              </div>

              {/* Host Lithology */}
              <div>
                <div className="text-xs font-bold text-slate-800 mb-1">Host Formation & Lithology:</div>
                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200/70">
                  {selectedTarget.formation}
                </p>
              </div>

              {/* Recommended Action */}
              <div>
                <div className="text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>AI Recommended Exploration Action:</span>
                </div>
                <p className="text-xs text-purple-900 bg-purple-50 p-2.5 rounded-lg border border-purple-200 leading-relaxed font-medium">
                  {selectedTarget.recommendedAction}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
