import React, { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useData } from '../state/DataContext'
import Slideshow from '../components/Slideshow'
import { Helmet } from "react-helmet-async";

export default function FigureDetail() {
  const { id } = useParams()
  const { figures } = useData()
  const navigate = useNavigate()

  const fig = useMemo(() => figures.find(f => String(f.id) === String(id)), [figures, id])
  if (!fig) {
    return <div>This page does not exist.</div>
  }

  // Make a safe array of types (works with `types:[]` OR single `type`)
  const typesArr = Array.isArray(fig.types)
    ? fig.types.filter(Boolean)
    : (fig.type ? [fig.type] : [])

  // Is this an Event Exclusive?
  const isEventExclusive = typesArr.includes('Event Exclusive')

  // Only show the Event row when it’s an Event Exclusive AND you have text
  const showEvent = isEventExclusive && typeof fig.event === 'string' && fig.event.trim() !== ''

  const goBack = () => {
    // If there’s browser history, go back; otherwise fall back to your list
    if (window.history.length > 1) navigate(-1)
    else navigate('/shfiguarts')
  }

  const priceUSDLabel = fig.priceUSD != null ? `$${Number(fig.priceUSD).toLocaleString()}` : '—'
  const priceJPYLabel = fig.priceJPY != null ? `¥${Number(fig.priceJPY).toLocaleString()}` : '—'

  const formatHeight = (inch, mm) => {
    const parts = []
    if (inch != null && inch !== '') {
      const n = Number(inch)
      const inStr = Number.isFinite(n)
        ? (n % 1 ? n.toFixed(2) : n.toFixed(0))   // e.g., "5.7" or "6"
        : String(inch)
      parts.push(`${inStr}in`)
    }
    if (mm != null && mm !== '') {
      const m = Number(mm)
      const mmStr = Number.isFinite(m) ? Math.round(m).toString() : String(mm)
      parts.push(`(${mmStr}mm)`)
    }
    return parts.length ? parts.join(' ') : '—'
  }

  const materialsLabel = fig.materials && fig.materials.length
    ? fig.materials.join(', ')
    : '—'

  const formatRelease = (raw, precision) => {
    const s = String(raw || '').trim()
    const mFull = s.match(/^(\d{4})-(\d{2})-(\d{2})$/)
    const mMonth = s.match(/^(\d{4})-(\d{2})$/)
    const mYear = s.match(/^(\d{4})$/)
    const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    // Honor explicit precision if provided
    if (precision === 'year' && (mYear || mMonth || mFull)) {
      const y = (mYear?.[1] || mMonth?.[1] || mFull?.[1])
      return y
    }
    if (precision === 'month' && (mMonth || mFull)) {
      const y = (mMonth?.[1] || mFull?.[1])
      const mo = Number(mMonth?.[2] || mFull?.[2]) - 1
      return `${MONTHS[mo]} ${y}`
    }

    // Auto-detect
    if (mFull) {
      const [, y, mo, d] = mFull
      return `${MONTHS[Number(mo) - 1]} ${Number(d)}, ${y}`
    }
    if (mMonth) {
      const [, y, mo] = mMonth
      return `${MONTHS[Number(mo) - 1]} ${y}`
    }
    if (mYear) return mYear[1]

    // Fallback
    const dt = new Date(s)
    return isNaN(dt) ? (s || '—') : dt.toLocaleDateString()
  }

  const BRAND_LOGOS = {
    'S.H.Figuarts': '/uploads/shflogo.png',
    'Demoniacal Fit': '/uploads/demoniacalfitlogo.png'
  }
  const headerImg = fig.headerImage || BRAND_LOGOS[fig.brand] || null

  const hasSubtitle =
    !!fig.altTitle &&
    fig.altTitle.trim().toLowerCase() !== (fig.name || '').trim().toLowerCase()

  // ---------- SEO (title + description) ----------
  const toText = (v) => (Array.isArray(v) ? v.filter(Boolean).join(', ') : (v ?? '').toString().trim())

  const clamp = (s, max = 160) => {
    const oneLine = s.replace(/\s+/g, ' ').trim()
    return oneLine.length > max ? oneLine.slice(0, max - 1).trimEnd() + '…' : oneLine
  }

  const typesText = typesArr.length ? typesArr.join(', ') : (fig.type || '—')

  // Use your existing formatRelease() for display-friendly date text
  const releaseText = fig.releaseDate ? formatRelease(fig.releaseDate, fig.releasePrecision) : '—'

  // Build a meta description from figure info
  const seoDescription = clamp(
    [
      fig.brand ? `Brand: ${fig.brand}` : null,
      fig.series ? `Series: ${fig.series}` : null,
      typesText && typesText !== '—' ? `Type: ${typesText}` : null,
      showEvent ? `Event: ${fig.event}` : null,
      releaseText && releaseText !== '—' ? `Release Date: ${releaseText}` : null,
    ].filter(Boolean).join(' • ')
  )

  // Canonical URL should match your actual route: /figure/:id
  const canonicalUrl = `https://dragonballactionfigures.com/figure/${fig.id}`

  // Pick an OG image (first slideshow image if available)
  const ogImagePath = Array.isArray(fig.images) && fig.images.length ? fig.images[0] : null
  const ogImage =
    ogImagePath
      ? (ogImagePath.startsWith('http') ? ogImagePath : `https://dragonballactionfigures.com${ogImagePath.startsWith('/') ? ogImagePath : `/${ogImagePath}`}`)
      : 'https://dragonballactionfigures.com/seo/og-home.jpg'

  const baseTitle = hasSubtitle ? `${fig.name} ${fig.altTitle}` : fig.name
  const seoFigureTitle = fig.brand ? `${fig.brand} ${baseTitle}` : baseTitle

  return (
    <section className="detail-grid">
      <Helmet>
        <title>{seoFigureTitle} - Dragon Ball Action Figures</title>
        <meta name="description" content={seoDescription} />
        <link rel="canonical" href={canonicalUrl} />

        <meta property="og:title" content={`${seoFigureTitle} - Dragon Ball Action Figures`} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={ogImage} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${seoFigureTitle} - Dragon Ball Action Figures`} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>

      <div className="detail-head">
        {/* Back button */}
        <button className="badge back-btn" onClick={goBack} aria-label="Go back">
          ‹ Back
        </button>

        <div className="detail-brand-row">
          {headerImg && (
            <img
              className="detail-header-img"
              src={headerImg}
              alt=""
              loading="lazy"
            />
          )}
          {/* <span className="type-chip" data-type={fig.type}>{fig.type}</span> */}
        </div>
        <div className={`detail-titleblock ${hasSubtitle ? 'has-subtitle' : ''}`}>
          <h1 className="detail-title">{fig.name}</h1>
          {hasSubtitle && <div className="detail-subtitle">{fig.altTitle}</div>}
        </div>
      </div>

      <div className="detail-slideshow">
        <Slideshow images={fig.images} />
      </div>

      <div className="detail-info">
        <div className="data-list">
          <dl className="info-grid">
            {[
              { label: 'Brand', value: fig.brand },
              { label: 'Series', value: fig.series },
              {
                label: 'Type',
                value: Array.isArray(fig.types) ? fig.types.join(', ') : (fig.type || '—')
              },
              // Only add Event when it should show
              showEvent ? { label: 'Event', value: fig.event } : null,
              { label: 'Release Date', value: formatRelease(fig.releaseDate, fig.releasePrecision) },
              { label: 'Price (USD)', value: priceUSDLabel },
              { label: 'Price (JPY)', value: priceJPYLabel },
              { label: 'Height', value: formatHeight(fig.heightIn, fig.heightMm) },
              { label: 'Materials', value: materialsLabel },
              fig.accessories?.length
                ? {
                  label: 'Accessories', value: (
                    <ul className="info-list">
                      {fig.accessories.map((a, i) => <li key={i}>{a}</li>)}
                    </ul>
                  )
                }
                : null,
            ]
              .filter(Boolean)
              .map((row, i) => (
                <div className="info-row" key={i}>
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
