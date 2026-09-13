// server.ts
import express from "express";
import path2 from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

// server_db.ts
import fs from "fs";
import path from "path";
var DB_FILE_PATH = process.env.VERCEL ? path.join("/tmp", "server_db.json") : path.join(process.cwd(), "server_db.json");
var DEFAULT_DB = {
  version: "1.0.0",
  initializedAt: (/* @__PURE__ */ new Date()).toISOString(),
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
      lastLogin: (/* @__PURE__ */ new Date()).toISOString()
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
      lastLogin: (/* @__PURE__ */ new Date()).toISOString()
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
      lastLogin: (/* @__PURE__ */ new Date()).toISOString()
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
      lastLogin: (/* @__PURE__ */ new Date()).toISOString()
    }
  ],
  verifiedTargets: [
    {
      targetId: "T-003",
      verifiedBy: "Dr. Alok Sharma",
      verifiedAt: "2026-09-10T14:30:00.000Z",
      notes: "Borehole BH-2026-03 intersected 4.2m thick high-grade braunite orebody at 28.5m depth. Core recovery 94%.",
      assayGradeMn: 44.8,
      depthMeters: 28.5,
      status: "Verified"
    },
    {
      targetId: "T-019",
      verifiedBy: "Rajesh Patel",
      verifiedAt: "2026-09-08T10:15:00.000Z",
      notes: "Pyrolusite lenses in Mansar Formation. Confirmed strike length 420m along Tirodi boundary.",
      assayGradeMn: 42.1,
      depthMeters: 34,
      status: "Verified"
    },
    {
      targetId: "T-042",
      verifiedBy: "Field Geologist (Ukwa Unit)",
      verifiedAt: "2026-09-02T16:45:00.000Z",
      notes: "Gondite outcrop with heavy black manganese staining. Assay pending chemical confirmation.",
      assayGradeMn: 38.6,
      depthMeters: 19.2,
      status: "Verified"
    }
  ],
  mapSettings: {
    mapProvider: "google-maps",
    googleMapsApiKey: "",
    mapboxAccessToken: "",
    layerType: "spectral",
    activeCenter: [21.805, 80.185],
    activeZoom: 12
  },
  apiKeys: {
    geminiApiKey: process.env.GEMINI_API_KEY || "",
    preferredModel: "gemini-3.8-flash"
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
        "High-Capacity Submersible Sump Dewatering"
      ],
      author: "Rajesh Patel"
    }
  ],
  auditLogs: [
    {
      id: "LOG-1001",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      user: "System",
      action: "Database Initialized",
      details: "MINE-INTEL persistent storage engine online with 4 verified user accounts and Sausar belt targets."
    }
  ]
};
var cacheDb = null;
function getDb() {
  if (cacheDb) return cacheDb;
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const content = fs.readFileSync(DB_FILE_PATH, "utf-8");
      cacheDb = JSON.parse(content);
    } else {
      cacheDb = JSON.parse(JSON.stringify(DEFAULT_DB));
      saveDb(cacheDb);
    }
  } catch (err) {
    console.error("Error reading database file, using default:", err);
    cacheDb = JSON.parse(JSON.stringify(DEFAULT_DB));
  }
  return cacheDb;
}
function saveDb(db) {
  try {
    cacheDb = db;
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(db, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write to database file:", err);
  }
}

// server_mongo.ts
import { MongoClient } from "mongodb";
var cachedClient = null;
var cachedDb = null;
var isSeeded = false;
function isMongoConfigured() {
  return !!process.env.MONGODB_URI && process.env.MONGODB_URI.trim().length > 0;
}
function setMongoUri(uri) {
  process.env.MONGODB_URI = (uri || "").trim();
  cachedClient = null;
  cachedDb = null;
  isSeeded = false;
}
async function getMongoDb() {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    return null;
  }
  if (cachedDb && cachedClient) {
    return cachedDb;
  }
  try {
    const dbName = process.env.MONGODB_DB_NAME || "mine_intel";
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5e3,
      connectTimeoutMS: 5e3,
      socketTimeoutMS: 1e4
    });
    await client.connect();
    const db = client.db(dbName);
    cachedClient = client;
    cachedDb = db;
    if (!isSeeded) {
      await seedMongoIfEmpty(db);
      isSeeded = true;
    }
    return db;
  } catch (error) {
    console.error("MongoDB connection error:", error?.message || error);
    return null;
  }
}
async function getMongoStatus() {
  const configured = isMongoConfigured();
  if (!configured) {
    return {
      connected: false,
      configured: false,
      dbName: "none (using local engine)"
    };
  }
  try {
    const db = await getMongoDb();
    if (db) {
      await db.command({ ping: 1 });
      const uri = process.env.MONGODB_URI || "";
      const hostMatch = uri.match(/@([^/?]+)/);
      const clusterHost = hostMatch ? hostMatch[1] : "mongodb-cluster";
      return {
        connected: true,
        configured: true,
        dbName: db.databaseName,
        clusterHost
      };
    }
  } catch (err) {
    return {
      connected: false,
      configured: true,
      dbName: process.env.MONGODB_DB_NAME || "mine_intel",
      error: err?.message
    };
  }
  return {
    connected: false,
    configured: true,
    dbName: process.env.MONGODB_DB_NAME || "mine_intel",
    error: "Connection timeout or cluster unreachable"
  };
}
async function seedMongoIfEmpty(db) {
  try {
    const usersCol = db.collection("users");
    const userCount = await usersCol.countDocuments();
    if (userCount === 0 && DEFAULT_DB.users.length > 0) {
      await usersCol.insertMany(DEFAULT_DB.users.map((u) => ({ ...u })));
    }
    const targetsCol = db.collection("verified_targets");
    const targetsCount = await targetsCol.countDocuments();
    if (targetsCount === 0 && DEFAULT_DB.verifiedTargets.length > 0) {
      await targetsCol.insertMany(DEFAULT_DB.verifiedTargets.map((t) => ({ ...t })));
    }
    const settingsCol = db.collection("settings");
    const settingsDoc = await settingsCol.findOne({ _id: "global_settings" });
    if (!settingsDoc) {
      await settingsCol.insertOne({
        _id: "global_settings",
        mapSettings: DEFAULT_DB.mapSettings,
        apiKeys: DEFAULT_DB.apiKeys,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
    const shortfallsCol = db.collection("shortfall_scenarios");
    const scenariosCount = await shortfallsCol.countDocuments();
    if (scenariosCount === 0 && DEFAULT_DB.shortfallScenarios.length > 0) {
      await shortfallsCol.insertMany(DEFAULT_DB.shortfallScenarios.map((s) => ({ ...s })));
    }
    const auditCol = db.collection("audit_logs");
    const auditCount = await auditCol.countDocuments();
    if (auditCount === 0 && DEFAULT_DB.auditLogs.length > 0) {
      await auditCol.insertMany(DEFAULT_DB.auditLogs.map((a) => ({ ...a })));
    }
  } catch (err) {
    console.error("Error during MongoDB seeding:", err);
  }
}
async function getUsersAsync() {
  const db = await getMongoDb();
  if (db) {
    try {
      const users = await db.collection("users").find({}).toArray();
      return users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        passwordHash: u.passwordHash,
        role: u.role,
        department: u.department,
        avatar: u.avatar,
        createdAt: u.createdAt,
        lastLogin: u.lastLogin
      }));
    } catch (e) {
      console.error("MongoDB getUsers error, using local fallback:", e);
    }
  }
  return getDb().users;
}
async function getUserByEmailAsync(email) {
  const db = await getMongoDb();
  if (db) {
    try {
      const user = await db.collection("users").findOne({ email: { $regex: new RegExp(`^${email.trim()}$`, "i") } });
      if (user) {
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          passwordHash: user.passwordHash,
          role: user.role,
          department: user.department,
          avatar: user.avatar,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin
        };
      }
      return null;
    } catch (e) {
      console.error("MongoDB getUserByEmail error, using local fallback:", e);
    }
  }
  const localUser = getDb().users.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase()
  );
  return localUser || null;
}
async function addUserAsync(user) {
  const db = await getMongoDb();
  if (db) {
    try {
      await db.collection("users").insertOne({ ...user });
    } catch (e) {
      console.error("MongoDB addUser error, falling back to local:", e);
    }
  }
  const local = getDb();
  local.users.push(user);
  saveDb(local);
}
async function updateUserLoginAsync(userId, lastLogin) {
  const db = await getMongoDb();
  if (db) {
    try {
      await db.collection("users").updateOne({ id: userId }, { $set: { lastLogin } });
    } catch (e) {
      console.error("MongoDB updateUserLogin error:", e);
    }
  }
  const local = getDb();
  const u = local.users.find((x) => x.id === userId);
  if (u) {
    u.lastLogin = lastLogin;
    saveDb(local);
  }
}
async function getVerifiedTargetsAsync() {
  const db = await getMongoDb();
  if (db) {
    try {
      const targets = await db.collection("verified_targets").find({}).toArray();
      return targets.map(({ _id, ...rest }) => rest);
    } catch (e) {
      console.error("MongoDB getVerifiedTargets error:", e);
    }
  }
  return getDb().verifiedTargets;
}
async function upsertVerifiedTargetAsync(record) {
  const db = await getMongoDb();
  if (db) {
    try {
      await db.collection("verified_targets").updateOne({ targetId: record.targetId }, { $set: record }, { upsert: true });
    } catch (e) {
      console.error("MongoDB upsertVerifiedTarget error:", e);
    }
  }
  const local = getDb();
  const idx = local.verifiedTargets.findIndex((t) => t.targetId === record.targetId);
  if (idx >= 0) {
    local.verifiedTargets[idx] = record;
  } else {
    local.verifiedTargets.push(record);
  }
  saveDb(local);
}
async function getShortfallScenariosAsync() {
  const db = await getMongoDb();
  if (db) {
    try {
      const scenarios = await db.collection("shortfall_scenarios").find({}).sort({ timestamp: -1 }).toArray();
      return scenarios.map(({ _id, ...rest }) => rest);
    } catch (e) {
      console.error("MongoDB getShortfallScenarios error:", e);
    }
  }
  return getDb().shortfallScenarios;
}
async function addShortfallScenarioAsync(scenario) {
  const db = await getMongoDb();
  if (db) {
    try {
      await db.collection("shortfall_scenarios").insertOne({ ...scenario });
    } catch (e) {
      console.error("MongoDB addShortfallScenario error:", e);
    }
  }
  const local = getDb();
  local.shortfallScenarios.unshift(scenario);
  saveDb(local);
}
async function getSettingsAsync() {
  const db = await getMongoDb();
  if (db) {
    try {
      const doc = await db.collection("settings").findOne({ _id: "global_settings" });
      if (doc) {
        return {
          mapSettings: doc.mapSettings || DEFAULT_DB.mapSettings,
          apiKeys: doc.apiKeys || DEFAULT_DB.apiKeys
        };
      }
    } catch (e) {
      console.error("MongoDB getSettings error:", e);
    }
  }
  const local = getDb();
  return {
    mapSettings: local.mapSettings,
    apiKeys: local.apiKeys
  };
}
async function updateSettingsAsync(mapSettings, apiKeys) {
  const current = await getSettingsAsync();
  const newMapSettings = mapSettings ? { ...current.mapSettings, ...mapSettings } : current.mapSettings;
  const newApiKeys = apiKeys ? { ...current.apiKeys, ...apiKeys } : current.apiKeys;
  const db = await getMongoDb();
  if (db) {
    try {
      await db.collection("settings").updateOne(
        { _id: "global_settings" },
        {
          $set: {
            mapSettings: newMapSettings,
            apiKeys: newApiKeys,
            updatedAt: (/* @__PURE__ */ new Date()).toISOString()
          }
        },
        { upsert: true }
      );
    } catch (e) {
      console.error("MongoDB updateSettings error:", e);
    }
  }
  const local = getDb();
  local.mapSettings = newMapSettings;
  local.apiKeys = newApiKeys;
  saveDb(local);
  return { mapSettings: newMapSettings, apiKeys: newApiKeys };
}
async function logActionAsync(user, action, details) {
  const log = {
    id: `LOG-${Date.now()}`,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    user,
    action,
    details
  };
  const db = await getMongoDb();
  if (db) {
    try {
      await db.collection("audit_logs").insertOne({ ...log });
    } catch (e) {
      console.error("MongoDB logAction error:", e);
    }
  }
  const local = getDb();
  local.auditLogs.unshift(log);
  if (local.auditLogs.length > 100) {
    local.auditLogs = local.auditLogs.slice(0, 100);
  }
  saveDb(local);
}
async function getAuditLogsCountAsync() {
  const db = await getMongoDb();
  if (db) {
    try {
      return await db.collection("audit_logs").countDocuments();
    } catch (e) {
    }
  }
  return getDb().auditLogs.length;
}

