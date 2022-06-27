// this worker handles graphql and works out requests to static asssets on cloudflare

/* global Response */

import { getAssetFromKV, serveSinglePageApp } from '@cloudflare/kv-asset-handler'
import manifestJSON from '__STATIC_CONTENT_MANIFEST'

import { getClient } from './schema.mjs'
import playground from './playground.html'

const assetManifest = JSON.parse(manifestJSON)

// preload a graphql client (so we can hit or own graphql)
function getGraphql (env, request) {
  const g = !env.POKEMON
    ? {
        POKEMON: globalThis.POKEMON
      }
    : {}
  return getClient({ ...g, ...env, request })
}

export default {
  async fetch (request, env, ctx) {
    try {
      const requestUrl = new URL(request.url)

      if (requestUrl.pathname === '/api') {
        if (request.method === 'GET') {
          return new Response(playground, { headers: { 'content-type': 'html' } })
        }
        if (request.headers.get('content-type') === 'application/json') {
          const q = await getGraphql(env, request)
          const { query, variables } = await request.json()
          const r = await q(query, variables)
          return new Response(JSON.stringify(r), {
            headers: {
              'content-type': 'application/json'
            }
          })
        }
        return new Response('You should be requesting with content-type: application/json', { status: 400 })
      }
    } catch (e) {
      console.error('Error: ' + e.message, e)
      return new Response('Error', { status: 500 })
    }

    // fallback to static asset
    const waitUntil = promise => ctx.waitUntil(promise)
    const options = {
      ASSET_NAMESPACE: env.__STATIC_CONTENT,
      ASSET_MANIFEST: assetManifest
    }

    try {
      const page = await getAssetFromKV({ request, waitUntil }, options)
      return new Response(page.body, page)
    } catch (e) {
      try {
        return getAssetFromKV({ request, waitUntil }, { ...options, mapRequestToAsset: serveSinglePageApp })
      } catch (e) {}

      return new Response('ERROR: ' + e.message || e.toString(), { status: 500 })
    }
  }
}
