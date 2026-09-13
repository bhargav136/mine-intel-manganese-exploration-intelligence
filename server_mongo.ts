import { MongoClient, Db } from "mongodb";
import { User, DatabaseSchema, DEFAULT_DB, getDb, saveDb } from "./server_db";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;
let isSeeded = false;

export interface MongoStatus {
  connected: boolean;
  configured: boolean;
  dbName: string;
  clusterHost?: string;
  error?: string;
}

export function isMongoConfigured(): boolean {
  return !!process.env.MONGODB_URI && process.env.MONGODB_URI.trim().length > 0;
}

export function setMongoUri(uri: string) {
  process.env.MONGODB_URI = (uri || "").trim();
  cachedClient = null;
  cachedDb = null;
  isSeeded = false;
}

export async function getMongoDb(): Promise<Db | null> {
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
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      socketTimeoutMS: 10000,
    });

    await client.connect();
    const db = client.db(dbName);

    cachedClient = client;
    cachedDb = db;

    // Seed default data if needed
    if (!isSeeded) {
      await seedMongoIfEmpty(db);
      isSeeded = true;
    }

    return db;
  } catch (error: any) {
    console.error("MongoDB connection error:", error?.message || error);
    return null;
  }
}

export async function getMongoStatus(): Promise<MongoStatus> {
  const configured = isMongoConfigured();
  if (!configured) {
    return {
      connected: false,
      configured: false,
      dbName: "none (using local engine)",
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
        clusterHost,
      };
    }
  } catch (err: any) {
    return {
      connected: false,
      configured: true,
      dbName: process.env.MONGODB_DB_NAME || "mine_intel",
      error: err?.message,
    };
  }

  return {
    connected: false,
    configured: true,
    dbName: process.env.MONGODB_DB_NAME || "mine_intel",
    error: "Connection timeout or cluster unreachable",
  };
}

async function seedMongoIfEmpty(db: Db) {
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
    const settingsDoc = await settingsCol.findOne({ _id: "global_settings" as any });
    if (!settingsDoc) {
      await settingsCol.insertOne({
        _id: "global_settings" as any,
        mapSettings: DEFAULT_DB.mapSettings,
        apiKeys: DEFAULT_DB.apiKeys,
        updatedAt: new Date().toISOString(),
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

// User operations
export async function getUsersAsync(): Promise<User[]> {
  const db = await getMongoDb();
  if (db) {
    try {
      const users = await db.collection("users").find({}).toArray();
      return users.map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        passwordHash: u.passwordHash,
        role: u.role,
        department: u.department,
        avatar: u.avatar,
        createdAt: u.createdAt,
        lastLogin: u.lastLogin,
      }));
    } catch (e) {
      console.error("MongoDB getUsers error, using local fallback:", e);
    }
  }
  return getDb().users;
}

export async function getUserByEmailAsync(email: string): Promise<User | null> {
  const db = await getMongoDb();
  if (db) {
    try {
      const user = await db
        .collection("users")
        .findOne({ email: { $regex: new RegExp(`^${email.trim()}$`, "i") } });
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
          lastLogin: user.lastLogin,
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

export async function addUserAsync(user: User): Promise<void> {
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

export async function updateUserLoginAsync(userId: string, lastLogin: string): Promise<void> {
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

// Verified targets operations
export async function getVerifiedTargetsAsync(): Promise<any[]> {
  const db = await getMongoDb();
  if (db) {
    try {
      const targets = await db.collection("verified_targets").find({}).toArray();
      return targets.map(({ _id, ...rest }: any) => rest);
    } catch (e) {
      console.error("MongoDB getVerifiedTargets error:", e);
    }
  }
  return getDb().verifiedTargets;
}

export async function upsertVerifiedTargetAsync(record: any): Promise<void> {
  const db = await getMongoDb();
  if (db) {
    try {
      await db
        .collection("verified_targets")
        .updateOne({ targetId: record.targetId }, { $set: record }, { upsert: true });
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

// Shortfall scenarios operations
export async function getShortfallScenariosAsync(): Promise<any[]> {
  const db = await getMongoDb();
  if (db) {
    try {
      const scenarios = await db
        .collection("shortfall_scenarios")
        .find({})
        .sort({ timestamp: -1 })
        .toArray();
      return scenarios.map(({ _id, ...rest }: any) => rest);
    } catch (e) {
      console.error("MongoDB getShortfallScenarios error:", e);
    }
  }
  return getDb().shortfallScenarios;
}

export async function addShortfallScenarioAsync(scenario: any): Promise<void> {
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

// Settings operations
export async function getSettingsAsync(): Promise<{ mapSettings: any; apiKeys: any }> {
  const db = await getMongoDb();
  if (db) {
    try {
      const doc = (await db
        .collection("settings")
        .findOne({ _id: "global_settings" as any })) as any;
      if (doc) {
        return {
          mapSettings: doc.mapSettings || DEFAULT_DB.mapSettings,
          apiKeys: doc.apiKeys || DEFAULT_DB.apiKeys,
        };
      }
    } catch (e) {
      console.error("MongoDB getSettings error:", e);
    }
  }
  const local = getDb();
  return {
    mapSettings: local.mapSettings,
    apiKeys: local.apiKeys,
  };
}

export async function updateSettingsAsync(
  mapSettings?: any,
  apiKeys?: any
): Promise<{ mapSettings: any; apiKeys: any }> {
  const current = await getSettingsAsync();
  const newMapSettings = mapSettings ? { ...current.mapSettings, ...mapSettings } : current.mapSettings;
  const newApiKeys = apiKeys ? { ...current.apiKeys, ...apiKeys } : current.apiKeys;

  const db = await getMongoDb();
  if (db) {
    try {
      await db.collection("settings").updateOne(
        { _id: "global_settings" as any },
        {
          $set: {
            mapSettings: newMapSettings,
            apiKeys: newApiKeys,
            updatedAt: new Date().toISOString(),
          },
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

// Audit logs
export async function logActionAsync(user: string, action: string, details: string) {
  const log = {
    id: `LOG-${Date.now()}`,
    timestamp: new Date().toISOString(),
    user,
    action,
    details,
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

export async function getAuditLogsCountAsync(): Promise<number> {
  const db = await getMongoDb();
  if (db) {
    try {
      return await db.collection("audit_logs").countDocuments();
    } catch (e) {
      // fallback
    }
  }
  return getDb().auditLogs.length;
}
