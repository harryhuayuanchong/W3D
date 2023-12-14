import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Polyfill
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: 'jsx',
  },
  resolve: {
    extension: ['.mjs', '.js', '.ts', '.jsx', 'tsx', '.json'],
    alias: {
      // To handle Module "buffer" has been externalized for browser compatibility. Cannot access "buffer.Buffer" in client code issue
      process: 'process/browser',
      buffer: 'buffer',
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
  },
  server: {
    watch: {
      usePolling: true,
    },
  },
})
