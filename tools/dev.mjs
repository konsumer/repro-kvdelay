// this is the dev-server, which could use local KV and remote DO

import { Miniflare } from 'miniflare'
import fetch from 'cross-fetch'
import chokidar from 'chokidar'
import { CrossKV } from 'cross-cf'

global.fetch = fetch

// you can add local KV & remote DO here with cross-cf or any other globals you like
const globals = {
  POKEMON: new CrossKV('POKEMON')
}

let mf
async function startDevServer () {
  mf = new Miniflare({
    envPath: true,
    packagePath: true,
    wranglerConfigPath: false,
    globals,
    name: 'splitcube',
    sourceMap: true,
    modules: true,
    scriptPath: 'dist/worker.mjs',
    buildCommand: 'npm run build:backend',
    sitePath: './public',
    port: 8787
  })
  await mf.startServer()
}

// watch on miniflare wasn't working, so I made my own
async function main () {
  const watcher = chokidar.watch('src/server/**/*')

  watcher.on('change', async path => {
    console.log(`File changed: ${path}`)
    await mf.reload()
  })

  await startDevServer()
  console.log('hit backend directly at http://localhost:8787/api')
}
main()
