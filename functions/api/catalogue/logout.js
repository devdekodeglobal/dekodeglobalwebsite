import { clearSessionCookie, json } from '../_catalogue/security.js'

export function onRequestPost() {
  return json({ ok: true }, 200, { 'Set-Cookie': clearSessionCookie() })
}

export function onRequest() {
  return json({ ok: false, error: 'Method not allowed.' }, 405, { Allow: 'POST' })
}
