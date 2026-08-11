import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { privateHeaders, readSession } from '../_proposal/security.js'

const prototypeAssetPath = resolve(
  fileURLToPath(new URL('..', import.meta.url)),
  '_proposal/source/image.png',
)
const architectureAssetPath = resolve(
  fileURLToPath(new URL('..', import.meta.url)),
  '_proposal/source/arch.png',
)
const businessPlanAssetPath = resolve(
  fileURLToPath(new URL('..', import.meta.url)),
  '_proposal/source/CFS_Business_Impact_Presentation.pdf',
)
const commercialTermsAssetPath = resolve(
  fileURLToPath(new URL('..', import.meta.url)),
  '_proposal/source/CFS_OptiFlow_Payback_Commercial_Terms.pdf',
)

export default async function handler(request, response) {
  privateHeaders(response)
  if (request.method !== 'GET') return response.status(405).end()
  const session = readSession(request)
  if (!session) return response.status(401).end()
  
  const requestedAsset = request.query?.asset ||
    new URL(request.url || '/', 'http://localhost').searchParams.get('asset')
    
  if (requestedAsset === 'business_plan') {
    if (session.accessLevel !== 'extended') return response.status(403).end()
    response.setHeader('Content-Type', 'application/pdf')
    return response.status(200).send(await readFile(businessPlanAssetPath))
  }

  if (requestedAsset === 'commercial_terms') {
    if (session.accessLevel !== 'extended') return response.status(403).end()
    response.setHeader('Content-Type', 'application/pdf')
    return response.status(200).send(await readFile(commercialTermsAssetPath))
  }
    
  const assetPath = requestedAsset === 'architecture'
    ? architectureAssetPath
    : prototypeAssetPath
  response.setHeader('Content-Type', 'image/png')
  return response.status(200).send(await readFile(assetPath))
}
