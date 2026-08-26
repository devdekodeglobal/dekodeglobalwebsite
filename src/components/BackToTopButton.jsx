import React, { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUp } from 'lucide-react'

const SCROLL_TARGET_SELECTOR = '.app-container, .chat-scroll-area, .proposal-source-stage'

function getFirstSectionTop(target) {
  const firstSection = target.querySelector('.story-section')
  if (!firstSection) return null

  return Math.max(
    0,
    firstSection.getBoundingClientRect().top - target.getBoundingClientRect().top + target.scrollTop,
  )
}

export default function BackToTopButton({ disabled = false, direction = 'up' }) {
  const isDownButton = direction === 'down'
  const [visible, setVisible] = useState(isDownButton)
  const activeTargetRef = useRef(null)

  useEffect(() => {
    if (disabled) {
      activeTargetRef.current = null
      setVisible(false)
      return undefined
    }

    const handleScroll = (event) => {
      const target = event.target
      if (!(target instanceof HTMLElement) || !target.matches(SCROLL_TARGET_SELECTOR)) return

      if (isDownButton) {
        const firstSectionTop = getFirstSectionTop(target)
        const shouldShow = firstSectionTop === null
          ? target.scrollTop === 0
          : target.scrollTop < firstSectionTop
        if (shouldShow) activeTargetRef.current = target
        else if (activeTargetRef.current === target) activeTargetRef.current = null
        setVisible(shouldShow)
        return
      }

      const storySections = [...target.querySelectorAll('.story-section')]
      const thirdSection = storySections[2]
      const meaningfulThreshold = thirdSection
        ? Math.max(target.clientHeight, thirdSection.offsetTop - target.clientHeight * 0.35)
        : Math.max(720, target.clientHeight * 1.5)
      const shouldShow = target.scrollTop > meaningfulThreshold
      if (shouldShow) {
        activeTargetRef.current = target
        setVisible(true)
      } else if (activeTargetRef.current === target) {
        activeTargetRef.current = null
        setVisible(false)
      }
    }

    document.addEventListener('scroll', handleScroll, true)
    return () => document.removeEventListener('scroll', handleScroll, true)
  }, [disabled, isDownButton])

  const scrollToTarget = () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const target = activeTargetRef.current || document.querySelector(SCROLL_TARGET_SELECTOR)
    const firstSectionTop = target && getFirstSectionTop(target)
    target?.scrollTo({
      top: isDownButton ? firstSectionTop || 0 : 0,
      behavior: reduceMotion ? 'auto' : 'smooth',
    })
    setVisible(false)
  }

  if (!visible) return null

  if (isDownButton) {
    return (
      <button
        type="button"
        className="back-to-top-button"
        onClick={scrollToTarget}
        aria-label="See more"
        title="See more"
      >
        <ArrowDown size={20} aria-hidden="true" />
      </button>
    )
  }

  return (
    <button
      type="button"
      className="back-to-top-button"
      onClick={scrollToTarget}
      aria-label="Back to top"
      title="Back to top"
    >
      <ArrowUp size={20} aria-hidden="true" />
    </button>
  )
}
