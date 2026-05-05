#!/bin/bash
set -e
pnpm install --frozen-lockfile
pnpm exec tsc -p lib/db/tsconfig.json
pnpm exec tsc -p lib/api-zod/tsconfig.json
pnpm --filter @workspace/db run push
