# packdev-demo-nestjs

Live Dependabot target for [packdev-agents](https://github.com/dionmaicon/packdev-agents).
A real Nest **apps/** monorepo (Nest's own convention, distinct from the
`packages/*` npm-workspaces layout used by
[packdev-demo-express](https://github.com/dionmaicon/packdev-demo-express)) —
two independently-Dependabot-tracked apps, `apps/gateway` and
`apps/notifier`, both pinned to the same old exact `@nestjs/core` version so
either can get its own genuine Dependabot bump PR.

Meant to stay **private**. Only `packdev-agents` (the action being
referenced) needs to be public.

## Layout

- `package.json` — workspaces root, declares `"workspaces": ["apps/*"]`.
- `apps/gateway/` — a small orders API (`/health`, `POST /orders`,
  `GET /orders/:id`).
- `apps/notifier/` — a small notification service (`/health`,
  `POST /notify`, `GET /notifications/:id`) — deliberately a different real
  app, not a copy of `gateway`.
- Both: `@nestjs/core`, `@nestjs/common`, `@nestjs/platform-express` pinned
  to an exact old version (`11.0.0`), real e2e tests booting the actual Nest
  application and hitting it over real HTTP (`node:test` + `node:http`, no
  mocking, no supertest dependency). `pretest` runs `tsc` first since Nest
  needs `emitDecoratorMetadata`, which esbuild-based TS runners don't
  support — tests run against the compiled `dist/` output.
- `.github/dependabot.yml` — **two** `updates:` entries, one per app
  directory. A bump never touches both `apps/gateway/package.json` and
  `apps/notifier/package.json` in the same PR.
- `.github/workflows/packdev-compat.yml` — runs on every `dependabot[bot]`
  PR, `uses: dionmaicon/packdev-agents@main`. **No `package-json-path`
  input** — packdev-agents auto-discovers which app actually changed from
  the diff itself.

## To go live

1. Push `packdev-agents` to `github.com/dionmaicon/packdev-agents` (public)
   — already done.
2. Push this repo to GitHub (private is fine).
3. Enable Dependabot (already configured via `.github/dependabot.yml` —
   GitHub picks it up automatically once pushed) and enable
   vulnerability alerts (required explicitly for private repos):
   `gh api -X PUT repos/<owner>/packdev-demo-nestjs/vulnerability-alerts`.
4. Either wait for Dependabot's daily schedule, or trigger it immediately
   per ecosystem via **Insights → Dependency graph → Dependabot → Check
   for updates**.
