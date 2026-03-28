'use client'

import React, { useRef, useLayoutEffect, useState, useCallback, useEffect } from 'react'
import Image from 'next/image'

export default function CampaignSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [hasStarted, setHasStarted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState('0:00')
  const [duration, setDuration] = useState('0:00')

  // Format time helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // GSAP ScrollTrigger for cinematic clip-path reveal
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return

    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger)

        const section = sectionRef.current
        if (!section) return

        const wrapper = section.querySelector('.campaign-video-wrapper')
        if (wrapper) {
          gsap.fromTo(
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
        }

        // Animate the overlay text on scroll
        const textElements = section.querySelectorAll('.campaign-text-reveal')
        textElements.forEach((el, i) => {
          gsap.fromTo(
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
        })
      })
    })
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

  // Track video progress
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100)
        setCurrentTime(formatTime(video.currentTime))
      }
    }

    const handleLoadedMetadata = () => {
      setDuration(formatTime(video.duration))
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setProgress(0)
      // Loop smoothly
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
        {/* Poster image (shown until video loads) */}
        <div className={`campaign-bg ${hasStarted ? 'campaign-poster-hidden' : ''}`}>
          <Image
            src="/images/campaign_shot.webp"
            alt="POSSESSD Campaign"
            fill
            quality={75}
            sizes="100vw"
            placeholder="blur"
            blurDataURL="data:image/webp;base64,UklGRjYAAABXRUJQVlA4ICoAAACwAQCdASoKAAoABUB8JYgCdAEOO2gAAP6h55PSaehYi4WokqXk/RGAAAA="
            className="campaign-image"
          />
        </div>

        {/* Actual video */}
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

          <span className="campaign-time">{currentTime}</span>

          <div
            ref={progressRef}
            className="campaign-progress-bar"
            onClick={handleProgressClick}
          >
            <div className="campaign-progress-rail" />
            <div
              className="campaign-progress-fill"
              style={{ width: `${progress}%` }}
            />
            <div
              className="campaign-progress-thumb"
              style={{ left: `${progress}%` }}
            />
          </div>

          <span className="campaign-time">{duration}</span>

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
