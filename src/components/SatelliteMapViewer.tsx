import React, { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  Satellite, Layers, Compass, Flame, Droplet, Leaf, Sparkles, MapPin, Target,
} from "lucide-react";

interface SatelliteMapViewerProps {
  selectedRegion?: string;
}

const MINE_DATA: Record<string, {
  label: string; center: [number, number]; district: string; state: string;
  formation: string; grade: string;
  boreholes: { id: string; mnGrade: number; depth: number; lithology: string; recovery: number }[];
  satellite: { ndvi: string; lst: string; moisture: string; insar: string; rainfall: string; sensor: string };
}> = {
  balaghat: {
    label: "Balaghat Mine (Asia's Deepest Manganese Mine)",
    center: [21.8129, 80.1837],
    district: "Balaghat",
    state: "Madhya Pradesh",
    formation: "Mansar Formation, Sausar Group (Quartz-Mica Schist)",
    grade: "44.5",
    boreholes: [
      { id: "BH-BG-104", mnGrade: 46.8, depth: 168.5, lithology: "Braunite/Pyrolusite Ore", recovery: 96 },
      { id: "BH-BG-105", mnGrade: 43.2, depth: 228.0, lithology: "Braunite/Pyrolusite Ore", recovery: 94 },
      { id: "BH-BG-106", mnGrade: 38.9, depth: 286.0, lithology: "Gondite Horizon", recovery: 91 },
      { id: "BH-BG-107", mnGrade: 47.4, depth: 362.5, lithology: "Braunite/Pyrolusite Ore", recovery: 97 },
      { id: "BH-BG-108", mnGrade: 41.5, depth: 421.0, lithology: "Mansar Mica-Schist", recovery: 89 },
    ],
    satellite: { ndvi: "0.31", lst: "34.2°C", moisture: "38.5%", insar: "-1.2 mm/yr", rainfall: "36.4 mm", sensor: "Sentinel-2A" },
  },
  bhandara: {
    label: "Dongri Buzurg & Chikla Mines",
    center: [21.5542, 79.6911],
    district: "Bhandara",
    state: "Maharashtra",
    formation: "Sitasaongi & Mansar Phyllites (Battery-Grade Dioxide Ore)",
    grade: "46.2",
    boreholes: [
      { id: "BH-DB-201", mnGrade: 46.2, depth: 58.5, lithology: "High-grade Braunite/Pyrolusite Ore", recovery: 95 },
      { id: "BH-DB-202", mnGrade: 42.5, depth: 84.0, lithology: "Pyrolusite Oxide Lens", recovery: 93 },
      { id: "BH-DB-203", mnGrade: 38.2, depth: 104.0, lithology: "Sitasaongi Quartzite", recovery: 88 },
      { id: "BH-CK-204", mnGrade: 44.8, depth: 132.0, lithology: "Chikla Underground Braunite Strike", recovery: 96 },
    ],
    satellite: { ndvi: "0.22", lst: "38.9°C", moisture: "58.2%", insar: "-3.8 mm/yr", rainfall: "72.8 mm", sensor: "Landsat-9 OLI" },
  },
  nagpur: {
    label: "Mansar, Kandri & Gumgaon Mines",
    center: [21.4019, 79.2715],
    district: "Nagpur",
    state: "Maharashtra",
    formation: "Lohangi Calc-Silicate & Mansar Schist Contact (Siliceous Braunite)",
    grade: "42.8",
    boreholes: [
      { id: "BH-NK-301", mnGrade: 46.2, depth: 95.0, lithology: "Braunite/Pyrolusite Ore", recovery: 97 },
      { id: "BH-NK-302", mnGrade: 41.6, depth: 220.0, lithology: "Gondite Horizon", recovery: 90 },
      { id: "BH-NK-303", mnGrade: 43.8, depth: 290.0, lithology: "Gumgaon Underground Bed", recovery: 93 },
      { id: "BH-NK-304", mnGrade: 44.1, depth: 175.0, lithology: "Kandri Highwall Braunite", recovery: 94 },
    ],
    satellite: { ndvi: "0.35", lst: "33.5°C", moisture: "26.8%", insar: "-0.8 mm/yr", rainfall: "8.2 mm", sensor: "Sentinel-2A" },
  },
  chhindwara: {
    label: "Tirodi & Sitapatore Mines",
    center: [21.6811, 79.7122],
    district: "Chhindwara / Balaghat Border",
    state: "Madhya Pradesh",
    formation: "Tirodi Biotite Gneiss & Mansar Schist Contact (Coarse Braunite)",
    grade: "40.5",
    boreholes: [
      { id: "BH-TR-401", mnGrade: 42.5, depth: 185.0, lithology: "Tirodi Braunite Bed", recovery: 92 },
      { id: "BH-TR-402", mnGrade: 39.2, depth: 145.0, lithology: "Gondite Marker Horizon", recovery: 88 },
      { id: "BH-TR-403", mnGrade: 43.1, depth: 210.0, lithology: "Sitapatore Pegmatite Braunite", recovery: 91 },
    ],
    satellite: { ndvi: "0.29", lst: "36.1°C", moisture: "46.1%", insar: "-2.1 mm/yr", rainfall: "48.5 mm", sensor: "Sentinel-2A" },
  },
};

