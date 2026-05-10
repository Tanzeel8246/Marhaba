import app from "./app";
import { logger } from "./lib/logger";
import https from "https";
import http from "http";
import fs from "fs";

const port = process.env["PORT"] ? Number(process.env["PORT"]) : 5000;
const host = process.env["HOST"] || "0.0.0.0";

const sslKeyPath = process.env["SSL_KEY_PATH"];
const sslCertPath = process.env["SSL_CERT_PATH"];

let server;

if (sslKeyPath && sslCertPath) {
  try {
    const privateKey = fs.readFileSync(sslKeyPath, "utf8");
    const certificate = fs.readFileSync(sslCertPath, "utf8");
    const credentials = { key: privateKey, cert: certificate };
    server = https.createServer(credentials, app);
    logger.info("SSL Certificates loaded successfully. Starting HTTPS server...");
  } catch (err) {
    logger.error({ err }, "Failed to load SSL certificates. Falling back to HTTP...");
    server = http.createServer(app);
  }
} else {
  server = http.createServer(app);
}

server.listen(port, host, () => {
  logger.info({ port, host, protocol: server instanceof https.Server ? 'https' : 'http' }, "Server listening");
});
