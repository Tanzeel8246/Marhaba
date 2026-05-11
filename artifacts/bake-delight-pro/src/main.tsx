import { createRoot } from "react-dom/client";
import App from "./App";
import { LanguageProvider } from "./lib/i18n/LanguageContext";
import "./index.css";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

createRoot(document.getElementById("root")!).render(
  <LanguageProvider>
    <App />
  </LanguageProvider>
);

// Unregister service worker to fix mobile loading and stale cache issues
serviceWorkerRegistration.unregister();
