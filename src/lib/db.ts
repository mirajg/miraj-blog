
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error("MONGODB_URI is not set");

const globalCache = globalThis as unknown as {
  mongooseCache?: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
};
const cache = (globalCache.mongooseCache ??= { conn: null, promise: null });

export async function connectDB() {
  if (cache.conn) return cache.conn;

  cache.promise ??= mongoose
    .connect(MONGODB_URI!, { bufferCommands: false, serverSelectionTimeoutMS: 8000 })
    .catch((err) => {
      cache.promise = null; // allow a retry instead of caching the failure
      throw err;
    });

  cache.conn = await cache.promise;
  return cache.conn;
}