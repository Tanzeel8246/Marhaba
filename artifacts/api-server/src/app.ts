import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP if it interferes with certain frontend features, or configure it properly
}));

const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : true;

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
          responseTime: res.responseTime,
        };
      },
    },
  }),
);
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

import path from "path";

app.use("/api", router);

// Serve frontend static files in production
if (process.env.NODE_ENV === "production") {
  // Assuming the frontend build output is in artifacts/bake-delight-pro/dist
  // and the server runs from artifacts/api-server
  const frontendPath = path.join(__dirname, "..", "..", "bake-delight-pro", "dist", "public");
  app.use(express.static(frontendPath));

  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

export default app;
