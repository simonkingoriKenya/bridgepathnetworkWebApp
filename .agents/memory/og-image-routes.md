---
name: OG image routes
description: Dynamic per-page OG image generation for job detail and service detail pages.
---

## Routes
- `GET /og-image/job/:id` — reads job from DB, renders branded JPEG (1200×630) with job title, company, location. Background: boardroom-deal.png.
- `GET /og-image/service/:slug` — maps slug to service name/tagline, renders branded JPEG. Background: hr-leader-woman.png.

## Frontend wiring
- `jobs/[id].tsx`: passes `https://bridgepathafricahr.com/og-image/job/${jobId}` as `image` prop to PageSEO (only for real DB jobs, jobId < 100).
- `services/[slug].tsx`: passes `https://bridgepathafricahr.com/og-image/service/${slug}` to PageSEO.

**Why:** Social media share previews were all showing the generic home OG image regardless of which job/service was being shared.
