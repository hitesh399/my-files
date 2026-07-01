import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { promises as fs } from "node:fs";
import federation from "@originjs/vite-plugin-federation";

const federationPlugin = federation as unknown as (options: {
  name: string;
  filename?: string;
  exposes?: Record<string, string>;
  remotes?: Record<string, string>;
  shared?: Record<string, { singleton: boolean; requiredVersion: string; version?: string }>;
}) => ReturnType<typeof react>;

const patchRemoteEntryCssPlaceholders: Plugin = {
  name: "patch-remote-entry-css-placeholders",
  async writeBundle(outputOptions, bundle) {
    if (!outputOptions.dir) {
      return;
    }

    const cssFiles = Object.values(bundle)
      .filter((item) => item.type === "asset" && item.fileName.endsWith(".css"))
      .map((item) => JSON.stringify(path.basename(item.fileName)));

    const cssArray = cssFiles.length ? `[${cssFiles.join(",")}]` : "[]";
    const remoteEntryChunk = Object.values(bundle).find(
      (item) => item.type === "chunk" && item.fileName.endsWith("remoteEntry.js"),
    );

    if (!remoteEntryChunk) {
      return;
    }

    const remoteEntryPath = path.resolve(outputOptions.dir, remoteEntryChunk.fileName);
    const code = await fs.readFile(remoteEntryPath, "utf8");
    const patchedCode = code.replace(/([`'\"])__v__css__[^`'\"]+\1/g, cssArray);

    if (patchedCode !== code) {
      await fs.writeFile(remoteEntryPath, patchedCode, "utf8");
    }
  },
};



// https://vite.dev/config/
export default defineConfig(() => {
  const themeRemoteEntry =
    process.env.VITE_THEME_REMOTE_ENTRY || "http://localhost:4174/assets/remoteEntry.js";

  return {
    plugins: [
      react(),
      federationPlugin({
        name: "auth_mfe",
        filename: "remoteEntry.js",
        exposes: {
          "./AppProviders": "./src/app/providers/AppProviders.tsx",
          "./AppRoutes": "./src/app/routes/AppRoutes.tsx",
          "./LoginPage": "./src/pages/LoginPage.tsx",
          "./ProfilePage": "./src/pages/ProfilePage.tsx",
          "./LoginUiProvider": "./src/context/LoginUiContext.tsx",
          "./authStore": "./src/store/authStore.ts",
          "./authSlice": "./src/store/slices/authSlice.ts",
        },
        remotes: {
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
      patchRemoteEntryCssPlaceholders,
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      dedupe: ["react", "react-dom", "react-router-dom", "react-redux"],
    },
    server: {
      port: 5173,
      strictPort: true,
    },
    preview: {
      port: 4173,
      strictPort: true,
    },
  };
});
