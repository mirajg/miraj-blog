
import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth";

export async function POST(request: Request) {
  await destroySession();
  // 303 makes the browser follow the redirect with a GET
  return NextResponse.redirect(new URL("/admin/login", request.url), 303);
}