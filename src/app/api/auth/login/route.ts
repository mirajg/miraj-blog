
import { NextResponse } from "next/server";
import { z } from "zod";
import { readJson } from "@/lib/api";
import { createSession, verifyCredentials } from "@/lib/auth";
import {
  clearAttempts,
  isRateLimited,
  recordFailedAttempt,
} from "@/lib/rate-limit";

const loginSchema = z.object({
  email: z.string().min(1).max(254),
  password: z.string().min(1).max(200),
});

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for") ?? "";
  const candidate = forwardedFor
    .split(",")
    .map((value) => value.trim())
    .find(Boolean) ??
    request.headers.get("x-real-ip") ??
    request.headers.get("cf-connecting-ip") ??
    "unknown";

  return /^[0-9A-Fa-f:.]+$/.test(candidate) ? candidate : "unknown";
}

export async function POST(request: Request) {
  const parsed = loginSchema.safeParse(await readJson(request));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 },
    );
  }

  const key = getClientIp(request);

  if (await isRateLimited(key)) {
    return NextResponse.json(
      { error: "Too many failed attempts. Try again later." },
      { status: 429 },
    );
  }

  const valid = await verifyCredentials(
    parsed.data.email,
    parsed.data.password,
  );

  if (!valid) {
    await recordFailedAttempt(key);
    // Same message whether the email or the password was wrong
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 },
    );
  }

  await clearAttempts(key);
  await createSession();
  return NextResponse.json({ ok: true });
}