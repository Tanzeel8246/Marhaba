import { createRoot } from "react-dom/client";
import App from "./App";
import { LanguageProvider } from "./lib/i18n/LanguageContext";
import "./index.css";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { setBaseUrl } from "@workspace/api-client-react";

// Set the base URL for API requests to point to the live Render backend
setBaseUrl("https://marhaba-27w3.onrender.com");

createRoot(document.getElementById("root")!).render(
  <LanguageProvider>
    <App />
  </LanguageProvider>
);

// Unregister service worker to fix mobile loading and stale cache issues
serviceWorkerRegistration.unregister();
