import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useData } from '../state/DataContext'

export default function SearchBar() {
  const { figures } = useData()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const boxRef = useRef(null)
  const navigate = useNavigate()

  const tokens = useMemo(
    () => q.trim().toLowerCase().split(/\s+/).filter(Boolean),
    [q]
  )

  const results = useMemo(() => {
    if (!tokens.length) return []

    return figures
      .filter(f => {
        // unified haystack: use precomputed searchText if present,
        // otherwise build it on the fly (includes accessories)
        const haystack = (f.searchText
          ? f.searchText
          : [
            f.name,
            f.altTitle,
            f.brand,
            f.series,
            Array.isArray(f.accessories) ? f.accessories.join(' ') : ''
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
        )

        // all words typed must appear somewhere in the haystack
        return tokens.every(t => haystack.includes(t))
      })
      .slice(0, 10)
  }, [tokens, figures])

  useEffect(() => {
    const onDocClick = (e) => {
      if (!boxRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  const onSubmit = (e) => {
    e.preventDefault()
    if (results[0]) {
      navigate(`/figure/${results[0].id}`)
      setQ('')
      setOpen(false)
    }
  }

  return (
    <div className="search" ref={boxRef}>
      <form onSubmit={onSubmit}>
        <input
          value={q}
          onChange={e => { setQ(e.target.value); setOpen(true) }}
          placeholder="Search"
          aria-label="Search"
        />
        {/* Right aligned magnifying glass icon */}
        <button type="submit" className="search-icon-btn" aria-label="Search">
          <svg className="search-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M21.53 20.47l-4.43-4.43a8 8 0 10-1.06 1.06l4.43 4.43a.75.75 0 101.06-1.06zM4.5 10.5a6 6 0 1112 0 6 6 0 01-12 0z" />
          </svg>
        </button>
      </form>
      {open && results.length > 0 && (
        <div className="search-results">
          {results.map(r => {
            // ✅ Guard: only read [0] when images is an array
            const thumb =
              (Array.isArray(r.images) && r.images[0]) ? r.images[0] :
                '/uploads/placeholder.png' // fallback

            // find an accessory that contains ALL query tokens
            const matchAccessory = Array.isArray(r.accessories)
              ? r.accessories.find(a => tokens.every(t => a.toLowerCase().includes(t)))
              : null

            return (
              <Link
                key={r.id}
                to={`/figure/${r.id}`}
                className="search-item"
                onClick={() => setOpen(false)}
                title={r.altTitle || r.name}
              >
                <img
                  className="search-thumb"
                  src={(Array.isArray(r.images) && r.images[0]) ? r.images[0] : '/uploads/placeholder.png'}
                  alt=""
                  loading="lazy"
                />

                {/* Title + optional accessory match line */}
                <div className="search-item-text">
                  <div className="search-item-title">{r.name || r.altTitle}</div>
                  {matchAccessory && (
                    <div className="search-subtle">Accessory: {matchAccessory}</div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