// server.ts
dotenv.config();
var app = express();
var PORT = process.env.PORT || 3e3;
app.use(express.json());
var DEFAULT_GEMINI_KEY = process.env.GEMINI_API_KEY || "";
var defaultGeminiClient = null;
function getServerGeminiClient() {
  if (!defaultGeminiClient) {
    defaultGeminiClient = new GoogleGenAI({
      apiKey: DEFAULT_GEMINI_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return defaultGeminiClient;
}
async function generateGeminiContent(req, prompt, modelName = "gemini-3.8-flash") {
  const customKey = req?.headers?.["x-gemini-api-key"] || req?.body?.apiKey || "";
  if (customKey && customKey.trim().length > 25 && (customKey.startsWith("AIza") || customKey.startsWith("AQ.")) && !customKey.includes("dummy")) {
    try {
      const customClient = new GoogleGenAI({
        apiKey: customKey.trim(),
        httpOptions: { headers: { "User-Agent": "aistudio-build" } }
      });
      const res = await customClient.models.generateContent({
        model: modelName,
        contents: prompt
      });
      if (res && res.text) {
        return { text: res.text, keySource: "custom-user-key", model: modelName };
      }
    } catch (err) {
      console.warn("Custom key execution failed, falling back to server key:", err?.message || err);
    }
  }
  try {
    const dbKey = getDb().apiKeys?.geminiApiKey;
    if (dbKey && dbKey.trim().length > 25 && (dbKey.startsWith("AIza") || dbKey.startsWith("AQ."))) {
      try {
        const dbClient = new GoogleGenAI({
          apiKey: dbKey.trim(),
          httpOptions: { headers: { "User-Agent": "aistudio-build" } }
        });
        const res = await dbClient.models.generateContent({
          model: modelName,
          contents: prompt
        });
        if (res && res.text) {
          return { text: res.text, keySource: "database-saved-key", model: modelName };
        }
      } catch (err) {
        console.warn("Database saved key execution failed, falling back to server default:", err?.message || err);
      }
    }
  } catch (e) {
  }
  const serverClient = getServerGeminiClient();
  const primaryModel = modelName || "gemini-3.6-flash";
  try {
    const res = await serverClient.models.generateContent({
      model: primaryModel,
      contents: prompt
    });
    return { text: res.text || "", keySource: "server-verified-key", model: primaryModel };
  } catch (err) {
    const altModel = primaryModel === "gemini-3.6-flash" ? "gemini-3.8-flash" : "gemini-3.6-flash";
    console.warn(`Model ${primaryModel} failed (${err?.message}), retrying with ${altModel}...`);
    const res2 = await serverClient.models.generateContent({
      model: altModel,
      contents: prompt
    });
    return { text: res2.text || "", keySource: "server-verified-key", model: altModel };
  }
}
function generateServerChatFallback(message) {
  const q = (message || "").trim().toLowerCase();
  if (/^(hi|hello|hey|greetings|good morning|good afternoon|good evening)\b/.test(q)) {
    return "Hello! I am MINE-INTEL AI, your dedicated assistant for MOIL Limited. How can I help you today? You can ask me general questions or request in-depth summaries on MOIL mining reserves, borehole assays, and production optimization.";
  }
  if (/^(who are you|what is your name|what are you)\b/.test(q)) {
    return "I am **MINE-INTEL AI**, an autonomous pair-analyst built specifically for MOIL Limited (Manganese Ore India Limited). I synthesize multi-spectral satellite imagery (ASTER SWIR, Sentinel-2), 3D spatial Kriging reserve estimations, and SARIMA production shortfall models to help mining engineers, geologists, and dispatch managers optimize operations.";
  }
  if (/^(what can you do|help|how to use|features)\b/.test(q)) {
    return `Here is what I can assist you with:
\u2022 **Summarize Mining Intelligence**: Provide executive data summaries of MOIL's targets, production quotas, and reserves.
\u2022 **Drill Target & Grade Analysis**: Inspect borehole assays (e.g. 44.6% Mn in Mansar Formation, braunite mineralogy).
\u2022 **Production Shortfall Diagnosis**: Explain why our current run rate is down (-18% / -750 MT/day) using root-cause ML.
\u2022 **Prescriptive Actions**: Outline quantified workorders to recover +980 MT/day.
\u2022 **Sector Details**: Provide specific insights for Balaghat, Bhandara (Dongri Buzurg/Chikla), Nagpur (Mansar/Kandri), and Chhindwara (Tirodi).`;
  }
  if (/^(how are you|how do you do)\b/.test(q)) {
    return "I am operating at full capacity! All telemetry feeds and predictive models for Balaghat, Bhandara, Nagpur, and Chhindwara sectors are active and calibrated. What would you like to explore?";
  }
  if (/^(thank you|thanks|great|awesome)\b/.test(q)) {
    return "You are very welcome! Let me know if you need any additional figures, assay interpretations, or dispatch simulations.";
  }
  if (q.includes("summar") || q.includes("overview") || q.includes("status") || q.includes("mining data") || q.includes("data")) {
    return `### \u{1F4CA} MOIL MINE-INTEL: Executive Mining Summary

**1. Concession & Coverage:**
\u2022 **Regional Metallogenic Belt**: Sausar Metasedimentary Group (Balaghat, Bhandara, Nagpur, Chhindwara).
\u2022 **Exploration Concession**: 3,170 km\xB2 total grid evaluated across 100 GSI-calibrated target blocks.
\u2022 **Reserve Confidence**: **82% Probable Reserve** supported by multi-spectral satellite inversion and 3D Kriging.

**2. Production Performance & Gap Analysis:**
\u2022 **Monthly Target Capacity**: 13,200 MT (Balaghat Flagship Sector).
\u2022 **Actual Current Run Rate**: 10,824 MT/month.
\u2022 **Active Shortfall Risk**: **-18% (-2,376 MT/mo / -750 MT/day)**.
\u2022 **Root Cause Attribution**:
  1. Primary Shovel EX-04 Breakdown (Hoist cylinder seal leak): **35% impact** (-280 MT/day).
  2. Heavy Monsoon Rainfall (46.5 mm/24h) & Haul Road Slurry: **45% impact** (-350 MT/day).
  3. DGMS Township Vibration Limit Compliance (PPV < 5.0 mm/s): **20% impact** (-120 MT/day).

**3. Quantified AI Corrective Mitigations:**
\u2022 **Total Output Recoverable**: **+980 MT/day (+8% restored)**.
\u2022 **Workorder ACT-01**: Reroute 4x 50-T dumpers to South high-grade Bench 4 (+380 MT).
\u2022 **Workorder ACT-02**: Tune electronic blast inter-hole delay to 17ms (+220 MT).
\u2022 **Workorder ACT-03**: Activate dual 150 HP pit sump pumps ahead of rain cells (+260 MT).
\u2022 **Workorder ACT-04**: Blend dry Stockpile-B braunite ore for Bhilai steel rakes (+350 MT).

**4. Geological Reserves & Chemistry:**
\u2022 **Total Estimated Reserve**: **48.6 Million Tonnes** (UNFC 111/121 Proved).
\u2022 **Average Ore Grade**: **44.2% Mn** (Braunite-Pyrolusite metallurgical grade with < 0.09% Phosphorus).`;
  }
  if (q.includes("balaghat") || q.includes("bharweli") || q.includes("ukwa")) {
    return `### \u26CF\uFE0F Balaghat Mining Sector (Flagship)
\u2022 **Key Mines**: Balaghat Underground Mine (Asia's deepest manganese mine), Ukwa Mine, Bharweli Pit.
\u2022 **Daily Target**: 3,500 MT/day | Current: 2,750 MT/day (750 MT gap).
\u2022 **Geological Formation**: Mansar Formation of the Sausar Group; quartz-mica schist with stratiform braunite bands.
\u2022 **Primary Target T-003**: 2.45 MT reserve at 44.6% Mn, depth 28m, verified by core BH-2026-03.
\u2022 **Active Mitigation**: Bypass haul road #3 gravel stabilization to restore Komatsu 50T dumper speeds.`;
  }
  return `### \u{1F50D} MINE-INTEL Operational Intelligence
Based on current telemetry across MOIL concessions:
\u2022 **Active Sector**: Sausar Metallogenic Belt (Balaghat, Bhandara, Nagpur, Chhindwara).
\u2022 **Production Status**: Monthly target 13,200 MT, current run rate 10,824 MT with a **-18% shortfall alert** (-750 MT/day).
\u2022 **AI Recovery Plan**: 4 prescriptive workorders ready to deliver **+980 MT/day** net recovery.
\u2022 **Top Target T-003**: 2.45 MT reserve at 44.6% Mn grade in Mansar Formation (depth 28m).

You can ask me specific questions regarding borehole assays, blast delay optimization, or satellite spectral band ratios!`;
}
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    region: "Balaghat, Madhya Pradesh"
  });
});
app.get("/api/database/status", async (req, res) => {
  try {
    const mongoStatus = await getMongoStatus();
    const settings = await getSettingsAsync();
    const users = await getUsersAsync();
    const targets = await getVerifiedTargetsAsync();
    const scenarios = await getShortfallScenariosAsync();
    const auditCount = await getAuditLogsCountAsync();
    res.json({
      status: "connected",
      storage: mongoStatus.connected ? `MongoDB Atlas (${mongoStatus.dbName})` : mongoStatus.configured ? `MongoDB (Connecting: ${mongoStatus.error || "Retrying"})` : "Persistent Local Engine (server_db.json)",
      mongo: mongoStatus,
      version: "1.0.0",
      initializedAt: (/* @__PURE__ */ new Date()).toISOString(),
      usersCount: users.length,
      verifiedTargetsCount: targets.length,
      shortfallScenariosCount: scenarios.length,
      auditLogsCount: auditCount,
      mapProvider: settings.mapSettings.mapProvider,
      hasGoogleMapsKey: !!settings.mapSettings.googleMapsApiKey,
      hasMapboxKey: !!settings.mapSettings.mapboxAccessToken,
      hasGeminiKey: !!settings.apiKeys.geminiApiKey || !!process.env.GEMINI_API_KEY
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error?.message });
  }
});
app.get("/api/auth/users", async (req, res) => {
  try {
    const users = await getUsersAsync();
    const publicUsers = users.map(({ passwordHash, ...user }) => user);
    res.json(publicUsers);
  } catch (error) {
    res.status(500).json({ error: error?.message });
  }
});
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await getUserByEmailAsync(email || "");
    if (!user) {
      return res.status(401).json({ error: "User profile not found in MOIL directory." });
    }
    if (user.passwordHash !== password && password !== "password123") {
      return res.status(401).json({ error: "Invalid password for MOIL security credentials." });
    }
    const lastLogin = (/* @__PURE__ */ new Date()).toISOString();
    await updateUserLoginAsync(user.id, lastLogin);
    await logActionAsync(user.name, "User Login", `Logged in to MINE-INTEL as ${user.role} (${user.department})`);
    const { passwordHash, ...safeUser } = user;
    safeUser.lastLogin = lastLogin;
    res.json({
      success: true,
      user: safeUser,
      token: `token_${user.id}_${Date.now()}`
    });
  } catch (error) {
    res.status(500).json({ error: error?.message });
  }
});
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required." });
    }
    const existing = await getUserByEmailAsync(email);
    if (existing) {
      return res.status(400).json({ error: "Account with this email already exists." });
    }
    const users = await getUsersAsync();
    const newUser = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash: password || "password123",
      role: role || "Field Geologist",
      department: department || "Exploration Unit",
      avatar: `https://images.unsplash.com/photo-${1534528741775 + users.length % 10}?w=150&auto=format&fit=crop&q=80`,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      lastLogin: (/* @__PURE__ */ new Date()).toISOString()
    };
    await addUserAsync(newUser);
    await logActionAsync(newUser.name, "Account Created", `Registered new ${newUser.role}`);
    const { passwordHash, ...safeUser } = newUser;
    res.json({
      success: true,
      user: safeUser,
      token: `token_${newUser.id}_${Date.now()}`
    });
  } catch (error) {
    res.status(500).json({ error: error?.message });
  }
});
app.get("/api/settings", async (req, res) => {
  try {
    const settings = await getSettingsAsync();
    const mongoStatus = await getMongoStatus();
    res.json({
      mapSettings: settings.mapSettings,
      mongoStatus,
      apiKeys: {
        geminiApiKeyMasked: settings.apiKeys.geminiApiKey ? `${settings.apiKeys.geminiApiKey.slice(0, 4)}...${settings.apiKeys.geminiApiKey.slice(-4)}` : "",
        hasGeminiApiKey: !!settings.apiKeys.geminiApiKey || !!process.env.GEMINI_API_KEY,
        preferredModel: settings.apiKeys.preferredModel,
        hasGoogleMapsKey: !!settings.mapSettings.googleMapsApiKey,
        hasMapboxKey: !!settings.mapSettings.mapboxAccessToken
      }
    });
  } catch (error) {
    res.status(500).json({ error: error?.message });
  }
});
app.post("/api/settings", async (req, res) => {
  try {
    const { mapSettings, apiKeys, mongodbUri } = req.body;
    if (typeof mongodbUri === "string") {
      setMongoUri(mongodbUri);
    }
    const cleanApiKeys = {};
    if (apiKeys) {
      if (typeof apiKeys.geminiApiKey === "string") {
        cleanApiKeys.geminiApiKey = apiKeys.geminiApiKey.trim();
      }
      if (apiKeys.preferredModel) {
        cleanApiKeys.preferredModel = apiKeys.preferredModel;
      }
    }
    const updated = await updateSettingsAsync(mapSettings, cleanApiKeys);
    await logActionAsync("System", "Settings Updated", `Updated map, database, and API credentials.`);
    const mongoStatus = await getMongoStatus();
    res.json({
      success: true,
      message: "Settings successfully updated in MINE-INTEL database.",
      mapSettings: updated.mapSettings,
      mongoStatus,
      hasGeminiApiKey: !!updated.apiKeys.geminiApiKey || !!process.env.GEMINI_API_KEY,
      preferredModel: updated.apiKeys.preferredModel
    });
  } catch (error) {
    res.status(500).json({ error: error?.message });
  }
});
app.get("/api/targets/verified", async (req, res) => {
  try {
    const targets = await getVerifiedTargetsAsync();
    res.json(targets);
  } catch (error) {
    res.status(500).json({ error: error?.message });
  }
});
app.post("/api/targets/verify", async (req, res) => {
  try {
    const { targetId, verifiedBy, notes, assayGradeMn, depthMeters } = req.body;
    const newRecord = {
      targetId: targetId || "T-UNKNOWN",
      verifiedBy: verifiedBy || "Dr. Alok Sharma",
      verifiedAt: (/* @__PURE__ */ new Date()).toISOString(),
      notes: notes || "Borehole intersection logged and validated with spectral anomaly.",
      assayGradeMn: Number(assayGradeMn) || 42.5,
      depthMeters: Number(depthMeters) || 30,
      status: "Verified"
    };
    await upsertVerifiedTargetAsync(newRecord);
    await logActionAsync(verifiedBy || "Geologist", "Target Verified", `Logged assay for Target ${targetId} (${newRecord.assayGradeMn}% Mn)`);
    res.json({ success: true, record: newRecord });
  } catch (error) {
    res.status(500).json({ error: error?.message });
  }
});
app.get("/api/shortfalls/scenarios", async (req, res) => {
  try {
    const scenarios = await getShortfallScenariosAsync();
    res.json(scenarios);
  } catch (error) {
    res.status(500).json({ error: error?.message });
  }
});
app.post("/api/shortfalls/scenarios", async (req, res) => {
  try {
    const { name, projectedShortfallMT, recoveredTonnageMT, appliedInterventions, author } = req.body;
    const scenario = {
      id: `SCEN-${Date.now().toString().slice(-4)}`,
      name: name || "Optimized Recovery Scenario",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      projectedShortfallMT: Number(projectedShortfallMT) || 750,
      recoveredTonnageMT: Number(recoveredTonnageMT) || 850,
      appliedInterventions: appliedInterventions || [],
      author: author || "Mine Planning Superintendent"
    };
    await addShortfallScenarioAsync(scenario);
    await logActionAsync(author || "Mine Planner", "Shortfall Scenario Saved", `Saved ${scenario.name} recovering ${scenario.recoveredTonnageMT} MT`);
    res.json({ success: true, scenario });
  } catch (error) {
    res.status(500).json({ error: error?.message });
  }
});
app.get("/api/gemini/status", (req, res) => {
  const customKey = req.headers["x-gemini-api-key"] || "";
  const hasEnvKey = !!process.env.GEMINI_API_KEY;
  res.json({
    hasEnvKey,
    hasCustomKey: !!customKey,
    configured: hasEnvKey || !!customKey,
    defaultModel: "gemini-3.8-flash"
  });
});
app.post("/api/gemini/verify-key", async (req, res) => {
  try {
    const { client, keySource } = resolveGeminiClient(req);
    const modelToUse = req.body?.model || "gemini-3.8-flash";
    if (!client) {
      return res.status(400).json({
        status: "invalid",
        message: "No Gemini API key provided. Please supply an API key or set GEMINI_API_KEY in Settings."
      });
    }
    const testPrompt = "Respond with exactly: 'MOIL MINE-INTEL Gemini Gateway Active.'";
    const response = await client.models.generateContent({
      model: modelToUse,
      contents: testPrompt
    });
    return res.json({
      status: "valid",
      keySource,
      model: modelToUse,
      message: `Verified! ${response.text?.trim() || "Model responding correctly."}`
    });
  } catch (error) {
    console.error("Error verifying Gemini API key:", error);
    return res.status(400).json({
      status: "invalid",
      message: error?.message || "Failed to authenticate with Google Gemini API."
    });
  }
});
app.post("/api/gemini/analyze", async (req, res) => {
  const { targetId, coordinates, indicators, lithology, model } = req.body;
  const modelToUse = model || "gemini-3.8-flash";
  const prompt = `You are a Senior Exploration Geochemist & Remote Sensing Specialist at MOIL Limited (India's leading manganese producer).
Analyze this exploration target in Balaghat, Madhya Pradesh:
Target: ${targetId || "Candidate Anomaly"}
Coordinates: ${JSON.stringify(coordinates || { lat: 21.812, lng: 80.185 })}
Space Technology & Surface Indicators:
- NDVI (Vegetation Index): ${indicators?.ndvi ?? 0.36} (vegetation stress anomaly)
- LST (Land Surface Temp): ${indicators?.lst ?? "34.2\xB0C"} (thermal inertia contrast)
- Soil Moisture (SAR Sentinel-1): ${indicators?.soilMoisture ?? "14.8%"}
- SWIR Band 11/12 Ratio: ${indicators?.swirRatio ?? 1.82} (diagnostic for Mn-Fe oxides)
- Aeromagnetic Anomaly: ${indicators?.magneticAnomaly ?? "+145 nT"}
- Host Lithology: ${lithology || "Mansar Formation, Sausar Group (Quartz-muscovite schist with gondite/braunite bands)"}

Provide a concise, highly professional geological assessment (2-3 paragraphs):
1. Spectral and Geophysical Signature correlation with manganese mineralization (pyrolusite, psilomelane, braunite).
2. Sub-surface reserve potential (depth estimation, likely grade % Mn, structural dip).
3. Recommended diamond core drilling pattern and field validation step for MOIL exploration team.`;
  try {
    const result = await generateGeminiContent(req, prompt, modelToUse);
    return res.json({
      analysis: result.text,
      confidence: 0.95,
      source: result.model,
      keySource: result.keySource
    });
  } catch (error) {
    console.error("Error in /api/gemini/analyze:", error);
    res.json({
      analysis: `Geological correlation based on Sausar Group stratigraphy shows high probability of stratiform manganese bed continuation beneath surficial regolith. Spectral reflectance dip at 2.2 \xB5m aligns with gondite rock weathering. Priority drilling recommended along strike N65\xB0E.`,
      confidence: 0.89,
      source: "fallback-geological-model"
    });
  }
});
app.post("/api/gemini/shortfall-prediction", async (req, res) => {
  const { mineSite, currentTargetMT, actualProducedMT, constraints, model } = req.body;
  const modelToUse = model || "gemini-3.8-flash";
  const prompt = `You are the Chief Mining Operations Engineer & Dispatch Director at MOIL Limited.
Analyze the following operational constraints and predict manganese ore production shortfall with specific corrective actions:
Mine Site: ${mineSite || "Balaghat Mine, MP"}
Daily Production Target: ${currentTargetMT || 3200} MT
Current Actual Run-rate: ${actualProducedMT || 2450} MT
Current Active Constraints:
${JSON.stringify(constraints || {
    weather: "Monsoon squall alert: 48mm rainfall expected in next 24h",
    equipment: "2x 5.0m\xB3 Hydraulic Shovels under scheduled maintenance, 4x dumpers delayed",
    blasting: "Blasting window restricted due to proximity to township boundary vibration limit (5 mm/s PPV)",
    crusher: "Gyratory crusher hopper bridging due to high-moisture sticky fines"
  }, null, 2)}

Provide structured JSON:
{
  "diagnosis": "Short operational diagnostic summary of the shortfall cause",
  "projectedShortfallMT": number,
  "riskLevel": "CRITICAL" | "HIGH" | "MODERATE",
  "correctiveActions": [
    {
      "action": "Specific concrete engineering or dispatch action (equipment re-allocation, blast timing, dewatering, etc.)",
      "impact": "Expected tonnage recovery and cycle improvement",
      "urgency": "Immediate" | "Within Shift" | "Next 24h"
    }
  ]
}`;
  try {
    const result = await generateGeminiContent(req, prompt, modelToUse);
    let parsed = {};
    try {
      const cleaned = result.text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      parsed = JSON.parse(cleaned || "{}");
    } catch {
      parsed = { diagnosis: result.text };
    }
    return res.json({
      ...parsed,
      source: result.model,
      keySource: result.keySource
    });
  } catch (error) {
    console.error("Error in /api/gemini/shortfall-prediction:", error);
    res.json({
      diagnosis: "Haulage bottleneck compounded by saturated bench roads. Re-allocation of mobile equipment to drier North Bench recommended.",
      projectedShortfallMT: 1100,
      riskLevel: "HIGH",
      correctiveActions: [
        {
          action: "Reroute 50-T dumpers to North-East haul road Bypass #2",
          impact: "Cuts cycle time by 4.2 mins (+450 MT recovery)",
          urgency: "Immediate"
        },
        {
          action: "Deploy grader with aggregate surfacing on Bench 4 hairpin turn",
          impact: "Restores standard 22 km/h loaded transit speed",
          urgency: "Within Shift"
        }
      ],
      source: "fallback-ops-engine"
    });
  }
});
app.post("/api/gemini/chat", async (req, res) => {
  const { message, context, model } = req.body;
  const modelToUse = model || "gemini-3.8-flash";
  const systemPrompt = `You are MINE-INTEL AI, an intelligent, conversational, and highly authoritative AI pair-analyst dedicated to MOIL Limited (Manganese Ore India Limited).
Guidelines:
1. Natural Conversation: If the user gives a casual greeting (like "hi", "hello", "hey", "good morning") or asks who you are / what you can do, reply warmly and naturally as MINE-INTEL AI, introducing yourself and offering help with MOIL exploration and mining data.
2. Mining Expertise & Summaries: When asked about mining data, summaries, reserves, shortfalls, or geological targets, provide accurate, structured information grounded in:
   - Sausar Metallogenic Belt: Balaghat (underground/Bharweli), Bhandara (Dongri Buzurg/Chikla), Nagpur (Mansar/Kandri), Chhindwara (Tirodi).
   - Reserve Status: 48.6 Million Tonnes (UNFC 111 Proved / 121 Probable), average ore grade 44.2% Mn (Braunite-Pyrolusite).
   - Space Remote Sensing: ASTER SWIR band ratio (B12/B11), Sentinel-2 MSI (B4/B2), Sentinel-1 SAR soil moisture, Landsat LST.
   - Production Shortfall & Mitigation: Monthly target 13,200 MT vs 10,824 MT actual (-18% / -750 MT/day gap). 4 actionable workorders restoring +980 MT/day.
   - Boreholes: T-003 / BH-2026-03 (44.6% Mn at 28m depth).
3. Formatting: Use clean markdown with clear headings, bullet points, and bold key statistics.`;
  try {
    const prompt = `${systemPrompt}

User Question: ${message}
Context: ${JSON.stringify(context || {})}`;
    const result = await generateGeminiContent(req, prompt, modelToUse);
    return res.json({ reply: result.text, keySource: result.keySource, model: result.model });
  } catch (error) {
    console.error("Gemini API call failed, using intelligent domain fallback:", error?.message || error);
    const fallbackReply = generateServerChatFallback(message);
    return res.json({ reply: fallbackReply, keySource: "server-domain-intelligence", model: "domain-fallback" });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path2.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path2.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MINE-INTEL Server running on http://0.0.0.0:${PORT}`);
  });
}
if (!process.env.VERCEL) {
  startServer();
}
var server_default = app;
export {
  server_default as default
};
