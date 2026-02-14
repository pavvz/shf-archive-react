// src/components/BrandTitle.jsx
import React from 'react'
import { BRAND_LOGOS } from '../constants/BrandLogos'

export default function BrandTitle({ brand, label }) {
  const src = BRAND_LOGOS[brand]
  return (
    <h1 className="page-title">
      {src ? (
        // Keep accessible name with aria-label; the img has empty alt
        <span aria-label={label || brand}>
          <img className="page-title-logo" src={src} alt="" loading="eager" />
        </span>
      ) : (
        label || brand
      )}
    </h1>
  )
}
