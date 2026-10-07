import React, { lazy, Suspense, useState } from 'react'
import BackToTopButton from './components/BackToTopButton'
import ChatApp from './components/ChatApp'
import ProposalAccessGateway from './proposals/ProposalAccessGateway'
import ProposalExperience from './proposals/ProposalExperience'
import './proposals/proposal.css'

const InteractiveContentSections = lazy(
  () => import('./components/InteractiveContentSections'),
)
const LegalPage = lazy(() => import('./pages/LegalPage'))
const InternalKnowledgeBase = lazy(() => import('./pages/InternalKnowledgeBase'))

export const INTERACTIVE_CONTENT_SECTIONS_ENABLED =
  import.meta.env.VITE_INTERACTIVE_CONTENT_SECTIONS_ENABLED !== 'false'
export const CLIENT_PROPOSALS_ENABLED =
  import.meta.env.VITE_CLIENT_PROPOSALS_ENABLED !== 'false'
function App() {
  const [isChatActive, setIsChatActive] = useState(false)
  const [showProposalAccess, setShowProposalAccess] = useState(
    () => CLIENT_PROPOSALS_ENABLED && window.location.pathname.startsWith('/proposals/'),
  )
  const [proposal, setProposal] = useState(null)

  const activateProposal = async (accessResult) => {
    const response = await fetch('/api/proposals/content', {
      credentials: 'same-origin',
      cache: 'no-store',
    })
    const result = await response.json()
    if (!response.ok) throw new Error(result.error || 'Proposal access is required.')
    setProposal(result.proposal)
    setShowProposalAccess(false)
    window.history.replaceState({}, '', accessResult.route)
  }

  const exitProposal = async () => {
    await fetch('/api/proposals/logout', { method: 'POST', credentials: 'same-origin' })
    setProposal(null)
    window.history.replaceState({}, '', '/')
  }

  const path = window.location.pathname
  const isPrivacyPage = path === '/privacy' || path === '/privacy-policy'
  const isTermsPage = path === '/terms' || path === '/terms-of-service'
  const legalType = isPrivacyPage ? 'privacy' : isTermsPage ? 'terms' : null

  // Internal secret knowledge base route (custom obscure string so outsiders cannot guess/find)
  const isInternalDocs = path === '/team-kb-d7x9q2' || path === '/internal-kb' || path.startsWith('/team-kb-d7x9q2/')

  return (
    <div
      className={`app-container ${isInternalDocs ? 'internal-kb-mode' : ''} ${INTERACTIVE_CONTENT_SECTIONS_ENABLED && !proposal && !isInternalDocs ? 'interactive-content-enabled' : ''} ${proposal ? 'proposal-mode' : ''}`}
    >
      {!legalType && !isInternalDocs && (
        <div className="chat-viewport" id="dekode-chat">
          <ChatApp
            onOpenProposalAccess={() => setShowProposalAccess(true)}
            onExitProposal={exitProposal}
            onChatModeChange={setIsChatActive}
          />
        </div>
      )}
      {proposal && (
        <ProposalExperience
          proposal={proposal}
          onExit={exitProposal}
        />
      )}
      {isInternalDocs && (
        <Suspense fallback={<div className="interactive-section-placeholder" aria-hidden="true" />}>
          <InternalKnowledgeBase secretPath="/team-kb-d7x9q2" />
        </Suspense>
      )}
      {INTERACTIVE_CONTENT_SECTIONS_ENABLED && !proposal && !legalType && !isInternalDocs && (
        <Suspense fallback={<div className="interactive-section-placeholder" aria-hidden="true" />}>
          <InteractiveContentSections />
        </Suspense>
      )}
      {legalType && (
        <Suspense fallback={<div className="interactive-section-placeholder" aria-hidden="true" />}>
          <LegalPage type={legalType} />
        </Suspense>
      )}
      {CLIENT_PROPOSALS_ENABLED && showProposalAccess && !proposal && (
        <ProposalAccessGateway
          onClose={() => setShowProposalAccess(false)}
          onAccess={activateProposal}
        />
      )}
      {!proposal && !legalType && !isInternalDocs && (
        <BackToTopButton key="home-down" direction="down" disabled={isChatActive} />
      )}
      {!isInternalDocs && (
        <BackToTopButton key={proposal ? 'proposal' : 'site'} disabled={isChatActive && !proposal} />
      )}
    </div>
  )
}

export default App

