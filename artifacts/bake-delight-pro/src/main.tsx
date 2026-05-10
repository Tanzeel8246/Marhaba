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

// Register service worker for offline admin support
serviceWorkerRegistration.register();
