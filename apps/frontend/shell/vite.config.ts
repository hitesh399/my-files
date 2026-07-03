import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

const federationPlugin = federation as unknown as (options: {
  name: string;
  remotes?: Record<string, string>;
  shared?: Record<
    string,
    { singleton: boolean; requiredVersion: string; version?: string }
  >;
}) => ReturnType<typeof react>;

// https://vite.dev/config/
export default defineConfig(() => {
  const authRemoteEntry =
    process.env.VITE_AUTH_REMOTE_ENTRY ||
    "http://localhost:8080/auth/assets/remoteEntry.js";
  const themeRemoteEntry = "http://localhost:8080/theme/assets/remoteEntry.js";

  return {
    plugins: [
      react(),
      federationPlugin({
        name: "shell_mfe",
        remotes: {
          auth_mfe: authRemoteEntry,
          theme_mfe: themeRemoteEntry,
        },
        shared: {
          react: {
            singleton: true,
            requiredVersion: "^19.2.7",
            version: "19.2.7",
          },
          "react-dom": {
            singleton: true,
            requiredVersion: "^19.2.7",
            version: "19.2.7",
          },
          "react-router-dom": {
            singleton: true,
            requiredVersion: "^7.18.1",
            version: "7.18.1",
          },
          "react-redux": {
            singleton: true,
            requiredVersion: "^9.3.0",
            version: "9.3.0",
          },
        },
      }),
    ],
    resolve: {
      dedupe: ["react", "react-dom", "react-router-dom", "react-redux"],
    },
    server: {
      port: 5175,
      strictPort: true,
    },
    preview: {
      port: 4175,
      strictPort: true,
    },
  };
});
