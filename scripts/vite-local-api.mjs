import accessProposal from '../api/proposals/access.js'
import getProposalAsset from '../api/proposals/asset.js'
import getProposalContent from '../api/proposals/content.js'
import logoutProposal from '../api/proposals/logout.js'
import queryProposal from '../api/proposals/query.js'
import getCalendarAvailability from '../api/calendar/availability.js'
import bookCalendarMeeting from '../api/calendar/book.js'
import chatApi from '../api/chat.js'
import {
  clearSessionCookie,
  createSessionCookie,
  hasConfiguration,
  readSession,
  verifyPassword,
} from '../api/_catalogue/security.js'

const catalogueAttempts = new Map()
const localCatalogueError =
  'We could not verify this catalogue password. Please contact the DEKODE team.'

const toLocalCookie = (cookie) => String(cookie || '').replace(/;\s*Secure/gi, '')

const fetchLikeRequest = (nodeRequest) => ({
  headers: {
    get: (name) => nodeRequest.headers[String(name).toLowerCase()] ?? null,
  },
})

async function catalogueAccessLocal(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ ok: false, error: 'Method not allowed.' })
  }
  const env = process.env
  if (!hasConfiguration(env)) {
    return response.status(503).json({ ok: false, error: 'Catalogue access is temporarily unavailable.' })
  }
  const ip = String(request.headers['cf-connecting-ip'] || request.socket?.remoteAddress || 'unknown')
  const now = Date.now()
  const current = catalogueAttempts.get(ip)
  const attempt =
    !current || now > current.resetAt
      ? { count: 1, resetAt: now + 900000 }
      : { count: current.count + 1, resetAt: current.resetAt }
  catalogueAttempts.set(ip, attempt)
  if (attempt.count > 8) {
    return response.status(429).json({ ok: false, error: localCatalogueError })
  }
  const valid = await verifyPassword(request.body?.password, env)
  if (!valid) {
    return response.status(401).json({ ok: false, error: localCatalogueError })
  }
  catalogueAttempts.delete(ip)
  response.setHeader('Set-Cookie', toLocalCookie(await createSessionCookie(env)))
  console.info('[Catalogue audit] Access granted (local)', { at: new Date().toISOString() })
  return response.status(200).json({ ok: true })
}

async function catalogueSessionLocal(request, response) {
  if (request.method !== 'GET') {
    return response.status(405).json({ ok: false, error: 'Method not allowed.' })
  }
  const authenticated = Boolean(await readSession(fetchLikeRequest(request), process.env))
  return response.status(200).json({ ok: true, authenticated })
}

async function catalogueLogoutLocal(request, response) {
  response.setHeader('Set-Cookie', toLocalCookie(clearSessionCookie()))
  return response.status(200).json({ ok: true })
}

const MAX_LOCAL_BODY_BYTES = 64_000

const handlers = new Map([
  ['/api/leads', (req, res) => res.status(200).json({ ok: true, mode: 'mock' })],
  ['/api/calendar/availability', getCalendarAvailability],
  ['/api/calendar/book', bookCalendarMeeting],
  ['/api/proposals/access', accessProposal],
  ['/api/proposals/asset', getProposalAsset],
  ['/api/proposals/content', getProposalContent],
  ['/api/proposals/logout', logoutProposal],
  ['/api/proposals/query', queryProposal],
  ['/api/chat', chatApi],
  ['/api/catalogue/access', catalogueAccessLocal],
  ['/api/catalogue/session', catalogueSessionLocal],
  ['/api/catalogue/logout', catalogueLogoutLocal],
])

const readRequestBody = async (request) => {
  if (!['POST', 'PUT', 'PATCH'].includes(request.method)) return undefined

  const chunks = []
  let size = 0
  for await (const chunk of request) {
    size += chunk.length
    if (size > MAX_LOCAL_BODY_BYTES) {
      const error = new Error('Request is too large.')
      error.statusCode = 413
      throw error
    }
    chunks.push(chunk)
  }
  if (!chunks.length) return {}

  const rawBody = Buffer.concat(chunks).toString('utf8')
  if (!(request.headers['content-type'] || '').includes('application/json')) {
    return rawBody
  }
  try {
    return JSON.parse(rawBody)
  } catch {
    const error = new Error('Invalid JSON.')
    error.statusCode = 400
    throw error
  }
}

const createResponseAdapter = (nodeResponse) => {
  const response = {
    setHeader(name, value) {
      nodeResponse.setHeader(name, value)
      return response
    },
    status(statusCode) {
      nodeResponse.statusCode = statusCode
      return response
    },
    json(body) {
      if (!nodeResponse.hasHeader('Content-Type')) {
        nodeResponse.setHeader('Content-Type', 'application/json; charset=utf-8')
      }
      nodeResponse.end(JSON.stringify(body))
      return response
    },
    send(body) {
      nodeResponse.end(body)
      return response
    },
    end(body) {
      nodeResponse.end(body)
      return response
    },
  }
  return response
}

export function localApiPlugin() {
  return {
    name: 'dekode-local-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const pathname = new URL(request.url, 'http://localhost').pathname
        const handler = handlers.get(pathname)
        if (!handler) {
          next()
          return
        }

        try {
          request.body = await readRequestBody(request)
          await handler(request, createResponseAdapter(response))
        } catch (error) {
          server.ssrFixStacktrace(error)
          if (response.headersSent) {
            response.end()
            return
          }
          response.statusCode = error.statusCode || 500
          response.setHeader('Content-Type', 'application/json; charset=utf-8')
          response.setHeader('Cache-Control', 'private, no-store, max-age=0')
          response.end(JSON.stringify({
            ok: false,
            error:
              error.statusCode && error.statusCode < 500
                ? error.message
                : 'The local API could not process this request.',
          }))
        }
      })
    },
  }
}
