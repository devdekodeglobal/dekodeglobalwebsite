import {
  canAttemptAccess,
  createSessionCookie,
  genericAccessError,
  privateHeaders,
  PROPOSAL_ID,
  PROPOSAL_VERSION,
  verifyCredentials,
} from '../_proposal/security.js'
import { adapt } from '../_vercel_adapter.js';

export default async function handler(request, response) {
  privateHeaders(response)
  if (request.method !== 'POST') {
    return response.status(405).json({ ok: false, error: 'Method not allowed.' })
  }
  try {
    if (!canAttemptAccess(request)) {
      return response.status(429).json({ ok: false, error: genericAccessError })
    }

    const { password } = request.body || {}
    const auth = verifyCredentials(password)
    if (!auth || !auth.valid) {
      return response.status(401).json({ ok: false, error: genericAccessError })
    }

    response.setHeader('Set-Cookie', createSessionCookie(request, auth.accessLevel))
    console.info('[Proposal audit] Access granted.', {
      proposalId: PROPOSAL_ID,
      version: PROPOSAL_VERSION,
      at: new Date().toISOString(),
    })
    if (auth.accessLevel === 'vip_national' || auth.accessLevel === 'standard_national') {
      return response.status(200).json({
        ok: true,
        route: '/proposals/vip-client',
        proposal: {
          title: 'National Eyewear Company',
          subtitle: 'Inventory & Distribution System',
          sectionCount: 5,
          version: PROPOSAL_VERSION,
        },
      })
    }

    return response.status(200).json({
      ok: true,
      route: '/proposals/client',
      proposal: {
        title: 'Centre For Sight',
        subtitle: 'Inventory & Distribution System',
        sectionCount: 5,
        version: PROPOSAL_VERSION,
      },
    })
  } catch (err) {
    return response.status(500).json({ ok: false, error: 'Debug Error: ' + err.message + ' ' + err.stack })
  }
}

export async function onRequest(context) {
  return adapt(context, handler);
}
