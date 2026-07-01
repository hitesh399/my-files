import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { promises as fs } from 'node:fs'
import federation from '@originjs/vite-plugin-federation'

const federationPlugin = federation as unknown as (options: {
  name: string
  filename: string
  exposes: Record<string, string>
  shared: Record<string, { singleton: boolean; requiredVersion: string; version?: string }>
}) => Plugin

const patchRemoteEntryCssPlaceholders: Plugin = {
  name: 'patch-remote-entry-css-placeholders',
  async writeBundle(outputOptions, bundle) {
    if (!outputOptions.dir) {
      return
    }

    const cssFiles = Object.values(bundle)
      .filter((item) => item.type === 'asset' && item.fileName.endsWith('.css'))
      .map((item) => JSON.stringify(path.basename(item.fileName)))

    const cssArray = cssFiles.length ? `[${cssFiles.join(',')}]` : '[]'
    const remoteEntryChunk = Object.values(bundle).find(
      (item) => item.type === 'chunk' && item.fileName.endsWith('remoteEntry.js'),
    )

    if (!remoteEntryChunk) {
      return
    }

    const remoteEntryPath = path.resolve(outputOptions.dir, remoteEntryChunk.fileName)
    const code = await fs.readFile(remoteEntryPath, 'utf8')
    const patchedCode = code.replace(/([`'\"])__v__css__[^`'\"]+\1/g, cssArray)

    if (patchedCode !== code) {
      await fs.writeFile(remoteEntryPath, patchedCode, 'utf8')
    }
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federationPlugin({
      name: 'theme_mfe',
      filename: 'remoteEntry.js',
      exposes: {
        './themeRuntime': './src/themeManager.ts',
        './ThemeProvider': './src/ThemeProvider.tsx',
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: '^19.2.7',
          version: '19.2.7',
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '^19.2.7',
          version: '19.2.7',
        },
      },
    }),
    patchRemoteEntryCssPlaceholders,
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: ['react', 'react-dom'],
  },
  build: {
    target: 'esnext',
  },
  server: {
    port: 5174,
    strictPort: true,
  },
  preview: {
    port: 4174,
    strictPort: true,
  },
})
