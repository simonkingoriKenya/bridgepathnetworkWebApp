import { Router } from "express";
import path from "path";
import sharp from "sharp";

const router = Router();

const OG_W = 1200;
const OG_H = 630;

const CREAM = "#FEF9F4";
const TERRACOTTA = "#C04020";
const MARIGOLD = "#F0A010";
const INK = "#1E1511";

function buildOverlay(): Buffer {
  const svg = `<svg width="${OG_W}" height="${OG_H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="heroGrad" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%"   stop-color="${INK}" stop-opacity="0.96"/>
        <stop offset="30%"  stop-color="${INK}" stop-opacity="0.72"/>
        <stop offset="58%"  stop-color="${INK}" stop-opacity="0.32"/>
        <stop offset="100%" stop-color="${INK}" stop-opacity="0.08"/>
      </linearGradient>
      <linearGradient id="leftGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%"  stop-color="${INK}" stop-opacity="0.55"/>
        <stop offset="55%" stop-color="${INK}" stop-opacity="0"/>
      </linearGradient>
    </defs>

    <!-- Cinematic overlays -->
    <rect width="${OG_W}" height="${OG_H}" fill="url(#heroGrad)"/>
    <rect width="${OG_W}" height="${OG_H}" fill="url(#leftGrad)"/>

    <!-- ── TOP-LEFT: brand chip ── -->
    <rect x="52" y="48" rx="10" ry="10" width="190" height="44" fill="${TERRACOTTA}"/>
    <text
      x="147" y="76"
      font-family="Arial Black, Arial, Helvetica, sans-serif"
      font-size="19" font-weight="900"
      fill="${CREAM}" text-anchor="middle" letter-spacing="0.4">
      Bridgepath Africa
    </text>

    <!-- ── BOTTOM-LEFT: headline block ── -->
    <!-- Eyebrow -->
    <text
      x="52" y="${OG_H - 190}"
      font-family="Arial, Helvetica, sans-serif"
      font-size="13" font-weight="700"
      fill="${MARIGOLD}" letter-spacing="3.5">
      AFRICA&apos;S PREMIER HR PLATFORM
    </text>

    <!-- Accent bars -->
    <rect x="52"  y="${OG_H - 172}" width="52" height="4" rx="2" fill="${TERRACOTTA}"/>
    <rect x="112" y="${OG_H - 172}" width="18" height="4" rx="2" fill="${MARIGOLD}"/>

    <!-- H1 line 1 – cream -->
    <text
      x="52" y="${OG_H - 114}"
      font-family="Arial Black, Arial, Helvetica, sans-serif"
      font-size="72" font-weight="900"
      fill="${CREAM}">
      Hire Africa.
    </text>

    <!-- H1 line 2 – terracotta -->
    <text
      x="52" y="${OG_H - 40}"
      font-family="Arial Black, Arial, Helvetica, sans-serif"
      font-size="72" font-weight="900"
      fill="${TERRACOTTA}">
      Build the Future.
    </text>

    <!-- ── BOTTOM-RIGHT: tagline + domain ── -->
    <text
      x="${OG_W - 52}" y="${OG_H - 110}"
      font-family="Arial, Helvetica, sans-serif"
      font-size="17" fill="${CREAM}" fill-opacity="0.82"
      text-anchor="end">
      Connecting African talent
    </text>
    <text
      x="${OG_W - 52}" y="${OG_H - 84}"
      font-family="Arial, Helvetica, sans-serif"
      font-size="17" fill="${CREAM}" fill-opacity="0.82"
      text-anchor="end">
      with global employers.
    </text>
    <text
      x="${OG_W - 52}" y="${OG_H - 48}"
      font-family="Arial, Helvetica, sans-serif"
      font-size="14" fill="${MARIGOLD}" fill-opacity="0.95"
      text-anchor="end" letter-spacing="0.6">
      bridgepathafricahr.com
    </text>

    <!-- ── BOTTOM-LEFT: country pills ── -->
    <rect x="52"  y="${OG_H - 28}" width="84" height="22" rx="11" fill="${MARIGOLD}" fill-opacity="0.18"/>
    <text x="94"  y="${OG_H - 12}"
      font-family="Arial, Helvetica, sans-serif" font-size="12"
      fill="${MARIGOLD}" text-anchor="middle">Ghana Active</text>

    <rect x="144" y="${OG_H - 28}" width="112" height="22" rx="11" fill="${CREAM}" fill-opacity="0.12"/>
    <text x="200" y="${OG_H - 12}"
      font-family="Arial, Helvetica, sans-serif" font-size="12"
      fill="${CREAM}" fill-opacity="0.80" text-anchor="middle">Kenya Coming Soon</text>
  </svg>`;

  return Buffer.from(svg);
}

let cachedBuffer: Buffer | null = null;
let cacheTime = 0;
const CACHE_TTL_MS = 60_000;

router.get("/", async (_req, res) => {
  try {
    const now = Date.now();

    if (!cachedBuffer || now - cacheTime > CACHE_TTL_MS) {
      const heroPath = path.resolve(
        process.cwd(),
        "../bridgepath/public/photos/ghana-team-hero.png",
      );

      cachedBuffer = await sharp(heroPath)
        .resize(OG_W, OG_H, { fit: "cover", position: "centre" })
        .composite([{ input: buildOverlay(), top: 0, left: 0 }])
        .jpeg({ quality: 92, mozjpeg: true })
        .toBuffer();

      cacheTime = now;
    }

    res.setHeader("Content-Type", "image/jpeg");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Vary", "*");
    res.setHeader("Content-Length", cachedBuffer.length);
    res.send(cachedBuffer);
  } catch (err) {
    res.status(500).send("Failed to generate OG image");
  }
});

export default router;
