// this will build the backend

import { build } from 'esbuild'
import { nodeBuiltIns } from 'esbuild-node-builtins'

// env that is passed at build-time to worker
const env = {
  NODE_ENV: process.env.NODE_ENV || 'development'
}

build({
  format: 'esm',

  entryPoints: ['src/server/worker.mjs'],

  plugins: [
    nodeBuiltIns()
  ],

  outfile: 'dist/worker.mjs',
  bundle: true,

  define: {
    process: JSON.stringify({ env })
  },

  loader: {
    '.html': 'text',
    '.gql': 'text'
  },

  external: [
    '__STATIC_CONTENT_MANIFEST'
  ]
})
