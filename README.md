
# Miraj's Dev Blog

Personal developer blog at blog.mirajgautam.com.np, built with Next.js (App Router),
TypeScript, MongoDB (Mongoose) and Tailwind CSS. Only the owner can write posts,
through a private admin dashboard. Visitors can only read.

## Setup

```bash
npm install
cp .env.example .env.local
```

Fill in `.env.local`:

1. `MONGODB_URI`: your MongoDB Atlas connection string.
2. `ADMIN_EMAIL`: the email you will log in with.
3. `ADMIN_PASSWORD_HASH`: run `npm run hash-password -- "your-long-password"` and
   paste the printed line.
4. `JWT_SECRET`: run `npm run gen-secret` and paste the output.

Then start the dev server:

```bash
npm run dev
```

- Blog: http://localhost:3000
- Admin: http://localhost:3000/admin/login

## Project structure

```
src/
  app/
    (public)/   Home, blog, categories, about, post pages
    admin/      Private dashboard and post editor (noindex)
    api/        Auth and post endpoints (admin only)
    sitemap.ts, robots.ts
  components/   layout, blog, admin, seo, ui
  lib/          db, auth, slug, seo, env, helpers
  models/       Mongoose models (Post, LoginAttempt)
  services/     Database queries (post.service.ts)
  constants/    Site name, URLs, categories
  types/        Shared TypeScript types
  proxy.ts      Redirects logged-out visitors away from /admin
```

## Writing posts

1. Log in at `/admin/login` and click **New post**.
2. Write the content in Markdown. Use `##` and `###` for headings; the title is the H1.
3. Add alt text for the cover image, pick a category, and tick **Published** when ready.
   Leave it unticked to keep a draft.
4. The slug is generated from the title. You can edit it by hand. It never changes
   automatically when the title changes.

## Deploying (Vercel)

1. Push to GitHub and import the repo in Vercel.
2. Add all variables from `.env.example` in Project Settings > Environment Variables.
   Paste `ADMIN_PASSWORD_HASH` without the `\` escapes.
3. In MongoDB Atlas > Network Access, allow Vercel to connect (usually `0.0.0.0/0`,
   so keep the database password strong).
4. Add `blog.mirajgautam.com.np` in Vercel > Domains and create the DNS record Vercel
   shows (usually a CNAME for `blog`).
5. After the first deploy, open `/sitemap.xml`, then submit it in Google Search Console
   and Bing Webmaster Tools.

## Security notes

- Admin password is stored only as a bcrypt hash. Secrets live in environment variables.
- Never prefix a secret with `NEXT_PUBLIC_`. Those values are visible in the browser.
- Sessions are an httpOnly cookie. To end all sessions at once, change `JWT_SECRET`.
- Login is rate limited (5 failed attempts per IP per 15 minutes).