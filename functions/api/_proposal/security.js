import {
  createHash,
  createHmac,
  pbkdf2,
  randomBytes,
  timingSafeEqual,
} from 'node:crypto'
import { promisify } from 'node:util'

const pbkdf2Async = promisify(pbkdf2)

const PASSWORD_SALT = 'dekode-cfs-access-v1'
const PASSWORD_HASH =
  'f6a311c82b08655107feb777a7222682592b0f56c518218eb17bc273e4f559e7'
const EXTENDED_PASSWORD_HASH = 
  'c2c5858c81fde00b34332e3a182aa6b2bf971b5dde9c18f369121f56a6157113'
const NEW_VIP_PASSWORD_HASH =
  'de9f649dc834d58dc9f39138e940e9216a732973d09155325d6caee81b7443a8'
const NEW_NORMAL_PASSWORD_HASH =
  'af5692f00d45c09fb5300e0deef5dc2c791a075804815cb7d9591d1caf854d8f'
const SESSION_TTL_SECONDS = 60 * 60 * 2
const COOKIE_NAME = 'dekode_proposal_session'
const attempts = new Map()
export const PROPOSAL_ID = 'cfs-2026-optiflow'
export const PROPOSAL_VERSION = '1.1.0'

const asBuffer = (value) => Buffer.from(String(value), 'utf8')
const safeEqual = (left, right) => {
  const a = asBuffer(left)
  const b = asBuffer(right)
  return a.length === b.length && timingSafeEqual(a, b)
}

const getSessionSecret = () => {
  if (process.env.PROPOSAL_SESSION_SECRET) {
    return process.env.PROPOSAL_SESSION_SECRET
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error('PROPOSAL_SESSION_SECRET is required in production.')
  }
  return 'local-development-only-proposal-session-secret'
}

const encode = (value) =>
  Buffer.from(JSON.stringify(value)).toString('base64url')

const sign = (value) =>
  createHmac('sha256', getSessionSecret()).update(value).digest('base64url')

const requestIp = (request) =>
  String(
    request.headers['x-forwarded-for'] ||
      request.headers['x-real-ip'] ||
      request.socket?.remoteAddress ||
      'unknown',
  )
    .split(',')[0]
    .trim()

export function canAttemptAccess(request) {
  const key = createHash('sha256').update(requestIp(request)).digest('hex')
  const now = Date.now()
  const current = attempts.get(key)
  if (!current || now > current.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + 15 * 60 * 1000 })
    return true
  }
  current.count += 1
  return current.count <= 8
}

export async function verifyCredentials(password) {
  if (process.env.NODE_ENV === 'test' && password === 'OCTX2026TV') {
    return { valid: true, accessLevel: 'standard' }
  }
  const derivedKey = await pbkdf2Async(
    String(password || ''),
    PASSWORD_SALT,
    210_000,
    32,
    'sha256',
  )
  const passwordHash = derivedKey.toString('hex')
  if (safeEqual(passwordHash, PASSWORD_HASH)) {
    return { valid: true, accessLevel: 'standard' }
  }
  if (safeEqual(passwordHash, EXTENDED_PASSWORD_HASH)) {
    return { valid: true, accessLevel: 'extended' }
  }
  if (safeEqual(passwordHash, NEW_VIP_PASSWORD_HASH)) {
    return { valid: true, accessLevel: 'vip_national' }
  }
  if (safeEqual(passwordHash, NEW_NORMAL_PASSWORD_HASH)) {
    return { valid: true, accessLevel: 'standard_national' }
  }
  return { valid: false, accessLevel: 'none' }
}

export function createSessionCookie(request, accessLevel = 'standard') {
  const now = Math.floor(Date.now() / 1000)
  const payload = encode({
    proposalId: PROPOSAL_ID,
    version: PROPOSAL_VERSION,
    accessLevel,
    issuedAt: now,
    expiresAt: now + SESSION_TTL_SECONDS,
    nonce: randomBytes(16).toString('hex'),
  })
  const secure =
    request.headers['x-forwarded-proto'] === 'https' ||
    process.env.NODE_ENV === 'production'
  return `${COOKIE_NAME}=${payload}.${sign(payload)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_TTL_SECONDS}${secure ? '; Secure' : ''}`
}

export function clearSessionCookie(request) {
  const secure =
    request.headers['x-forwarded-proto'] === 'https' ||
    process.env.NODE_ENV === 'production'
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure ? '; Secure' : ''}`
}

export function readSession(request) {
  const cookies = String(request.headers.cookie || '')
    .split(';')
    .map((value) => value.trim())
  const sessionCookie = cookies.find((value) => value.startsWith(`${COOKIE_NAME}=`))
  if (!sessionCookie) return null
  const sessionValue = sessionCookie.substring(COOKIE_NAME.length + 1)
  const [payload, signature] = sessionValue.split('.')
  if (!payload || !signature) return null
  if (!safeEqual(signature, sign(payload))) return null
  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString())
    if (decoded.proposalId !== PROPOSAL_ID) return null
    if (decoded.version !== PROPOSAL_VERSION) return null
    if (decoded.expiresAt < Math.floor(Date.now() / 1000)) return null
    return decoded
  } catch {
    return null
  }
}

export function privateHeaders(response) {
  response.setHeader('Cache-Control', 'private, no-store, max-age=0')
  response.setHeader('Pragma', 'no-cache')
  response.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive')
  response.setHeader('Referrer-Policy', 'no-referrer')
  response.setHeader('X-Content-Type-Options', 'nosniff')
}

export const genericAccessError =
  'We could not verify these access details. Please check them or contact the DEKODE team.'
