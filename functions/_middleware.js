import {
  isCatalogueAsset,
  json,
  privateHeaders,
  readSession,
} from './api/_catalogue/security.js'

export async function onRequest(context) {
  const pathname = new URL(context.request.url).pathname
  if (!isCatalogueAsset(pathname)) return context.next()

  if (!(await readSession(context.request, context.env))) {
    return json({ ok: false, error: 'Catalogue access is required.' }, 401)
  }

  const response = await context.next()
  const headers = new Headers(response.headers)
  for (const [name, value] of Object.entries(privateHeaders)) headers.set(name, value)
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}
