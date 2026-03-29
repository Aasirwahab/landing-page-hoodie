'use client'

import React, { useRef, useLayoutEffect, useState, useCallback, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function CampaignSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const progressFillRef = useRef<HTMLDivElement>(null)
  const progressThumbRef = useRef<HTMLDivElement>(null)
  const timeCurrentRef = useRef<HTMLSpanElement>(null)
  const timeDurationRef = useRef<HTMLSpanElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [hasStarted, setHasStarted] = useState(false)

  // Format time helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // GSAP ScrollTrigger for cinematic clip-path reveal
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return

    const section = sectionRef.current
    if (!section) return

    const triggers: ScrollTrigger[] = []

    const wrapper = section.querySelector('.campaign-video-wrapper')
    if (wrapper) {
      const t = gsap.fromTo(
        wrapper,
        { clipPath: 'inset(15% 0 15% 0)' },
        {
          clipPath: 'inset(0% 0 0% 0)',
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            end: 'center center',
            scrub: 1.5,
          },
        }
      )
      if (t.scrollTrigger) triggers.push(t.scrollTrigger)
    }

    // Animate the overlay text on scroll
    const textElements = section.querySelectorAll('.campaign-text-reveal')
    textElements.forEach((el, i) => {
      const t = gsap.fromTo(
        el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: i * 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 50%',
            toggleActions: 'play none none none',
          },
        }
      )
      if (t.scrollTrigger) triggers.push(t.scrollTrigger)
    })

    return () => { triggers.forEach(st => st.kill()) }
  }, [])

  // Auto-play video when section enters viewport
  useEffect(() => {
    const video = videoRef.current
    const section = sectionRef.current
    if (!video || !section) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
            video.play().then(() => {
              setIsPlaying(true)
              setHasStarted(true)
            }).catch(() => {
              // Autoplay blocked — user will click to play
            })
          } else {
            if (!video.paused) {
              video.pause()
              setIsPlaying(false)
            }
          }
        })
      },
      { threshold: [0.4] }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  // Track video progress — direct DOM updates, no React re-renders
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      if (!video.duration) return
      const pct = (video.currentTime / video.duration) * 100
      if (progressFillRef.current) progressFillRef.current.style.width = `${pct}%`
      if (progressThumbRef.current) progressThumbRef.current.style.left = `${pct}%`
      if (timeCurrentRef.current) timeCurrentRef.current.textContent = formatTime(video.currentTime)
    }

    const handleLoadedMetadata = () => {
      if (timeDurationRef.current) timeDurationRef.current.textContent = formatTime(video.duration)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      if (progressFillRef.current) progressFillRef.current.style.width = '0%'
      if (progressThumbRef.current) progressThumbRef.current.style.left = '0%'
      video.currentTime = 0
      video.play().then(() => setIsPlaying(true)).catch(() => {})
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('ended', handleEnded)
    }
  }, [])

  const togglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      video.play().then(() => {
        setIsPlaying(true)
        setHasStarted(true)
      }).catch(() => {})
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }, [])

  const toggleMute = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setIsMuted(!video.muted)
  }, [])

  // Click on progress bar to seek
  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current
    const bar = progressRef.current
    if (!video || !bar) return

    const rect = bar.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percentage = clickX / rect.width
    video.currentTime = percentage * video.duration
  }, [])

  return (
    <section ref={sectionRef} className="campaign-section" data-cursor-text="WATCH">
      <div
        className="campaign-video-wrapper"
        ref={(el) => {
          if (el) el.style.setProperty('clip-path', 'inset(15% 0 15% 0)')
        }}
      >
        {/* Video */}
        <video
          ref={videoRef}
          className="campaign-video"
          muted
          playsInline
          preload="metadata"
          poster="/images/campaign_shot.webp"
        >
          <source src="/video/processed-Video_Ready_Here_s_the_Link.mp4" type="video/mp4" />
        </video>

        {/* Cinematic gradient overlays */}
        <div className="campaign-gradient-top" />
        <div className="campaign-gradient-bottom" />

        {/* Center play button (shown when paused) */}
        <div
          className={`campaign-overlay ${isPlaying ? 'campaign-overlay-hidden' : ''}`}
          onClick={togglePlay}
          style={{ pointerEvents: 'auto', cursor: 'pointer' }}
        >
          <div className="campaign-play-btn">
            <i className={`ri-${isPlaying ? 'pause' : 'play'}-fill`}></i>
          </div>
        </div>

        {/* Click-to-toggle area (when video is playing) */}
        {isPlaying && (
          <div className="campaign-click-area" onClick={togglePlay} />
        )}

        {/* Cinematic overlay text */}
        <div className="campaign-text-overlay">
          <p className="campaign-text-reveal campaign-label">The Campaign</p>
          <h2 className="campaign-text-reveal campaign-headline">Beyond the Elements</h2>
          <p className="campaign-text-reveal campaign-tagline">
            Where extreme performance meets uncompromising style
          </p>
        </div>

        {/* Bottom controls bar */}
        <div className={`campaign-controls ${hasStarted ? 'campaign-controls-visible' : ''}`}>
          <button
            className="campaign-control-btn"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            <i className={`ri-${isPlaying ? 'pause' : 'play'}-fill`}></i>
          </button>

          <span ref={timeCurrentRef} className="campaign-time">0:00</span>

          <div
            ref={progressRef}
            className="campaign-progress-bar"
            onClick={handleProgressClick}
          >
            <div className="campaign-progress-rail" />
            <div ref={progressFillRef} className="campaign-progress-fill" />
            <div ref={progressThumbRef} className="campaign-progress-thumb" />
          </div>

          <span ref={timeDurationRef} className="campaign-time">0:00</span>

          <button
            className="campaign-control-btn"
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            <i className={`ri-${isMuted ? 'volume-mute' : 'volume-up'}-fill`}></i>
          </button>
        </div>
      </div>
    </section>
  )
}
