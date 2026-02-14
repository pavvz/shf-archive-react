import React from 'react'
import { Link } from 'react-router-dom'
// If you’re already using 2x images elsewhere, you can import this and
// uncomment the srcSet lines below:
// import { to2x } from '../utils/to2x'

export default function FigureCard({ fig }) {
  const img = fig.images?.[0] || '/uploads/placeholder.jpg'
  // const img2x = to2x ? to2x(img) : img

  return (
    <Link to={`/figure/${fig.id}`} className="card" title={fig.name}>
      <div
        className="thumb"
        style={{
          // per-figure CSS variables
          '--origin-x': `${fig.originX ?? 50}%`,
          '--origin-y': `${fig.originY ?? 50}%`,
          '--nudge-y': `${fig.nudgeY ?? 0}%`,
          '--nudge-zoom': fig.nudgeZoom ?? 1,
        }}
      >
        <img
          src={img}
          // If you’re using the to2x helper, swap to this:
          // srcSet={`${img} 1x, ${img2x} 2x`}
          alt={fig.name}
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          loading="lazy"
        />
      </div>
      <div className="title">{fig.name}</div>
    </Link>
  )
}
