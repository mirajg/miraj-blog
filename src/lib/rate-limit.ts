
import { connectDB } from "@/lib/db";
import LoginAttempt from "@/models/LoginAttempt";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export async function isRateLimited(key: string) {
    await connectDB();
    // MongoDB's cleanup runs about once a minute, so check the expiry ourselves too
    const attempt = await LoginAttempt.findOne({
        key,
        expiresAt: { $gt: new Date() },
    }).lean();

    return (attempt?.count ?? 0) >= MAX_ATTEMPTS;
}

export async function recordFailedAttempt(key: string) {
    await connectDB();
    const now = new Date();

    // If the old window has expired, start fresh
    await LoginAttempt.deleteOne({ key, expiresAt: { $lte: now } });

    await LoginAttempt.updateOne(
        { key },
        {
            $inc: { count: 1 },
            $setOnInsert: { expiresAt: new Date(now.getTime() + WINDOW_MS) },
        },
        { upsert: true },
    );
}

export async function clearAttempts(key: string) {
    await connectDB();
    await LoginAttempt.deleteOne({ key });
}