import type { CapacitorConfig } from "@capacitor/cli";

// L'app Next.js utilise des Server Actions et une base de données — pas de
// export statique possible. Capacitor charge donc directement l'URL du site
// déployé dans un conteneur natif (WebView plein écran, sans barre Chrome),
// plutôt que d'embarquer des fichiers statiques locaux.
//
const config: CapacitorConfig = {
  appId: "com.zhongwenmaster.app",
  appName: "Zhongwen Master",
  webDir: "public", // requis par Capacitor même en mode server.url, non utilisé pour le contenu
  server: {
    url: "https://zhongwen-master.vercel.app",
    cleartext: false,
  },
};

export default config;