function getMineData(regionString?: string) {
  const s = (regionString || "").toLowerCase();
  if (s.includes("bhandara") || s.includes("dongri") || s.includes("chikla")) {
    return MINE_DATA.bhandara;
  }
  if (s.includes("nagpur") || s.includes("mansar") || s.includes("kandri") || s.includes("gumgaon")) {
    return MINE_DATA.nagpur;
  }
  if (s.includes("chhindwara") || s.includes("tirodi") || s.includes("sitapatore")) {
    return MINE_DATA.chhindwara;
  }
  return MINE_DATA.balaghat;
}

export const SatelliteMapViewer: React.FC<SatelliteMapViewerProps> = ({ selectedRegion }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [activeLayer, setActiveLayer] = useState<"rgb" | "ndvi" | "lst" | "moisture" | "swir" | "insar">("rgb");
  const [baseMapType, setBaseMapType] = useState<"satellite" | "street" | "dark">("satellite");
  const [layerOpacity, setLayerOpacity] = useState<number>(0.75);
  const [showBoreholes, setShowBoreholes] = useState<boolean>(true);
  const [showConcessionBoundary, setShowConcessionBoundary] = useState<boolean>(true);
  const [mouseCoords, setMouseCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<any>(null);

  const mine = getMineData(selectedRegion);
  const [centerLat, centerLng] = mine.center;

  // Initialize Leaflet map once
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;
    if (mapInstanceRef.current) { try { mapInstanceRef.current.remove(); } catch { } mapInstanceRef.current = null; }
    if ((container as any)._leaflet_id) delete (container as any)._leaflet_id;
    try {
      const map = L.map(container, { center: [centerLat, centerLng], zoom: 15, zoomControl: false, attributionControl: false });
      mapInstanceRef.current = map;
      L.control.zoom({ position: "topright" }).addTo(map);
      map.on("mousemove", (e) => setMouseCoords({ lat: Number(e.latlng.lat.toFixed(5)), lng: Number(e.latlng.lng.toFixed(5)) }));
      layerGroupRef.current = L.layerGroup().addTo(map);
      tileLayerRef.current = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { maxZoom: 19, attribution: "Esri, Maxar / MOIL GIS" }
      ).addTo(map);
    } catch (err) { console.error("Leaflet init error:", err); }
    return () => {
      if (mapInstanceRef.current) { try { mapInstanceRef.current.remove(); } catch { } mapInstanceRef.current = null; }
      if (container && (container as any)._leaflet_id) delete (container as any)._leaflet_id;
    };
  }, []);

  // Update base tile on baseMapType change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    if (tileLayerRef.current && map.hasLayer(tileLayerRef.current)) map.removeLayer(tileLayerRef.current);
    let url = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
    if (baseMapType === "street") url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    else if (baseMapType === "dark") url = "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}";
    tileLayerRef.current = L.tileLayer(url, { maxZoom: 19 }).addTo(map);
  }, [baseMapType]);

  // Fly to mine on region change
  useEffect(() => {
    mapInstanceRef.current?.flyTo([centerLat, centerLng], 15, { duration: 1.4 });
  }, [centerLat, centerLng]);

  // Draw overlays
  useEffect(() => {
    const map = mapInstanceRef.current;
    const lg = layerGroupRef.current;
    if (!map || !lg) return;
    lg.clearLayers();

    if (showConcessionBoundary) {
      L.polygon([
        [centerLat + 0.009, centerLng - 0.012], [centerLat + 0.011, centerLng + 0.007],
        [centerLat + 0.003, centerLng + 0.014], [centerLat - 0.008, centerLng + 0.011],
        [centerLat - 0.009, centerLng - 0.008], [centerLat - 0.003, centerLng - 0.015],
      ], { color: "#f59e0b", weight: 2, dashArray: "5, 5", fillColor: "#f59e0b", fillOpacity: 0.08 })
        .bindPopup(`<div style="font-family:sans-serif;font-size:12px"><strong style="color:#b45309">${mine.label} Mining Lease</strong><br/>Area: 384.5 Hectares<br/>Formation: ${mine.formation}<br/>Avg Grade: <strong>${mine.grade}% Mn</strong></div>`)
        .addTo(lg);
      L.polygon([
        [centerLat + 0.003, centerLng - 0.005], [centerLat + 0.004, centerLng + 0.004],
        [centerLat - 0.002, centerLng + 0.005], [centerLat - 0.004, centerLng - 0.003],
      ], { color: "#f43f5e", weight: 2, fillColor: "#f43f5e", fillOpacity: 0.18 })
        .bindPopup("<div style='font-family:sans-serif;font-size:12px'><strong style='color:#e11d48'>Active Extraction Core</strong><br/>Deepest Level: -320m RL<br/>Pumping: 1,200 m³/hr<br/>Status: Operational</div>")
        .addTo(lg);
    }

    if (activeLayer === "ndvi") {
      [
        { lat: centerLat + 0.002, lng: centerLng + 0.003, r: 280, val: 0.19, txt: "High Mn Outcrop Stress (NDVI: 0.19)" },
        { lat: centerLat - 0.001, lng: centerLng - 0.004, r: 340, val: 0.24, txt: "Gondite Horizon Stress (NDVI: 0.24)" },
        { lat: centerLat + 0.005, lng: centerLng - 0.002, r: 220, val: 0.58, txt: "Healthy Dense Canopy (NDVI: 0.58)" },
      ].forEach(z => {
        const c = z.val < 0.3 ? "#ef4444" : z.val < 0.45 ? "#eab308" : "#22c55e";
        L.circle([z.lat, z.lng], { radius: z.r, color: c, fillColor: c, fillOpacity: layerOpacity * 0.65, weight: 1.5 })
          .bindPopup(`<strong>${z.txt}</strong><br/>Sentinel-2 Multispectral`).addTo(lg);
      });
    } else if (activeLayer === "lst") {
      [
        { lat: centerLat + 0.001, lng: centerLng + 0.001, r: 320, tmp: "36.8°C", note: "Exposed Ore Body Thermal Signature" },
        { lat: centerLat - 0.003, lng: centerLng + 0.004, r: 260, tmp: "32.1°C", note: "Moist Overburden Dump" },
      ].forEach(z =>
        L.circle([z.lat, z.lng], { radius: z.r, color: "#f97316", fillColor: "#f97316", fillOpacity: layerOpacity * 0.6, weight: 1.5 })
          .bindPopup(`<strong>LST: ${z.tmp}</strong><br/>${z.note}<br/>Landsat-9 TIRS Band 10`).addTo(lg)
      );
    } else if (activeLayer === "moisture") {
      [
        { lat: centerLat - 0.002, lng: centerLng - 0.001, r: 300, level: "91% Waterlogged Sump", color: "#06b6d4" },
        { lat: centerLat + 0.003, lng: centerLng - 0.006, r: 250, level: "58% Moderate Infiltration", color: "#3b82f6" },
      ].forEach(z =>
        L.circle([z.lat, z.lng], { radius: z.r, color: z.color, fillColor: z.color, fillOpacity: layerOpacity * 0.65, weight: 1.5 })
          .bindPopup(`<strong>Soil Moisture: ${z.level}</strong><br/>SMAP & Sentinel-1 SAR`).addTo(lg)
      );
    } else if (activeLayer === "swir") {
      [
        { lat: centerLat + 0.0015, lng: centerLng - 0.0015, r: 360, ratio: "2.84 - High Braunite/Pyrolusite index" },
        { lat: centerLat - 0.0035, lng: centerLng + 0.002, r: 290, ratio: "2.41 - Psilomelane Lens" },
      ].forEach(z =>
        L.circle([z.lat, z.lng], { radius: z.r, color: "#a855f7", fillColor: "#a855f7", fillOpacity: layerOpacity * 0.65, weight: 1.5 })
          .bindPopup(`<strong>SWIR Ratio: ${z.ratio}</strong><br/>ASTER Band 4 / Band 7`).addTo(lg)
      );
    } else if (activeLayer === "insar") {
      [
        { lat: centerLat + 0.003, lng: centerLng + 0.002, d: "-1.8 mm/yr", s: "STABLE HIGHWALL" },
        { lat: centerLat - 0.002, lng: centerLng + 0.003, d: "-4.2 mm/yr", s: "MINOR SETTLEMENT BENCH 3" },
        { lat: centerLat - 0.004, lng: centerLng - 0.003, d: "+0.4 mm/yr", s: "STABLE DUMP FOOT" },
      ].forEach(p =>
        L.circleMarker([p.lat, p.lng], { radius: 9, color: "#38bdf8", fillColor: "#0284c7", fillOpacity: 0.9, weight: 2 })
          .bindPopup(`<strong>InSAR Ground Motion:</strong><br/>Rate: <strong>${p.d}</strong><br/>${p.s}`).addTo(lg)
      );
    }

    if (showBoreholes) {
      mine.boreholes.forEach((bh, idx) => {
        const bhLat = centerLat + (idx % 3 - 1) * 0.0032;
        const bhLng = centerLng + (Math.floor(idx / 3) - 1) * 0.0038;
        L.circleMarker([bhLat, bhLng], {
          radius: 7, color: "#fbbf24",
          fillColor: bh.mnGrade > 45 ? "#10b981" : "#f59e0b",
          fillOpacity: 1, weight: 2,
        })
          .bindPopup(`<div style="font-family:sans-serif;font-size:12px;min-width:170px"><div style="font-weight:bold;border-bottom:1px solid #e2e8f0;padding-bottom:4px;margin-bottom:4px">Borehole: ${bh.id}</div><div>Depth: <strong>${bh.depth}m</strong></div><div>Mn Grade: <strong style="color:${bh.mnGrade > 45 ? "#059669" : "#d97706"}">${bh.mnGrade}% Mn</strong></div><div>Lithology: ${bh.lithology}</div><div>Core Recovery: <strong>${bh.recovery}%</strong></div></div>`)
          .on("click", () => setSelectedFeature({ bh, bhLat, bhLng }))
          .addTo(lg);
      });
    }
  }, [activeLayer, baseMapType, layerOpacity, showBoreholes, showConcessionBoundary, selectedRegion, centerLat, centerLng]);

  const LAYERS = [
    { key: "rgb", label: "True Color (RGB)", Icon: Satellite, ac: "bg-cyan-600" },
    { key: "ndvi", label: "NDVI Chlorosis", Icon: Leaf, ac: "bg-emerald-600", ic: "text-emerald-400" },
    { key: "lst", label: "Thermal LST", Icon: Flame, ac: "bg-amber-600", ic: "text-amber-400" },
    { key: "moisture", label: "Soil Moisture", Icon: Droplet, ac: "bg-blue-600", ic: "text-blue-400" },
    { key: "swir", label: "SWIR Mineral", Icon: Sparkles, ac: "bg-purple-600", ic: "text-purple-400" },
    { key: "insar", label: "InSAR Stability", Icon: Compass, ac: "bg-sky-600", ic: "text-sky-400" },
  ] as const;

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Satellite className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">Space Remote Sensing & Multi-Spectral Exploration Hub</h2>
            <span className="text-[10px] bg-cyan-500/20 text-cyan-300 font-mono px-2 py-0.5 rounded border border-cyan-500/40">Live GIS Core</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real satellite imagery covering {mine.label} ({mine.district}, {mine.state}) with Earth Observation overlays
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center space-x-1">
            {(["satellite", "dark", "street"] as const).map(t => (
              <button key={t} onClick={() => setBaseMapType(t)}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition ${baseMapType === t ? "bg-cyan-600 text-white font-bold" : "text-slate-400 hover:text-white"}`}>
                {t === "satellite" ? "Satellite" : t === "dark" ? "Night / Dark" : "Topo / OSM"}
              </button>
            ))}
          </div>
          <button onClick={() => mapInstanceRef.current?.flyTo([centerLat, centerLng], 15)}
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-700 transition">
            <Target className="w-3.5 h-3.5 text-amber-400" />
            <span>Recenter</span>
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
        <div ref={mapContainerRef} className="w-full h-[540px] z-10" />

        {/* Spectral Layer Selector */}
        <div className="absolute top-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-xl p-3 shadow-xl max-w-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-white border-b border-slate-800 pb-1.5">
            <span className="flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Multi-Spectral Layer</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">EO Sentinel/Landsat</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            {LAYERS.map(({ key, label, Icon, ac, ic }) => (
              <button key={key} onClick={() => setActiveLayer(key as any)}
                className={`px-2 py-1.5 rounded-lg text-left transition flex items-center space-x-1.5 ${activeLayer === key ? `${ac} text-white font-bold` : "bg-slate-950 text-slate-300 hover:bg-slate-800"}`}>
                <Icon className={`w-3.5 h-3.5 shrink-0 ${activeLayer !== key && ic ? ic : ""}`} />
                <span className="truncate">{label}</span>
              </button>
            ))}
          </div>
          {activeLayer !== "rgb" && (
            <div className="pt-2 border-t border-slate-800">
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Layer Opacity:</span>
                <span className="font-mono text-cyan-400 font-bold">{Math.round(layerOpacity * 100)}%</span>
              </div>
              <input type="range" min="0.2" max="1.0" step="0.05" value={layerOpacity}
                onChange={e => setLayerOpacity(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer" />
            </div>
          )}
        </div>

        {/* Toggle Overlays */}
        <div className="absolute top-4 right-14 z-20 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-xl p-2.5 shadow-xl flex items-center space-x-3 text-xs">
          {[
            { label: "Borehole Collars", checked: showBoreholes, set: setShowBoreholes },
            { label: "Lease Boundary", checked: showConcessionBoundary, set: setShowConcessionBoundary },
          ].map(({ label, checked, set }) => (
            <label key={label} className="flex items-center space-x-1.5 cursor-pointer text-slate-300 hover:text-white">
              <input type="checkbox" checked={checked} onChange={e => set(e.target.checked)}
                className="rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-0" />
              <span>{label}</span>
            </label>
          ))}
        </div>

        {/* Bottom Coordinate Bar */}
        <div className="absolute bottom-3 left-3 right-3 z-20 bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-xl px-4 py-2 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-2">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-bold text-white">{mine.label}</span>
              <span className="text-slate-500">|</span>
              <span className="font-mono text-slate-400">
                {mouseCoords ? `${mouseCoords.lat}° N, ${mouseCoords.lng}° E` : `${centerLat.toFixed(4)}° N, ${centerLng.toFixed(4)}° E`}
              </span>
            </div>
            <div className="hidden sm:flex items-center space-x-2 text-[11px] font-mono">
              <span className="text-slate-500">24h Rain:</span>
              <span className="text-cyan-400 font-bold">{mine.satellite.rainfall}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-500">NDVI:</span>
              <span className="text-emerald-400 font-bold">{mine.satellite.ndvi}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-500">InSAR:</span>
              <span className="text-sky-400 font-bold">{mine.satellite.insar}</span>
            </div>
          </div>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">Click pins or polygons to inspect</span>
        </div>
      </div>

      {/* Selected Borehole Card */}
      {selectedFeature && (
        <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-4 flex items-center justify-between shadow-lg">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <h4 className="font-bold text-white text-sm">Diamond Drill Core: {selectedFeature.bh.id}</h4>
              <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-bold font-mono">
                {selectedFeature.bh.mnGrade}% Mn Grade
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Depth: <strong>{selectedFeature.bh.depth}m</strong> | Lithology: <strong>{selectedFeature.bh.lithology}</strong> | Core Recovery: <strong>{selectedFeature.bh.recovery}%</strong>
            </p>
          </div>
          <button onClick={() => setSelectedFeature(null)} className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded-lg">Dismiss</button>
        </div>
      )}

      {/* Scientific Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { Icon: Leaf, color: "text-emerald-400", title: "NDVI Vegetation Stress", desc: "Unhealthy-looking plants on satellite images can be a key clue that manganese ore lies buried underground." },
          { Icon: Flame, color: "text-amber-400", title: "Thermal Inertia (LST)", desc: "Manganese-rich ground heats up and cools down differently than normal rock, and satellites can detect this unique temperature pattern." },
          { Icon: Compass, color: "text-sky-400", title: "Sentinel-1 InSAR Stability", desc: "Satellites detect tiny millimeter ground movements to warn teams about unstable mine slopes before accidents happen." },
        ].map(({ Icon, color, title, desc }) => (
          <div key={title} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className={`flex items-center space-x-2 ${color} font-bold text-xs mb-1`}>
              <Icon className="w-4 h-4" />
              <span>{title}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
