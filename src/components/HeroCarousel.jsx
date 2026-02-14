// src/components/HeroCarousel.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

// simple release formatter (kept from before)
function formatRelease(iso, precision) {
  if (!iso) return 'Release date: —'

  const raw = String(iso).split('T')[0] // "YYYY" | "YYYY-MM" | "YYYY-MM-DD"

  // helpers (UTC to avoid shifts when we do need a Date)
  const monthName = (y, m) =>
    new Intl.DateTimeFormat('en-US', { month: 'long', timeZone: 'UTC' })
      .format(new Date(Date.UTC(y, m - 1, 1)))
  const daysInMonth = (y, m) => new Date(Date.UTC(y, m, 0)).getUTCDate()

  // today's local calendar parts (no time)
  const today = new Date()
  const TY = today.getFullYear()
  const TM = today.getMonth() + 1
  const TD = today.getDate()

  // --- infer precision if not provided ---
  let inferred = precision
  if (!inferred) {
    if (/^\d{4}$/.test(raw)) {
      inferred = 'year'
    } else if (/^\d{4}-\d{2}$/.test(raw)) {
      inferred = 'month'
    } else if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
      const [y, m, d] = raw.split('-').map(n => parseInt(n, 10))
      // treat "last day of month" placeholders as month-only
      if (d === daysInMonth(y, m)) inferred = 'month'
    }
  }

  // --- YEAR ONLY ---
  if (inferred === 'year') {
    const y = parseInt(raw.slice(0, 4), 10)
    const future = y > TY
    return `${future ? 'Releases in' : 'Released in'} ${y}`
  }

  // --- MONTH ONLY ---
  if (inferred === 'month') {
    const y = parseInt(raw.slice(0, 4), 10)
    const m = parseInt(raw.slice(5, 7), 10)
    const futureMonth = (y > TY) || (y === TY && m > TM)
    const pastMonth   = (y < TY) || (y === TY && m < TM)
    const label = futureMonth ? 'Releases in' : (pastMonth ? 'Released in' : 'Releases in')
    return `${label} ${monthName(y, m)} ${y}`
  }

  // --- FULL DATE (YYYY-MM-DD) ---
  const [ys, ms, ds] = raw.split('-')
  const y = parseInt(ys, 10)
  const m = parseInt(ms, 10)
  const d = parseInt(ds, 10)
  const future =
    y > TY || (y === TY && (m > TM || (m === TM && d > TD)))
  const label = future ? 'Releases on' : 'Released on'
  return `${label} ${monthName(y, m)} ${d}, ${y}`
}

export default function HeroCarousel({ figures = [], count = 7, intervalMs = 7000, fullBleed = false, fullScreen = false }) {
  // shuffle + take N with images
  const items = useMemo(() => {
    const pool = (figures || []).filter(f => Array.isArray(f.images) && f.images[0])
    const arr = [...pool]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr.slice(0, Math.min(count, arr.length)
  )
  }, [figures, count])

  const [idx, setIdx] = useState(0)
  const n = items.length
  const prevIdx = (idx - 1 + n) % n
  const nextIdx = (idx + 1) % n
  const prev = n > 1 ? items[prevIdx] : null
  const curr = n ? items[idx] : null
  const next = n > 1 ? items[nextIdx] : null

  const timer = useRef(null)
  useEffect(() => {
    if (n <= 1) return
    timer.current = setInterval(() => setIdx(i => (i + 1) % n), intervalMs)
    return () => clearInterval(timer.current)
  }, [n, intervalMs])

  if (!n) return null

  const Meta = ({ f }) => (
    <div className="hero-overlay">
      <div className="hero-meta">
        <div className="hero-brand">{f.brand}</div>
        <div className="hero-name">{f.name}</div>
        {f.altTitle && <div className="hero-alt">{f.altTitle}</div>}
        <div className="hero-release">
          {formatRelease(f.releaseDate, f.releasePrecision)}
        </div>
      </div>
    </div>
  )

  return (
    <div className={`home-hero hero--peek ${fullBleed ? 'hero--bleed' : ''} ${fullScreen ? 'hero--full' : ''}`}>
      {/* Three-up lane: prev (faded), current, next (faded) */}
      <div className="hero-row">
        {prev && (
          <Link to={`/figure/${prev.id}`} className="hero-card hero-side" aria-label={`${prev.name} detail`}>
            <img src={prev.images[0]} alt={prev.altTitle || prev.name} loading="eager" />
            {/* no overlay on sides */}
          </Link>
        )}

        <Link to={`/figure/${curr.id}`} className="hero-card hero-center" aria-label={`${curr.name} detail`}>
          <img src={curr.images[0]} alt={curr.altTitle || curr.name} loading="eager" />
          <Meta f={curr} />
        </Link>

        {next && (
          <Link to={`/figure/${next.id}`} className="hero-card hero-side" aria-label={`${next.name} detail`}>
            <img src={next.images[0]} alt={next.altTitle || next.name} loading="eager" />
          </Link>
        )}
      </div>

      {/* Controls */}
      <div className="hero-controls">
        <button onClick={() => setIdx((idx - 1 + n) % n)} aria-label="Previous">‹</button>
        <div className="hero-pager">{idx + 1} / {n}</div>
        <button onClick={() => setIdx((idx + 1) % n)} aria-label="Next">›</button>
      </div>
    </div>
  )
}
