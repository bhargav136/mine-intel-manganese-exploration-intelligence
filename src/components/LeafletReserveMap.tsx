import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
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
  Leaf,
  Flame,
  Droplet,
  Compass,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { ExplorationTarget } from '../types';
import { TOP_PRIORITY_TARGETS, MOIL_MINE_SITES } from '../data/mockData';
import { InfoTooltip } from './InfoTooltip';

interface LeafletReserveMapProps {
  onSelectTarget?: (target: ExplorationTarget) => void;
  selectedTarget?: ExplorationTarget | null;
  selectedRegion?: string;
}

const SECTOR_CONFIGS: Record<string, {
  name: string;
  center: [number, number];
  zoom: number;
  area: string;
  boundary: [number, number][];
  zones: { name: string; center: [number, number]; radius: number; color: string; desc: string }[];
  targets: ExplorationTarget[];
}> = {
  balaghat: {
    name: 'Balaghat District, MP',
    center: [21.825, 80.21],
    zoom: 11,
    area: '1,000 km²',
    boundary: [
      [21.72, 80.08],
      [21.98, 80.15],
      [22.02, 80.52],
      [21.78, 80.45],
    ],
    zones: [
      { name: 'Zone A: Balaghat Central', center: [21.815, 80.205], radius: 3500, color: '#10B981', desc: '82% Probable Manganese Reserve (~21.4 MT)' },
      { name: 'Zone B: Ukwa Northeast Syncline', center: [21.968, 80.468], radius: 4200, color: '#8B5CF6', desc: '79% High Grade Strike (~9.8 MT)' },
      { name: 'Zone C: Waraseoni Gondite Belt', center: [21.821, 80.174], radius: 2800, color: '#F59E0B', desc: 'Near-Surface Braunite (~4.2 MT)' },
    ],
    targets: TOP_PRIORITY_TARGETS,
  },
  bhandara: {
    name: 'Bhandara District, Maharashtra',
    center: [21.535, 79.712],
    zoom: 12,
    area: '750 km²',
    boundary: [
      [21.42, 79.55],
      [21.65, 79.62],
      [21.68, 79.88],
      [21.45, 79.82],
    ],
    zones: [
      { name: 'Zone A: Dongri Buzurg Battery-Grade Ore', center: [21.535, 79.712], radius: 3200, color: '#10B981', desc: '88% High Grade Battery-Grade Dioxide Braunite (~14.2 MT)' },
      { name: 'Zone B: Chikla Deep Underground Syncline', center: [21.558, 79.754], radius: 2600, color: '#8B5CF6', desc: 'Deep Underground Orebody Extension (~6.8 MT)' },
      { name: 'Zone C: Kurmura Sitasaongi Strike', center: [21.512, 79.684], radius: 2200, color: '#F59E0B', desc: 'Surface Manganese Dioxide (~3.5 MT)' },
    ],
    targets: [
      {
        id: 'T-047',
        rank: 1,
        priority: 'VERY HIGH',
        score: 96,
        coordinates: { lat: 21.5350, lng: 79.7120 },
        locationName: 'Dongri Buzurg Western Flank Quarry',
        formation: 'Sitasaongi & Mansar Formations',
        estimatedReserveMT: 2850000,
        estimatedGradeMn: 46.2,
        depthMeters: 22,
        confidence: 0.97,
        fieldStatus: 'Verified',
        satelliteIndicators: {
          ndvi: 0.28,
          lstCelsius: 36.2,
          soilMoisturePercent: 11.2,
          swirBandRatio: 2.05,
          magneticAnomalyNT: 198,
          gravityAnomalyMGal: 5.2,
        },
        recommendedAction: 'Priority opencast pushback; deploy 50T dumpers to uncover battery-grade dioxide bench.',
      },
      {
        id: 'T-052',
        rank: 2,
        priority: 'VERY HIGH',
        score: 93,
        coordinates: { lat: 21.5582, lng: 79.7541 },
        locationName: 'Chikla Deep Winze Underground Extension',
        formation: 'Mansar Quartz-Mica Schist with Braunite',
        estimatedReserveMT: 1980000,
        estimatedGradeMn: 44.8,
        depthMeters: 38,
        confidence: 0.94,
        fieldStatus: 'Verified',
        satelliteIndicators: {
          ndvi: 0.31,
          lstCelsius: 34.8,
          soilMoisturePercent: 13.5,
          swirBandRatio: 1.88,
          magneticAnomalyNT: 172,
          gravityAnomalyMGal: 4.6,
        },
        recommendedAction: 'Underground diamond drilling at Level 5 drive along strike N65°E.',
      },
      {
        id: 'T-061',
        rank: 3,
        priority: 'HIGH',
        score: 89,
        coordinates: { lat: 21.5124, lng: 79.6842 },
        locationName: 'Kurmura Opencast Gossanous Outcrop',
        formation: 'Chorbaoli Quartzite contact zone',
        estimatedReserveMT: 1250000,
        estimatedGradeMn: 42.6,
        depthMeters: 18,
        confidence: 0.90,
        fieldStatus: 'Verified',
        satelliteIndicators: {
          ndvi: 0.36,
          lstCelsius: 35.1,
          soilMoisturePercent: 14.2,
          swirBandRatio: 1.76,
          magneticAnomalyNT: 145,
          gravityAnomalyMGal: 3.9,
        },
        recommendedAction: 'Exploratory trenching and ground magnetic profiling across 400m strike length.',
      },
      {
        id: 'T-068',
        rank: 4,
        priority: 'HIGH',
        score: 87,
        coordinates: { lat: 21.5280, lng: 79.7310 },
        locationName: 'Sitasaongi South Fold Closure',
        formation: 'Mansar Schist synclinal keel',
        estimatedReserveMT: 1420000,
        estimatedGradeMn: 43.4,
        depthMeters: 30,
        confidence: 0.88,
        fieldStatus: 'Verified',
        satelliteIndicators: {
          ndvi: 0.33,
          lstCelsius: 35.5,
          soilMoisturePercent: 12.8,
          swirBandRatio: 1.82,
          magneticAnomalyNT: 160,
          gravityAnomalyMGal: 4.2,
        },
        recommendedAction: 'Borehole collar staking to verify down-plunge continuity of south synclinal keel.',
      },
    ],
  },
  nagpur: {
    name: 'Nagpur District, Maharashtra',
    center: [21.392, 79.255],
    zoom: 12,
    area: '820 km²',
    boundary: [
      [21.28, 79.12],
      [21.52, 79.18],
      [21.55, 79.42],
      [21.31, 79.38],
    ],
    zones: [
      { name: 'Zone A: Mansar Opencast Manganese Lobe', center: [21.392, 79.255], radius: 3100, color: '#10B981', desc: '84% Confirmed Siliceous Braunite (~11.6 MT)' },
      { name: 'Zone B: Kandri North Syncline', center: [21.415, 79.278], radius: 2500, color: '#8B5CF6', desc: 'High Grade Manganese Reef (~8.4 MT)' },
      { name: 'Zone C: Gumgaon Underground Deep Lens', center: [21.365, 79.228], radius: 2800, color: '#F59E0B', desc: 'Gondite Manganese Oxide (~5.2 MT)' },
    ],
    targets: [
      {
        id: 'T-084',
        rank: 1,
        priority: 'VERY HIGH',
        score: 94,
        coordinates: { lat: 21.3920, lng: 79.2550 },
        locationName: 'Mansar South Outcrop Orebody',
        formation: 'Mansar Formation (Sausar Group)',
        estimatedReserveMT: 2350000,
        estimatedGradeMn: 44.2,
        depthMeters: 26,
        confidence: 0.95,
        fieldStatus: 'Verified',
        satelliteIndicators: {
          ndvi: 0.30,
          lstCelsius: 36.8,
          soilMoisturePercent: 10.8,
          swirBandRatio: 1.96,
          magneticAnomalyNT: 188,
          gravityAnomalyMGal: 4.9,
        },
        recommendedAction: 'Execute stage-2 infill core drilling along N75°E strike; deepen pit floor by 12m.',
      },
      {
        id: 'T-089',
        rank: 2,
        priority: 'HIGH',
        score: 91,
        coordinates: { lat: 21.4152, lng: 79.2784 },
        locationName: 'Kandri Infill Borehole KB-04',
        formation: 'Lohangi Marble and Mansar Schist contact',
        estimatedReserveMT: 1720000,
        estimatedGradeMn: 43.2,
        depthMeters: 32,
        confidence: 0.92,
        fieldStatus: 'Verified',
        satelliteIndicators: {
          ndvi: 0.34,
          lstCelsius: 35.4,
          soilMoisturePercent: 12.2,
          swirBandRatio: 1.85,
          magneticAnomalyNT: 168,
          gravityAnomalyMGal: 4.4,
        },
        recommendedAction: 'Core logging of pink calc-silicate contact to confirm footwall boundary.',
      },
      {
        id: 'T-094',
        rank: 3,
        priority: 'HIGH',
        score: 88,
        coordinates: { lat: 21.3651, lng: 79.2285 },
        locationName: 'Gumgaon Shaft 2 Deep Exploration',
        formation: 'Mansar Formation with Braunite-Hollandite',
        estimatedReserveMT: 1540000,
        estimatedGradeMn: 42.1,
        depthMeters: 45,
        confidence: 0.89,
        fieldStatus: 'Verified',
        satelliteIndicators: {
          ndvi: 0.32,
          lstCelsius: 34.6,
          soilMoisturePercent: 13.9,
          swirBandRatio: 1.79,
          magneticAnomalyNT: 155,
          gravityAnomalyMGal: 4.1,
        },
        recommendedAction: 'Sub-level open stoping development and rock mass rating (RMR) validation.',
      },
    ],
  },
  chhindwara: {
    name: 'Chhindwara District, MP',
    center: [21.785, 78.892],
    zoom: 12,
    area: '600 km²',
    boundary: [
      [21.68, 78.75],
      [21.92, 78.82],
      [21.95, 79.08],
      [21.71, 78.98],
    ],
    zones: [
      { name: 'Zone A: Tirodi Western Opencast', center: [21.785, 78.892], radius: 3400, color: '#10B981', desc: '81% Braunite Ore Bed (~9.1 MT)' },
      { name: 'Zone B: Sitapatore Braunite Belt', center: [21.812, 78.924], radius: 2400, color: '#8B5CF6', desc: 'Strike Extension (~4.9 MT)' },
      { name: 'Zone C: Jamrapani Gondite Horizon', center: [21.754, 78.854], radius: 2100, color: '#F59E0B', desc: 'Coarse Braunite (~2.8 MT)' },
    ],
    targets: [
      {
        id: 'T-105',
        rank: 1,
        priority: 'VERY HIGH',
        score: 93,
        coordinates: { lat: 21.7850, lng: 78.8920 },
        locationName: 'Tirodi West Bench Quarry',
        formation: 'Tirodi Biotite Gneiss & Mansar Schist',
        estimatedReserveMT: 2100000,
        estimatedGradeMn: 43.2,
        depthMeters: 24,
        confidence: 0.94,
        fieldStatus: 'Verified',
        satelliteIndicators: {
          ndvi: 0.29,
          lstCelsius: 36.4,
          soilMoisturePercent: 11.5,
          swirBandRatio: 1.92,
          magneticAnomalyNT: 180,
          gravityAnomalyMGal: 4.7,
        },
        recommendedAction: 'Blasting optimization for coarse braunite recovery; bench widening on West face.',
      },
      {
        id: 'T-112',
        rank: 2,
        priority: 'HIGH',
        score: 89,
        coordinates: { lat: 21.8124, lng: 78.9241 },
        locationName: 'Sitapatore North Collar',
        formation: 'Mansar Schist with Gondite quartzite',
        estimatedReserveMT: 1450000,
        estimatedGradeMn: 42.8,
        depthMeters: 28,
        confidence: 0.91,
        fieldStatus: 'Verified',
        satelliteIndicators: {
          ndvi: 0.33,
          lstCelsius: 35.2,
          soilMoisturePercent: 13.1,
          swirBandRatio: 1.81,
          magneticAnomalyNT: 164,
          gravityAnomalyMGal: 4.3,
        },
        recommendedAction: 'Electromagnetic anomaly drilling across Sitapatore north ridge strike.',
      },
    ],
  },
};

