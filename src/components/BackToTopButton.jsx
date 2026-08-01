import React, { useEffect, useRef, useState } from 'react'
import { ArrowUp } from 'lucide-react'

const SCROLL_TARGET_SELECTOR = '.app-container, .chat-scroll-area, .proposal-source-stage'

export default function BackToTopButton() {
  const [visible, setVisible] = useState(false)
  const activeTargetRef = useRef(null)

  useEffect(() => {
    const handleScroll = (event) => {
      const target = event.target
      if (!(target instanceof HTMLElement) || !target.matches(SCROLL_TARGET_SELECTOR)) return

      const shouldShow = target.scrollTop > Math.max(400, target.clientHeight * 0.75)
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
  }, [])

  const scrollToTop = () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    activeTargetRef.current?.scrollTo({
      top: 0,
      behavior: reduceMotion ? 'auto' : 'smooth',
    })
    setVisible(false)
  }

  if (!visible) return null

  return (
    <button
      type="button"
      className="back-to-top-button"
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
    >
      <ArrowUp size={20} aria-hidden="true" />
    </button>
  )
}
