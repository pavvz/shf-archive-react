import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../state/DataContext'
import SortDropdown, { SORTS, sortFigures } from '../components/SortDropdown'
import { Helmet } from "react-helmet-async";

export default function Checklist() {
  const { figures } = useData()

  // Persist owned state
  const KEY = 'owned-checklist-v1'
  const [owned, setOwned] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || {} } catch { return {} }
  })
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(owned)) }, [owned])

  // Sorting
  const [sortMode, setSortMode] = useState(SORTS.NEW_TO_OLD)

  // Only S.H.Figuarts on this page
  const shf = useMemo(
    () => figures.filter(f => f.brand === 'S.H.Figuarts'),
    [figures]
  )
  const sorted = useMemo(
    () => sortFigures(shf, sortMode),
    [shf, sortMode]
  )

  // --- NEW: Check/Uncheck All helpers
  const allChecked = useMemo(
    () => shf.length > 0 && shf.every(f => !!owned[f.id]),
    [shf, owned]
  )

  const setAll = (checked) => {
    setOwned(prev => {
      const next = { ...prev }
      // apply to all S.H.Figuarts on the checklist
      shf.forEach(f => { next[f.id] = checked })
      return next
    })
  }

  const toggleAll = () => setAll(!allChecked)

  // Individual toggle
  const toggle = (id) => setOwned(prev => ({ ...prev, [id]: !prev[id] }))

  const countOwned = useMemo(() => Object.values(owned).filter(Boolean).length, [owned])

  return (
    <section>
      <Helmet>
        <title>Checklist - Dragon Ball Action Figures</title>
        <meta
          name="description"
          content="Track your S.H.Figuarts Dragon Ball collection."
        />
      </Helmet>

      <div className="sort-row">
        <h1 style={{ margin: 0 }}>S.H.Figuarts Checklist</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="badge">{countOwned} / {shf.length} owned</div>

          {/*Check/Uncheck All toggle */}
          <button
            className="badge"
            onClick={toggleAll}
            title={allChecked ? 'Uncheck all' : 'Check all'}
            style={{ cursor: 'pointer' }}
          >
            {allChecked ? 'Uncheck all' : 'Check all'}
          </button>

          <SortDropdown value={sortMode} onChange={setSortMode} />
        </div>
      </div>

      <div className="grid-figs">
        {sorted.map(fig => (
          <div key={fig.id} className="card">
            {/* Whole card links to the figure page */}
            <Link
              to={`/figure/${fig.id}`}
              title={fig.name}
              style={{ display: 'block', color: 'inherit' }}
            >
              <div
                className="thumb"
                style={{
                  '--origin-x': `${fig.originX ?? 50}%`,
                  '--origin-y': `${fig.originY ?? 50}%`,
                  '--nudge-y': `${fig.nudgeY ?? 0}%`,
                  '--nudge-zoom': fig.nudgeZoom ?? 1,
                }}
              >
                <img
                  src={fig.images?.[0] || '/uploads/placeholder.jpg'}
                  alt={fig.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  loading="lazy"
                />
              </div>
              <div className="title">{fig.name}</div>
            </Link>

            {/* Checkbox overlay (not inside the Link) */}
            <label
              className="check-overlay"
              onClick={e => e.stopPropagation()}
              onMouseDown={e => e.stopPropagation()}
            >
              <input
                type="checkbox"
                checked={!!owned[fig.id]}
                onChange={() => toggle(fig.id)}
              />
              Owned
            </label>
          </div>
        ))}
      </div>
    </section>
  )
}