export const LeafletReserveMap: React.FC<LeafletReserveMapProps> = ({
  onSelectTarget,
  selectedTarget: propSelectedTarget,
  selectedRegion = 'Balaghat District, MP',
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const zonesLayerRef = useRef<L.LayerGroup | null>(null);

  const getSectorKey = (regionStr: string) => {
    if (regionStr.includes('Bhandara')) return 'bhandara';
    if (regionStr.includes('Nagpur')) return 'nagpur';
    if (regionStr.includes('Chhindwara')) return 'chhindwara';
    return 'balaghat';
  };

  const sectorKey = getSectorKey(selectedRegion);
  const currentSector = SECTOR_CONFIGS[sectorKey];

  const [activeBasemap, setActiveBasemap] = useState<'satellite' | 'streets' | 'topo'>('satellite');
  const [activeSpectralLayer, setActiveSpectralLayer] = useState<'rgb' | 'ndvi' | 'lst' | 'moisture' | 'swir' | 'insar'>('rgb');
  const [spectralOpacity, setSpectralOpacity] = useState<number>(0.75);
  const spectralLayerRef = useRef<L.LayerGroup | null>(null);
  const [showHeatmapZones, setShowHeatmapZones] = useState(true);
  const [showBoreholes, setShowBoreholes] = useState(true);
  const [selectedTarget, setSelectedTarget] = useState<ExplorationTarget | null>(
    propSelectedTarget || currentSector.targets[0]
  );
  const [filterMinGrade, setFilterMinGrade] = useState<number>(40);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => {
      const next = !prev;
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 150);
      return next;
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
        setTimeout(() => {
          mapInstanceRef.current?.invalidateSize();
        }, 150);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

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
      center: currentSector.center,
      zoom: currentSector.zoom,
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
    const spectralGroup = L.layerGroup().addTo(map);

    layerGroupRef.current = layerGroup;
    zonesLayerRef.current = zonesGroup;
    spectralLayerRef.current = spectralGroup;
    mapInstanceRef.current = map;

    // Force map to recalculate its container size after React renders
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update map viewport when region changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(currentSector.center, currentSector.zoom, { duration: 1.2 });
    }
    setSelectedTarget(currentSector.targets[0]);
    if (onSelectTarget) onSelectTarget(currentSector.targets[0]);
  }, [selectedRegion]);

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

  // Draw Multi-Spectral Earth Observation Overlays
  useEffect(() => {
    const spectralGroup = spectralLayerRef.current;
    if (!spectralGroup) return;
    spectralGroup.clearLayers();

    const [cLat, cLng] = currentSector.center;

    if (activeSpectralLayer === 'ndvi') {
      const ndviZones = [
        { lat: cLat + 0.008, lng: cLng + 0.012, radius: 2400, val: 0.19, text: 'High Mn Outcrop Chlorosis (NDVI: 0.19)' },
        { lat: cLat - 0.009, lng: cLng - 0.015, radius: 2800, val: 0.24, text: 'Gondite Horizon Stress (NDVI: 0.24)' },
        { lat: cLat + 0.015, lng: cLng - 0.010, radius: 2000, val: 0.58, text: 'Healthy Dense Forest Canopy (NDVI: 0.58)' },
      ];
      ndviZones.forEach((z) => {
        const color = z.val < 0.3 ? '#ef4444' : z.val < 0.45 ? '#eab308' : '#22c55e';
        L.circle([z.lat, z.lng], {
          radius: z.radius,
          color,
          fillColor: color,
          fillOpacity: spectralOpacity * 0.55,
          weight: 1.5,
        })
          .bindTooltip(`<b>${z.text}</b><br/>Sentinel-2 Multispectral`, { permanent: false })
          .addTo(spectralGroup);
      });
    } else if (activeSpectralLayer === 'lst') {
      const lstZones = [
        { lat: cLat + 0.006, lng: cLng + 0.005, radius: 2600, temp: '36.8°C', note: 'Exposed Ore Body Thermal Signature' },
        { lat: cLat - 0.011, lng: cLng + 0.014, radius: 2200, temp: '32.1°C', note: 'Moist Overburden Regolith' },
      ];
      lstZones.forEach((z) => {
        L.circle([z.lat, z.lng], {
          radius: z.radius,
          color: '#f97316',
          fillColor: '#f97316',
          fillOpacity: spectralOpacity * 0.55,
          weight: 1.5,
        })
          .bindTooltip(`<b>LST: ${z.temp}</b><br/>${z.note}<br/>Landsat-9 TIRS Band 10`, { permanent: false })
          .addTo(spectralGroup);
      });
    } else if (activeSpectralLayer === 'moisture') {
      const moistZones = [
        { lat: cLat - 0.007, lng: cLng - 0.005, radius: 2500, level: '91% (Waterlogged Sump)', color: '#06b6d4' },
        { lat: cLat + 0.012, lng: cLng - 0.018, radius: 2100, level: '58% (Moderate Infiltration)', color: '#3b82f6' },
      ];
      moistZones.forEach((z) => {
        L.circle([z.lat, z.lng], {
          radius: z.radius,
          color: z.color,
          fillColor: z.color,
          fillOpacity: spectralOpacity * 0.55,
          weight: 1.5,
        })
          .bindTooltip(`<b>Soil Moisture: ${z.level}</b><br/>SMAP & Sentinel-1 SAR`, { permanent: false })
          .addTo(spectralGroup);
      });
    } else if (activeSpectralLayer === 'swir') {
      const swirZones = [
        { lat: cLat + 0.009, lng: cLng - 0.008, radius: 2900, ratio: '2.84 (High Braunite/Pyrolusite Index)' },
        { lat: cLat - 0.014, lng: cLng + 0.011, radius: 2400, ratio: '2.41 (Psilomelane Lens)' },
      ];
      swirZones.forEach((z) => {
        L.circle([z.lat, z.lng], {
          radius: z.radius,
          color: '#a855f7',
          fillColor: '#a855f7',
          fillOpacity: spectralOpacity * 0.55,
          weight: 1.5,
        })
          .bindTooltip(`<b>SWIR Ratio: ${z.ratio}</b><br/>ASTER Band 4 / Band 7`, { permanent: false })
          .addTo(spectralGroup);
      });
    } else if (activeSpectralLayer === 'insar') {
      const insarPoints = [
        { lat: cLat + 0.011, lng: cLng + 0.008, disp: '-1.8 mm/yr', status: 'STABLE HIGHWALL' },
        { lat: cLat - 0.008, lng: cLng + 0.012, disp: '-4.2 mm/yr', status: 'MINOR SETTLEMENT BENCH 3' },
        { lat: cLat - 0.014, lng: cLng - 0.011, disp: '+0.4 mm/yr', status: 'STABLE DUMP FOOT' },
      ];
      insarPoints.forEach((p) => {
        L.circleMarker([p.lat, p.lng], {
          radius: 8,
          color: '#38bdf8',
          fillColor: '#0284c7',
          fillOpacity: 0.9,
          weight: 2,
        })
          .bindTooltip(`<b>InSAR Ground Motion:</b><br/>Rate: <b>${p.disp}</b><br/>${p.status}`, { permanent: false })
          .addTo(spectralGroup);
      });
    }
  }, [activeSpectralLayer, spectralOpacity, sectorKey]);

  // Update Markers & Zones per Selected Sector
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    const zonesGroup = zonesLayerRef.current;
    if (!map || !layerGroup || !zonesGroup) return;

    layerGroup.clearLayers();
    zonesGroup.clearLayers();

    // 1. Draw High-Confidence Reserve Heatmap Zones for current sector
    if (showHeatmapZones) {
      currentSector.zones.forEach((z) => {
        L.circle(z.center, {
          color: z.color,
          fillColor: z.color,
          fillOpacity: 0.24,
          weight: 2,
          dashArray: '5, 5',
          radius: z.radius,
        })
          .bindTooltip(`<b>${z.name}</b><br/>${z.desc}`, {
            permanent: false,
            direction: 'top',
          })
          .addTo(zonesGroup);
      });

      // Regional Exploration Boundary Polygon
      L.polygon(currentSector.boundary, {
        color: '#3B82F6',
        weight: 2,
        fillColor: '#3B82F6',
        fillOpacity: 0.06,
        dashArray: '8, 6',
      })
        .bindTooltip(`<b>${currentSector.area} MOIL Exploration Boundary</b><br/>${currentSector.name}`, {
          permanent: false,
        })
        .addTo(zonesGroup);
    }

    // 2. Filter Targets for active sector
    const visibleTargets = currentSector.targets.filter((t) => {
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
  }, [showHeatmapZones, showBoreholes, filterMinGrade, searchQuery, selectedTarget, sectorKey]);

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(currentSector.center, currentSector.zoom, { animate: true });
    }
  };

  return (
    <div
      id="big-accurate-leaflet-map-card"
      className={`bg-white transition-all overflow-hidden flex flex-col ${
        isFullscreen
          ? 'fixed inset-0 z-[99999] w-screen h-screen rounded-none border-none shadow-2xl'
          : 'rounded-2xl border border-slate-200 shadow-sm h-[750px]'
      }`}
    >
      {/* Top Map Control Bar */}
      <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-sm font-black text-slate-900 tracking-tight">
              Interactive Manganese Reserve Map ({currentSector.name})
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

          {/* Fullscreen Button in top toolbar */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold ${
              isFullscreen
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
            title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Fullscreen Map'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Map + Selected Inspector Sidebar Layout */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 relative">
        {/* Leaflet Map Canvas */}
        <div className="flex-1 h-full min-h-[420px] relative z-10">
          <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: '420px' }} />

          {/* Floating Multi-Spectral Layer Selector (matches user screenshot) */}
          <div className="absolute top-3 left-14 z-[1000] bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-xl p-3 shadow-xl max-w-xs space-y-2 text-white">
            <div className="flex items-center justify-between text-xs font-bold text-white border-b border-slate-800 pb-1.5">
              <span className="flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Multi-Spectral Layer</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">EO Sentinel/Landsat</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => setActiveSpectralLayer('rgb')}
                className={`px-2 py-1.5 rounded-lg text-left transition flex items-center space-x-1.5 cursor-pointer ${
                  activeSpectralLayer === 'rgb'
                    ? 'bg-cyan-600 text-white font-bold'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Satellite className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">True Color (RGB)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSpectralLayer('ndvi')}
                className={`px-2 py-1.5 rounded-lg text-left transition flex items-center space-x-1.5 cursor-pointer ${
                  activeSpectralLayer === 'ndvi'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Leaf className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">NDVI Chlorosis</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSpectralLayer('lst')}
                className={`px-2 py-1.5 rounded-lg text-left transition flex items-center space-x-1.5 cursor-pointer ${
                  activeSpectralLayer === 'lst'
                    ? 'bg-amber-600 text-white font-bold'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">Thermal LST</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSpectralLayer('moisture')}
                className={`px-2 py-1.5 rounded-lg text-left transition flex items-center space-x-1.5 cursor-pointer ${
                  activeSpectralLayer === 'moisture'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Droplet className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="truncate">Soil Moisture</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSpectralLayer('swir')}
                className={`px-2 py-1.5 rounded-lg text-left transition flex items-center space-x-1.5 cursor-pointer ${
                  activeSpectralLayer === 'swir'
                    ? 'bg-purple-600 text-white font-bold'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span className="truncate">SWIR Mineral</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSpectralLayer('insar')}
                className={`px-2 py-1.5 rounded-lg text-left transition flex items-center space-x-1.5 cursor-pointer ${
                  activeSpectralLayer === 'insar'
                    ? 'bg-sky-600 text-white font-bold'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span className="truncate">InSAR Stability</span>
              </button>
            </div>

            {/* Opacity Slider */}
            {activeSpectralLayer !== 'rgb' && (
              <div className="pt-2 border-t border-slate-800">
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Layer Opacity:</span>
                  <span className="font-mono text-cyan-400 font-bold">{Math.round(spectralOpacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="1.0"
                  step="0.05"
                  value={spectralOpacity}
                  onChange={(e) => setSpectralOpacity(Number(e.target.value))}
                  className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            )}
          </div>

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

          {/* YouTube-Style Fullscreen Button on Bottom Right */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="absolute bottom-4 right-4 z-[1000] px-3.5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white backdrop-blur-md border border-slate-700 shadow-xl transition-all cursor-pointer flex items-center gap-2 text-xs font-bold group focus:outline-none focus:ring-2 focus:ring-cyan-400 select-none"
            title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Fullscreen Map (like YouTube)'}
            aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span className="font-sans">Exit Fullscreen</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span className="font-sans">Fullscreen</span>
              </>
            )}
          </button>
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
                  <div className="text-[10px] text-slate-500 font-semibold flex items-center">
                    <span>Ore Grade (% Mn)</span>
                    <InfoTooltip termKey="grade" position="top" />
                  </div>
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
                  <div className="text-[10px] text-slate-500 font-semibold flex items-center">
                    <span>AI Confidence</span>
                    <InfoTooltip termKey="confidence" position="top" />
                  </div>
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
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 flex items-center">
                      <span>ASTER SWIR (B12/B11):</span>
                      <InfoTooltip termKey="swir" position="top" />
                    </span>
                    <span className="font-bold text-slate-800">{selectedTarget.satelliteIndicators.swirBandRatio}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 flex items-center">
                      <span>Vegetation Index (NDVI):</span>
                      <InfoTooltip termKey="ndvi" position="top" />
                    </span>
                    <span className="font-bold text-slate-800">{selectedTarget.satelliteIndicators.ndvi} (Stress)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 flex items-center">
                      <span>Land Surface Temp (LST):</span>
                      <InfoTooltip termKey="lst" position="top" />
                    </span>
                    <span className="font-bold text-slate-800">{selectedTarget.satelliteIndicators.lstCelsius}°C</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 flex items-center">
                      <span>SAR Soil Moisture:</span>
                      <InfoTooltip termKey="soilMoisture" position="top" />
                    </span>
                    <span className="font-bold text-slate-800">{selectedTarget.satelliteIndicators.soilMoisturePercent}%</span>
                  </div>
                  {selectedTarget.satelliteIndicators.magneticAnomalyNT && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 flex items-center">
                        <span>Magnetic Anomaly:</span>
                        <InfoTooltip termKey="magneticAnomaly" position="top" />
                      </span>
                      <span className="font-bold text-slate-800">{selectedTarget.satelliteIndicators.magneticAnomalyNT} nT</span>
                    </div>
                  )}
                  {selectedTarget.satelliteIndicators.gravityAnomalyMGal && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 flex items-center">
                        <span>Gravity Anomaly:</span>
                        <InfoTooltip termKey="gravityAnomaly" position="top" />
                      </span>
                      <span className="font-bold text-slate-800">+{selectedTarget.satelliteIndicators.gravityAnomalyMGal} mGal</span>
                    </div>
                  )}
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
