const PASSWORD_SALT = new TextEncoder().encode('dekode-clinics-catalogue-v1')
const SESSION_TTL_SECONDS = 60 * 60 * 2
const COOKIE_NAME = 'dekode_catalogue_session'
const RESOURCE_ID = 'clinics-on-cloud-catalogue'
const RESOURCE_VERSION = '1.0.0'

const encoder = new TextEncoder()
const decoder = new TextDecoder()

const toHex = (bytes) =>
  Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, '0')).join('')

const base64UrlEncode = (value) => {
  const bytes = encoder.encode(value)
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

const base64UrlDecode = (value) => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
  const binary = atob(padded)
  return decoder.decode(Uint8Array.from(binary, (character) => character.charCodeAt(0)))
}

const safeEqual = (left, right) => {
  const a = encoder.encode(String(left))
  const b = encoder.encode(String(right))
  if (a.length !== b.length) return false
  let difference = 0
  for (let index = 0; index < a.length; index += 1) difference |= a[index] ^ b[index]
  return difference === 0
}

const signingSecret = (env) => env.CATALOGUE_SESSION_SECRET || env.PROPOSAL_SESSION_SECRET

async function hmac(value, secret) {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(value))
  return base64UrlEncode(String.fromCharCode(...new Uint8Array(signature)))
}

export async function passwordHash(password) {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(String(password || '')),
    'PBKDF2',
    false,
    ['deriveBits'],
  )
  const derived = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: PASSWORD_SALT, iterations: 100_000 },
    keyMaterial,
    256,
  )
  return toHex(derived)
}

export function hasConfiguration(env) {
  return Boolean(env.CATALOGUE_PASSWORD_HASH && signingSecret(env))
}

export async function verifyPassword(password, env) {
  if (!hasConfiguration(env)) return false
  return safeEqual(await passwordHash(password), env.CATALOGUE_PASSWORD_HASH)
}

export async function createSessionCookie(env) {
  const now = Math.floor(Date.now() / 1000)
  const payload = base64UrlEncode(
    JSON.stringify({
      resource: RESOURCE_ID,
      version: RESOURCE_VERSION,
      issuedAt: now,
      expiresAt: now + SESSION_TTL_SECONDS,
      nonce: crypto.randomUUID(),
    }),
  )
  const signature = await hmac(payload, signingSecret(env))
  return `${COOKIE_NAME}=${payload}.${signature}; Path=/; HttpOnly; SameSite=Strict; Secure; Max-Age=${SESSION_TTL_SECONDS}`
}

export function clearSessionCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Secure; Max-Age=0`
}

export async function readSession(request, env) {
  if (!signingSecret(env)) return null
  const cookies = String(request.headers.get('cookie') || '')
    .split(';')
    .map((value) => value.trim())
  const cookie = cookies.find((value) => value.startsWith(`${COOKIE_NAME}=`))
  if (!cookie) return null
  const [payload, signature] = cookie.slice(COOKIE_NAME.length + 1).split('.')
  if (!payload || !signature) return null
  if (!safeEqual(signature, await hmac(payload, signingSecret(env)))) return null
  try {
    const decoded = JSON.parse(base64UrlDecode(payload))
    if (decoded.resource !== RESOURCE_ID || decoded.version !== RESOURCE_VERSION) return null
    if (decoded.expiresAt < Math.floor(Date.now() / 1000)) return null
    return decoded
  } catch {
    return null
  }
}

export const privateHeaders = {
  'Cache-Control': 'private, no-store, max-age=0',
  Pragma: 'no-cache',
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
}

export function json(payload, status = 200, headers = {}) {
  return Response.json(payload, {
    status,
    headers: { ...privateHeaders, ...headers },
  })
}

export function isCatalogueAsset(pathname) {
  return (
    /^\/clinics-on-cloud\/catalogue\/page-\d+\.jpg$/i.test(pathname) ||
    pathname === '/clinics-on-cloud/clinics-on-cloud-catalogue.pdf'
  )
}
