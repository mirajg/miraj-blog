
// lib/db.ts
import mongoose from "mongoose";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalCache = globalThis as unknown as { mongooseCache?: MongooseCache };
const cache = (globalCache.mongooseCache ??= { conn: null, promise: null });

export class DatabaseError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = "DatabaseError";
  }
}

export async function connectDB(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new DatabaseError("MONGODB_URI is not set in the environment");
  }

  // Reuse the connection only if it is actually alive (1 = connected)
  if (cache.conn && mongoose.connection.readyState === 1) {
    return cache.conn;
  }

  try {
    cache.promise ??= mongoose.connect(uri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000,
      maxPoolSize: 5, // keep small on serverless
    });
    cache.conn = await cache.promise;
    return cache.conn;
  } catch (err) {
    // Reset so the next call retries instead of reusing a failed promise
    cache.promise = null;
    cache.conn = null;
    const reason = err instanceof Error ? err.message : String(err);
    throw new DatabaseError(`MongoDB connection failed: ${reason}`, err);
  }
}