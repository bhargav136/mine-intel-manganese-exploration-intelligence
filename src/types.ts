export type NavigationTab =
  | 'project-overview'
  | 'command-center'
  | 'analyze-area'
  | 'prospectivity-explorer'
  | 'field-verification'
  | 'production-intelligence'
  | 'corrective-actions'
  | 'what-if-simulator'
  | 'reports-impact'
  | 'data-health'
  | 'source-code';

export interface TargetCluster {
  id: string;
  x: number; // percentage on map (0-100)
  y: number; // percentage on map (0-100)
  label: string; // e.g. "7 targets avg 83"
  targetCount: number;
  avgScore: number;
  priority: 'VERY_HIGH' | 'HIGH' | 'MEDIUM';
  primaryTargetId?: string;
}

export interface ExplorationTarget {
  id: string; // e.g. "T-003"
  rank: number;
  priority: 'VERY HIGH' | 'HIGH' | 'MEDIUM';
  score: number; // 0 - 100
  coordinates: {
    lat: number;
    lng: number;
  };
  locationName: string;
  formation: string; // e.g. "Mansar Formation, Sausar Group"
  estimatedReserveMT: number; // in Metric Tonnes
  estimatedGradeMn: number; // e.g. 43.8 %
  depthMeters: number; // e.g. 24
  confidence: number; // 0.0 - 1.0
  fieldStatus: 'Verified' | 'Pending' | 'In Drilling' | 'High-Priority Lead';
  satelliteIndicators: {
    ndvi: number; // -1 to 1 (vegetation anomaly)
    lstCelsius: number; // Land surface temperature
    soilMoisturePercent: number; // Soil moisture
    swirBandRatio: number; // SWIR 11/12 ratio for manganese oxides
    magneticAnomalyNT: number; // nanoTesla
    gravityAnomalyMGal: number; // milliGals
  };
  recommendedAction: string;
}

export interface BoreholeAssay {
  id: string;
  targetId: string;
  boreholeCode: string;
  collarLat: number;
  collarLng: number;
  depthFrom: number;
  depthTo: number;
  trueThickness: number;
  coreRecoveryPercent: number;
  mnPercent: number;
  fePercent: number;
  sio2Percent: number;
  pPercent: number;
  mineralogy: string; // e.g. "Braunite, Pyrolusite, Quartz, Spessartine"
  dateDrilled: string;
  status: 'Confirmed High Grade' | 'Medium Grade' | 'Barren Schist' | 'Pending Lab';
}

export interface MineSite {
  id: string;
  name: string;
  type: 'Underground' | 'Opencast' | 'Mixed';
  district: string;
  state: string;
  dailyTargetMT: number;
  actualRunrateMT: number;
  shortfallMT: number;
  activeEquipment: {
    shovels: { total: number; operational: number };
    dumpers: { total: number; operational: number };
    drills: { total: number; operational: number };
  };
  weatherCondition: {
    rainfallMm24h: number;
    forecast: string;
    haulRoadRisk: 'Low' | 'Moderate' | 'Critical';
  };
}

export interface CorrectiveActionItem {
  id: string;
  title: string;
  description: string;
  category: 'Equipment Redeployment' | 'Blasting Optimization' | 'Mine Scheduling' | 'Dewatering';
  impactRecoveryMT: number;
  urgency: 'Immediate' | 'Within Shift' | 'Next 24h';
  costRupees: string;
  status: 'Recommended' | 'Applied' | 'Rejected';
  rationale: string;
}

export interface ProductionConstraint {
  id: string;
  category: 'Weather' | 'Equipment' | 'Blasting' | 'Crushing & Ore Handling';
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE';
  title: string;
  detail: string;
  impactDailyMT: number;
  mitigationAvailable: boolean;
}
