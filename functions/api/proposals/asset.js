import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { privateHeaders, readSession } from '../_proposal/security.js'
import { adapt } from '../_vercel_adapter.js'

function getLocalAssetPath(relativePath) {
  try {
    return resolve(
      fileURLToPath(new URL('..', import.meta.url)),
      relativePath,
    );
  } catch (e) {
    // In production Cloudflare Workers, import.meta.url or fileURLToPath might fail,
    // but we won't need the local path anyway as R2 is used.
    return '';
  }
}

async function getAssetData(request, r2Key, localPath) {
  if (request.env?.PROPOSAL_ASSETS) {
    const object = await request.env.PROPOSAL_ASSETS.get(r2Key);
    if (object) {
      return new Uint8Array(await object.arrayBuffer());
    }
    console.warn(`[Proposal Asset] ${r2Key} not found in R2. Falling back to fs.`);
  }
  return readFile(localPath);
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
    const data = await getAssetData(request, 'CFS_Business_Impact_Presentation.pdf', getLocalAssetPath('_proposal/source/CFS_Business_Impact_Presentation.pdf'));
    return response.status(200).send(data)
  }

  if (requestedAsset === 'commercial_terms') {
    if (session.accessLevel !== 'extended' && session.accessLevel !== 'vip_national') return response.status(403).end()
    response.setHeader('Content-Type', 'application/pdf')
    const data = await getAssetData(request, 'CFS_OptiFlow_Payback_Commercial_Terms.pdf', getLocalAssetPath('_proposal/source/CFS_OptiFlow_Payback_Commercial_Terms.pdf'));
    return response.status(200).send(data)
  }
    
  let r2Key = 'image.png';
  let localPath = getLocalAssetPath('_proposal/source/image.png');

  if (requestedAsset === 'architecture') {
    r2Key = 'arch.png';
    localPath = getLocalAssetPath('_proposal/source/arch.png');
  } else if (requestedAsset === 'prototype_vip') {
    r2Key = 'image_vip.png';
    localPath = getLocalAssetPath('_proposal/source/image_vip.png');
  }

  response.setHeader('Content-Type', 'image/png')
  const data = await getAssetData(request, r2Key, localPath);
  return response.status(200).send(data)
}

export async function onRequest(context) {
  return adapt(context, handler);
}
