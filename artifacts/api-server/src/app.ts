import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import router from "./routes";
import ogImageRouter from "./routes/og-image";
import { logger } from "./lib/logger";
import { globalLimiter } from "./lib/limiters";

const app: Express = express();

const isProd = process.env.NODE_ENV === "production";

const allowedOrigins = isProd
  ? [
      "https://bridgepathafricahr.com",
      "https://www.bridgepathafricahr.com",
    ]
  : true;

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }),
);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

app.use(globalLimiter);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.use("/og-image", ogImageRouter);
app.use("/api", router);

export default app;
