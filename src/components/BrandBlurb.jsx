// src/components/BrandBlurb.jsx
import React from 'react'
import { BRAND_DESCRIPTIONS } from '../constants/BrandDescriptions'

export default function BrandBlurb({ brand, text }) {
  const content = text ?? BRAND_DESCRIPTIONS[brand]
  if (!content) return null
  return <p className="brand-blurb">{content}</p>
}