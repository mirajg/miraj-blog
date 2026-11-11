
import "server-only";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "@/lib/env";

export const SESSION_COOKIE = "admin_session";
const SESSION_DAYS = 7;

const secret = new TextEncoder().encode(env.JWT_SECRET);

export async function verifyCredentials(email: string, password: string) {
  const emailMatches =
    email.trim().toLowerCase() === env.ADMIN_EMAIL.trim().toLowerCase();

  // Always run bcrypt, even when the email is wrong, so the response time
  // doesn't reveal which of the two was incorrect.
  const passwordMatches = await bcrypt.compare(password, env.ADMIN_PASSWORD_HASH);

  return emailMatches && passwordMatches;
}

export async function createSession() {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true, // JavaScript in the browser can't read it
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function isAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return false;

  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });
    return payload.role === "admin";
  } catch {
    return false; // expired, tampered with, or signed with another secret
  }
}

// For admin pages: sends logged-out visitors to the login page.
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}