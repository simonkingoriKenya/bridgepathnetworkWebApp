import { Router } from "express";
import path from "path";
import fs from "fs";

const router = Router();

router.get("/", (_req, res) => {
  const imagePath = path.resolve(process.cwd(), "../bridgepath/public/opengraph.jpg");

  if (!fs.existsSync(imagePath)) {
    res.status(404).send("OG image not found");
    return;
  }

  res.setHeader("Content-Type", "image/jpeg");
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Vary", "*");

  res.sendFile(imagePath);
});

export default router;
