
import { NextResponse } from "next/server";
import type { ZodError } from "zod";

export function unauthorized() {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function notFound() {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
}

export function slugTaken() {
    return NextResponse.json(
        { error: "That slug is already in use." },
        { status: 409 },
    );
}

export function invalidData(error: ZodError) {
    return NextResponse.json(
        {
            error: "Invalid data",
            issues: error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            })),
        },
        { status: 400 },
    );
}

// Returns null instead of throwing when the body isn't valid JSON.
export async function readJson(request: Request): Promise<unknown> {
    try {
        return await request.json();
    } catch {
        return null;
    }
}