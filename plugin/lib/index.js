/**
 * cloud-smoke-widget bundle, Host half.
 *
 * Serves the widget's synthesized sound assets (assets/sounds/*.wav) to the
 * browser client through exact webServer routes under
 * /plugins/dsh-client-cloud-smoke-widget/assets/sounds/. All sounds are read
 * into memory once at apply time (a few hundred KB total), served with
 * ETag/304 and GET/HEAD support.
 */
import { readFileSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const PACKAGE_ID = 'dsh-client-cloud-smoke-widget'
const SOUND_PREFIX = `/plugins/${PACKAGE_ID}/assets/sounds/`
const SOUND_FILES = ['light.wav', 'burn-loop.wav', 'inhale.wav', 'ash.wav', 'exhale.wav', 'switch.wav']
const VERSION_URL = 'https://raw.githubusercontent.com/shuigege2025-dev/cloud-smoke-widget/main/plugin/package.json'

function send(res, status, headers = {}) {
  res.writeHead(status, { 'X-Content-Type-Options': 'nosniff', ...headers })
  res.end()
}

export const inject = ['webServer']

export function apply(ctx) {
  const store = new Map()
  for (const name of SOUND_FILES) {
    try {
      const path = fileURLToPath(new URL(`../assets/sounds/${name}`, import.meta.url))
      const info = statSync(path)
      if (!info.isFile()) continue
      const data = readFileSync(path)
      const etag = `W/"${info.size.toString(16)}-${Math.trunc(info.mtimeMs).toString(16)}"`
      store.set(SOUND_PREFIX + name, { data, type: 'audio/wav', size: info.size, etag })
    } catch {
      // A missing sound simply 404s on request.
    }
  }

  ctx.effect(() => {
    const unregister = []
    unregister.push(ctx.webServer.register({
      kind: 'exact',
      path: `/plugins/${PACKAGE_ID}/latest-version`,
      handler: async (req, res) => {
        const method = req.method ?? 'GET'
        if (method !== 'GET' && method !== 'HEAD') {
          send(res, 405, { Allow: 'GET, HEAD' })
          return
        }
        try {
          const controller = typeof AbortSignal !== 'undefined' && AbortSignal.timeout ? AbortSignal.timeout(8000) : undefined
          const response = await fetch(VERSION_URL, { cache: 'no-store', signal: controller })
          if (!response.ok) {
            send(res, 502)
            return
          }
          const text = await response.text()
          if (method === 'HEAD') {
            send(res, 200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' })
            return
          }
          res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' })
          res.end(text)
        } catch (err) {
          send(res, 502)
        }
      }
    }))
    for (const [path, asset] of store) {
      unregister.push(ctx.webServer.register({
        kind: 'exact',
        path,
        handler: (req, res) => {
          const method = req.method ?? 'GET'
          if (method !== 'GET' && method !== 'HEAD') {
            send(res, 405, { Allow: 'GET, HEAD' })
            return
          }
          if (req.headers['if-none-match'] === asset.etag) {
            send(res, 304, { ETag: asset.etag })
            return
          }
          const headers = {
            'Cache-Control': 'private, max-age=3600',
            'Content-Length': String(asset.size),
            'Content-Type': asset.type,
            ETag: asset.etag
          }
          if (method === 'HEAD') {
            send(res, 200, headers)
            return
          }
          res.writeHead(200, { 'X-Content-Type-Options': 'nosniff', ...headers })
          res.end(asset.data)
        }
      }))
    }
    return () => {
      for (const dispose of unregister) dispose()
    }
  }, `${PACKAGE_ID}: sound asset routes`)
}
