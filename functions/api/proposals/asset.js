import { privateHeaders, readSession } from '../_proposal/security.js'
import { bundledAssets } from '../_proposal/bundledAssets.js'
import { adapt } from '../_vercel_adapter.js'

function getAssetBytes(fileName) {
  const base64 = bundledAssets[fileName]
  if (!base64) return null
  return Buffer.from(base64, 'base64')
}

export default async function handler(request, response) {
  privateHeaders(response)
  if (request.method !== 'GET') return response.status(405).end()
  const session = readSession(request)
  if (!session) return response.status(401).end()
  
  const requestedAsset = request.query?.asset ||
    new URL(request.url || '/', 'http://localhost').searchParams.get('asset')
     
  if (requestedAsset === 'business_plan') {
    if (session.accessLevel !== 'extended' && session.accessLevel !== 'vip_national') return response.status(403).end()
    response.setHeader('Content-Type', 'application/pdf')
    const data = getAssetBytes('CFS_Business_Impact_Presentation.pdf')
    return response.status(200).send(data)
  }

  if (requestedAsset === 'commercial_terms') {
    if (session.accessLevel !== 'extended' && session.accessLevel !== 'vip_national') return response.status(403).end()
    response.setHeader('Content-Type', 'application/pdf')
    const data = getAssetBytes('CFS_OptiFlow_Payback_Commercial_Terms.pdf')
    return response.status(200).send(data)
  }
    
  let assetFile = 'image.png'
  if (requestedAsset === 'architecture') {
    assetFile = 'arch.png'
  } else if (requestedAsset === 'prototype_vip') {
    assetFile = 'image_vip.png'
  }

  response.setHeader('Content-Type', 'image/png')
  const data = getAssetBytes(assetFile)
  return response.status(200).send(data)
}

export async function onRequest(context) {
  return adapt(context, handler)
}
