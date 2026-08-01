import React, { useEffect, useRef, useState } from 'react'
import { LogOut } from 'lucide-react'

const PATH_BY_LABEL = {
  'Show Full Workflow': 'all',
  'Path 1: Stock Adequate': 'path-skip',
  'Path 2: Auto-Allocate': 'path-match',
  'Path 3: Substitute Match': 'path-exception',
  'Path 4: Total Stockout': 'path-stockout',
  'Target Met (No Deficit)': 'path-skip',
  'T1 Auto-Allocate': 'path-t1',
  'T2 Auto-Allocate': 'path-t2',
  'T3 Substitute Match': 'path-sub',
}

const normaliseText = (value = '') => value.replace(/\s+/g, ' ').trim()

export default function ProposalExperience({ proposal, onExit }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [activePath, setActivePath] = useState('all')
  const contentRef = useRef(null)
  const mobileTabsRef = useRef(null)
  const scrollRef = useRef(null)
  const section = proposal.sections[activeIndex]

  const selectSection = (index) => {
    if (index < 0 || index >= proposal.sections.length) return
    setActiveIndex(index)
    setActivePath('all')
    scrollRef.current?.scrollTo({ top: 0, behavior: 'auto' })
  }

  const selectSectionByLabel = (label) => {
    const index = proposal.sections.findIndex(
      (candidate) => normaliseText(candidate.navigationLabel) === normaliseText(label),
    )
    selectSection(index)
  }

  useEffect(() => {
    const robots = document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex,nofollow,noarchive'
    document.head.appendChild(robots)
    return () => robots.remove()
  }, [])

  useEffect(() => {
    const content = contentRef.current
    if (!content) return

    content.querySelectorAll('button').forEach((button) => {
      button.type = 'button'
    })

    content.querySelectorAll('.sidebar-nav-btn').forEach((button) => {
      const buttonLabel = normaliseText(button.textContent)
      const isCurrent = buttonLabel === normaliseText(section.navigationLabel)
      button.classList.toggle('active', isCurrent)
      button.setAttribute('aria-current', isCurrent ? 'step' : 'false')
      
      const btnIndex = proposal.sections.findIndex(s => normaliseText(s.navigationLabel) === buttonLabel)
      // Only the first 3 steps (Manual, OptiFlow, Prototype) have checkmark ticks when completed
      if (btnIndex !== -1 && btnIndex < 3 && btnIndex < activeIndex) {
        button.classList.add('completed-step')
      } else {
        button.classList.remove('completed-step')
      }
    })

    content.querySelectorAll('svg').forEach((diagram) => {
      diagram.setAttribute('role', 'img')
      diagram.setAttribute('aria-label', `${section.navigationLabel} diagram`)
    })

    content.querySelectorAll('.filter-btn').forEach((button) => {
      const path = PATH_BY_LABEL[normaliseText(button.textContent)]
      const isActive = path === activePath
      button.classList.toggle('active', isActive)
      button.setAttribute('aria-pressed', String(isActive))
    })

    content.querySelectorAll('.flow-element').forEach((element) => {
      element.classList.toggle(
        'dimmed',
        activePath !== 'all' && !element.classList.contains(activePath),
      )
    })
  }, [activeIndex, activePath, section.navigationLabel])

  useEffect(() => {
    const tabs = mobileTabsRef.current
    const activeTab = tabs?.querySelector('[aria-selected="true"]')
    const activeStep = activeTab?.closest('.proposal-mobile-tab-step')
    if (!tabs || !activeStep) return

    const centeredLeft = activeStep.offsetLeft - (tabs.clientWidth - activeStep.clientWidth) / 2
    tabs.scrollTo({ left: Math.max(0, centeredLeft), behavior: 'auto' })
  }, [activeIndex])

  const handleApprovedContentClick = (event) => {
    const navigationButton = event.target.closest('.sidebar-nav-btn')
    if (navigationButton && contentRef.current?.contains(navigationButton)) {
      selectSectionByLabel(navigationButton.textContent)
      return
    }

    const filterButton = event.target.closest('.filter-btn')
    if (!filterButton || !contentRef.current?.contains(filterButton)) return
    const path = PATH_BY_LABEL[normaliseText(filterButton.textContent)]
    if (path) setActivePath(path)
  }

  return (
    <main className="proposal-experience">
      <header className="proposal-confidential-bar">
        <span className="proposal-confidential-label">
          <span aria-hidden="true" />
          Confidential
        </span>
        <button type="button" onClick={onExit}>
          <LogOut size={16} />
          Exit proposal
        </button>
      </header>

      <section
        ref={scrollRef}
        className="proposal-source-stage"
        aria-label={`${proposal.title} ${proposal.subtitle}`}
      >
        <nav className="proposal-mobile-nav" aria-label="Proposal sections">
          <div className="proposal-mobile-nav-heading">
            <span>Proposal sections</span>
            <strong>{activeIndex + 1} of {proposal.sections.length}</strong>
          </div>
          <div ref={mobileTabsRef} className="proposal-mobile-tabs" role="tablist" aria-label="Proposal sections">
            {proposal.sections.map((candidate, index) => (
              <div
                key={candidate.id}
                role="presentation"
                className={`proposal-mobile-tab-step${index < activeIndex ? ' completed' : ''}`}
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={index === activeIndex}
                  className={index === activeIndex ? 'active' : ''}
                  onClick={() => selectSection(index)}
                >
                  <span>{candidate.navigationLabel}</span>
                </button>
                {index < proposal.sections.length - 1 && (
                  <span className="proposal-mobile-tab-connector" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </nav>
        <article
          key={section.id}
          ref={contentRef}
          className="proposal-original-content"
          onClick={handleApprovedContentClick}
          dangerouslySetInnerHTML={{ __html: section.html }}
        />
      </section>
    </main>
  )
}
