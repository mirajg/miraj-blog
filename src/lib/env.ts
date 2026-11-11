
import "server-only";
import { z } from "zod";

// Only server-side secrets are checked here. The NEXT_PUBLIC_* values are
// read directly in constants/site.ts, because Next.js must see them literally.
const envSchema = z.object({
  MONGODB_URI: z.string().min(1),
  ADMIN_EMAIL: z.string().min(1),
  ADMIN_PASSWORD_HASH: z
    .string()
    .regex(
      /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/,
      "not a valid bcrypt hash. In .env, escape every $ as \\$",
    ),
  JWT_SECRET: z.string().min(32, "must be at least 32 characters"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const problems = parsed.error.issues
    .map((issue) => `- ${issue.path.join(".")}: ${issue.message}`)
    .join("\n");
  throw new Error(`Invalid environment variables:\n${problems}`);
}

export const env = parsed.data;