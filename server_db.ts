import fs from "fs";
import path from "path";

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: "Chief Geologist" | "Mine Planning Superintendent" | "DGMS Safety Officer" | "Field Geologist";
  department: string;
  avatar: string;
  createdAt: string;
  lastLogin: string;
}

export interface DatabaseSchema {
  version: string;
  initializedAt: string;
  users: User[];
  verifiedTargets: {
    targetId: string;
    verifiedBy: string;
    verifiedAt: string;
    notes: string;
    assayGradeMn: number;
    depthMeters: number;
    status: "Verified" | "Drilling" | "Pending";
  }[];
  mapSettings: {
    mapProvider: "google-maps" | "mapbox" | "satellite-hybrid" | "osm";
    googleMapsApiKey?: string;
    mapboxAccessToken?: string;
    layerType: "spectral" | "satellite" | "geological" | "magnetics";
    activeCenter: [number, number];
    activeZoom: number;
  };
  apiKeys: {
    geminiApiKey?: string;
    preferredModel: string;
  };
  shortfallScenarios: {
    id: string;
    name: string;
    timestamp: string;
    projectedShortfallMT: number;
    recoveredTonnageMT: number;
    appliedInterventions: string[];
    author: string;
  }[];
  auditLogs: {
    id: string;
    timestamp: string;
    user: string;
    action: string;
    details: string;
  }[];
}

const DB_FILE_PATH = process.env.VERCEL
  ? path.join("/tmp", "server_db.json")
  : path.join(process.cwd(), "server_db.json");

const DEFAULT_DB: DatabaseSchema = {
  version: "1.0.0",
  initializedAt: new Date().toISOString(),
  users: [
    {
      id: "usr-001",
      name: "Dr. Alok Sharma",
      email: "dr.sharma@moil.in",
      passwordHash: "password123",
      role: "Chief Geologist",
      department: "Exploration & Remote Sensing, MOIL Head Office",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      createdAt: "2026-01-15T08:00:00.000Z",
      lastLogin: new Date().toISOString(),
    },
    {
      id: "usr-002",
      name: "Rajesh Patel",
      email: "rajesh.patel@moil.in",
      passwordHash: "password123",
      role: "Mine Planning Superintendent",
      department: "Balaghat Open-Cast & Underground Operations",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      createdAt: "2026-02-01T09:30:00.000Z",
      lastLogin: new Date().toISOString(),
    },
    {
      id: "usr-003",
      name: "S. K. Verma",
      email: "safety.officer@dgms.gov.in",
      passwordHash: "password123",
      role: "DGMS Safety Officer",
      department: "Directorate General of Mines Safety, Central Zone",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      createdAt: "2026-02-10T11:00:00.000Z",
      lastLogin: new Date().toISOString(),
    },
    {
      id: "usr-004",
      name: "Field Officer (Guest)",
      email: "demo@moil.in",
      passwordHash: "password123",
      role: "Field Geologist",
      department: "Ukwa & Tirodi Exploration Benches",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      createdAt: "2026-03-01T10:00:00.000Z",
      lastLogin: new Date().toISOString(),
    },
  ],
  verifiedTargets: [
    {
      targetId: "T-003",
      verifiedBy: "Dr. Alok Sharma",
      verifiedAt: "2026-09-10T14:30:00.000Z",
      notes: "Borehole BH-2026-03 intersected 4.2m thick high-grade braunite orebody at 28.5m depth. Core recovery 94%.",
      assayGradeMn: 44.8,
      depthMeters: 28.5,
      status: "Verified",
    },
    {
      targetId: "T-019",
      verifiedBy: "Rajesh Patel",
      verifiedAt: "2026-09-08T10:15:00.000Z",
      notes: "Pyrolusite lenses in Mansar Formation. Confirmed strike length 420m along Tirodi boundary.",
      assayGradeMn: 42.1,
      depthMeters: 34.0,
      status: "Verified",
    },
    {
      targetId: "T-042",
      verifiedBy: "Field Geologist (Ukwa Unit)",
      verifiedAt: "2026-09-02T16:45:00.000Z",
      notes: "Gondite outcrop with heavy black manganese staining. Assay pending chemical confirmation.",
      assayGradeMn: 38.6,
      depthMeters: 19.2,
      status: "Verified",
    },
  ],
  mapSettings: {
    mapProvider: "google-maps",
    googleMapsApiKey: "",
    mapboxAccessToken: "",
    layerType: "spectral",
    activeCenter: [21.805, 80.185],
    activeZoom: 12,
  },
  apiKeys: {
    geminiApiKey: process.env.GEMINI_API_KEY || "",
    preferredModel: "gemini-3.8-flash",
  },
  shortfallScenarios: [
    {
      id: "SCEN-01",
      name: "Monsoon Bench Slurry Recovery Baseline",
      timestamp: "2026-09-12T16:00:00.000Z",
      projectedShortfallMT: 750,
      recoveredTonnageMT: 860,
      appliedInterventions: [
        "Truck Fleet Re-deployment to Dry Benches",
        "Electronic Detonator Delay Optimization",
        "High-Capacity Submersible Sump Dewatering",
      ],
      author: "Rajesh Patel",
    },
  ],
  auditLogs: [
    {
      id: "LOG-1001",
      timestamp: new Date().toISOString(),
      user: "System",
      action: "Database Initialized",
      details: "MINE-INTEL persistent storage engine online with 4 verified user accounts and Sausar belt targets.",
    },
  ],
};

// In-memory cache synced to disk
let cacheDb: DatabaseSchema | null = null;

export function getDb(): DatabaseSchema {
  if (cacheDb) return cacheDb;

  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const content = fs.readFileSync(DB_FILE_PATH, "utf-8");
      cacheDb = JSON.parse(content) as DatabaseSchema;
    } else {
      cacheDb = JSON.parse(JSON.stringify(DEFAULT_DB));
      saveDb(cacheDb);
    }
  } catch (err) {
    console.error("Error reading database file, using default:", err);
    cacheDb = JSON.parse(JSON.stringify(DEFAULT_DB));
  }

  return cacheDb!;
}

export function saveDb(db: DatabaseSchema) {
  try {
    cacheDb = db;
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(db, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write to database file:", err);
  }
}

export function logAction(user: string, action: string, details: string) {
  const db = getDb();
  db.auditLogs.unshift({
    id: `LOG-${Date.now()}`,
    timestamp: new Date().toISOString(),
    user,
    action,
    details,
  });
  if (db.auditLogs.length > 100) {
    db.auditLogs = db.auditLogs.slice(0, 100);
  }
  saveDb(db);
}
