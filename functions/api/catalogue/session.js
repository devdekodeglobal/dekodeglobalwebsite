import { json, readSession } from '../_catalogue/security.js'

export async function onRequestGet({ request, env }) {
  return json({ ok: true, authenticated: Boolean(await readSession(request, env)) })
}

export function onRequest() {
  return json({ ok: false, error: 'Method not allowed.' }, 405, { Allow: 'GET' })
}
