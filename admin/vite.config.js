import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import eslint from 'vite-plugin-eslint'
import { createHtmlPlugin } from 'vite-plugin-html'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  return {
    define: {
      'process.env': {},
    },
    server: {
      host: '0.0.0.0',
      port: 4500,
    },
    envDir: './env',
    publicDir: 'public',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@core': path.resolve(__dirname, './src/packages/core'),
      },
    },
    optimizeDeps: {
      include: ['react-quill-new'],
    },
    plugins: [
      react(),
      eslint({
        fix: true,
        failOnError: false,
        failOnWarning: false
      }),
      createHtmlPlugin({
        inject: {
          data: {
            injectMainScript: '<script type="module" src="./src/main.jsx"></script>',
          },
        },
        minify: true,
      }),
    ],
    build: {
      sourcemap: mode !== 'production',
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
          },
        },
        onwarn(warning, warn) {
          if (
            warning.code === 'MODULE_LEVEL_DIRECTIVE' &&
            warning.message.includes(`"use client"`)
          ) {
            return
          }
          warn(warning)
        },
      },
    },
  }
})
