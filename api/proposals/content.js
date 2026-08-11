import { proposal } from '../_proposal/generatedContent.js'
import { privateHeaders, readSession } from '../_proposal/security.js'

export default async function handler(request, response) {
  privateHeaders(response)
  if (request.method !== 'GET') {
    return response.status(405).json({ ok: false, error: 'Method not allowed.' })
  }
  const session = readSession(request)
  if (!session) {
    return response.status(401).json({ ok: false, error: 'Proposal access is required.' })
  }
  
  // Clone the proposal so we don't mutate the imported read-only object
  const customizedProposal = {
    ...proposal,
    sections: proposal.sections.map(s => ({ ...s }))
  }

  if (session.accessLevel === 'extended') {
    // 1. Create the new section
    const businessPlanSection = {
      id: "business-plan",
      order: 6,
      navigationLabel: "Business Impact",
      html: `<div class="proposal-page-container"><div class="proposal-layout-wrapper"><div class="proposal-sidebar"><div class="journey-nav"><div class="journey-title">Discovery</div><button class="sidebar-nav-btn completed-step">Current Process: Manual</button><button class="sidebar-nav-btn completed-step">Proposed Process: OptiFlow</button><button class="sidebar-nav-btn completed-step">Prototype</button><button class="sidebar-nav-btn completed-step">Allocation Logic Flow</button><button class="sidebar-nav-btn ">Architecture Diagram</button><button class="sidebar-nav-btn active">Business Impact</button><button class="sidebar-nav-btn ">Commercial & Terms</button></div></div><div class="proposal-main-content"><div class="proposal-top-header" style="text-align:center"><h1 style="color:#053364;font-size:36px;margin:0 0 8px 0;font-weight:800;letter-spacing:-0.5px">Centre For Sight</h1><p style="color:#475569;font-size:20px;margin:0;font-weight:500">Inventory &amp; Distribution System</p></div><div class="business-plan-view-container"><div style="display:flex;justify-content:flex-end;gap:8px;margin-top:4px;margin-bottom:8px"><button title="Full Screen" onclick="document.getElementById('pdf-wrapper-container-1').requestFullscreen()" style="width:36px;height:36px;border-radius:50%;background:#f0f4f8;color:#053364;border:1px solid #d1dce6;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg></button><a title="Download PDF" href="/api/proposals/asset?asset=business_plan" download="CFS_Business_Impact_Presentation.pdf" style="width:36px;height:36px;border-radius:50%;background:#fffaf0;color:#d97706;border:1px solid #fde6b3;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"></path></svg></a></div><div id="pdf-wrapper-container-1" style="width:100%;height:75vh;border-radius:12px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.1);background:white"><iframe src="/api/proposals/asset?asset=business_plan#toolbar=0&view=FitH" width="100%" height="100%" style="border:none;"></iframe></div></div></div></div></div>`
    }
    
    customizedProposal.sections.push(businessPlanSection)
    
    const commercialTermsSection = {
      id: "commercial-terms",
      order: 7,
      navigationLabel: "Commercial & Terms",
      html: `<div class="proposal-page-container"><div class="proposal-layout-wrapper"><div class="proposal-sidebar"><div class="journey-nav"><div class="journey-title">Discovery</div><button class="sidebar-nav-btn completed-step">Current Process: Manual</button><button class="sidebar-nav-btn completed-step">Proposed Process: OptiFlow</button><button class="sidebar-nav-btn completed-step">Prototype</button><button class="sidebar-nav-btn completed-step">Allocation Logic Flow</button><button class="sidebar-nav-btn ">Architecture Diagram</button><button class="sidebar-nav-btn ">Business Impact</button><button class="sidebar-nav-btn active">Commercial & Terms</button></div></div><div class="proposal-main-content"><div class="proposal-top-header" style="text-align:center"><h1 style="color:#053364;font-size:36px;margin:0 0 8px 0;font-weight:800;letter-spacing:-0.5px">Centre For Sight</h1><p style="color:#475569;font-size:20px;margin:0;font-weight:500">Inventory &amp; Distribution System</p></div><div class="business-plan-view-container"><div style="display:flex;justify-content:flex-end;gap:8px;margin-top:4px;margin-bottom:8px"><button title="Full Screen" onclick="document.getElementById('pdf-wrapper-container-2').requestFullscreen()" style="width:36px;height:36px;border-radius:50%;background:#f0f4f8;color:#053364;border:1px solid #d1dce6;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg></button><a title="Download PDF" href="/api/proposals/asset?asset=commercial_terms" download="CFS_OptiFlow_Payback_Commercial_Terms.pdf" style="width:36px;height:36px;border-radius:50%;background:#fffaf0;color:#d97706;border:1px solid #fde6b3;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"></path></svg></a></div><div id="pdf-wrapper-container-2" style="width:100%;height:75vh;border-radius:12px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.1);background:white"><iframe src="/api/proposals/asset?asset=commercial_terms#toolbar=0&view=FitH" width="100%" height="100%" style="border:none;"></iframe></div></div></div></div></div>`
    }
    customizedProposal.sections.push(commercialTermsSection)
    
    // 2. Inject the Business Impact button into the sidebar of all existing sections
    customizedProposal.sections.forEach(sec => {
      if (sec.id !== 'business-plan' && sec.id !== 'commercial-terms') {
        sec.html = sec.html.replace(
          /<\/div><\/div><div class="proposal-main-content">/,
          `<button class="sidebar-nav-btn ">Business Impact</button><button class="sidebar-nav-btn ">Commercial & Terms</button></div></div><div class="proposal-main-content">`
        )
      }
    })
  }

  return response.status(200).json({ ok: true, proposal: customizedProposal })
}
