import {
  createSessionCookie,
  hasConfiguration,
  json,
  verifyPassword,
} from '../_catalogue/security.js'

const attempts = new Map()
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000
const MAX_ATTEMPTS = 8
const genericAccessError =
  'We could not verify this password. Please check it or contact the DEKODE team.'

function canAttempt(request) {
  const ip = String(request.headers.get('cf-connecting-ip') || 'unknown')
  const now = Date.now()
  const current = attempts.get(ip)
  if (!current || now > current.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + ATTEMPT_WINDOW_MS })
    return true
  }
  current.count += 1
  return current.count <= MAX_ATTEMPTS
}

export async function onRequestPost({ request, env }) {
  if (!hasConfiguration(env)) {
    return json({ ok: false, error: 'Catalogue access is temporarily unavailable.' }, 503)
  }
  if (!canAttempt(request)) return json({ ok: false, error: genericAccessError }, 429)

  let body
  try {
    body = await request.json()
  } catch {
    return json({ ok: false, error: genericAccessError }, 400)
  }

  if (!(await verifyPassword(body?.password, env))) {
    return json({ ok: false, error: genericAccessError }, 401)
  }

  return json(
    { ok: true },
    200,
    { 'Set-Cookie': await createSessionCookie(env) },
  )
}

export function onRequest() {
  return json({ ok: false, error: 'Method not allowed.' }, 405, { Allow: 'POST' })
}
