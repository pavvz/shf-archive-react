import React from 'react'

export const SORTS = {
  NEW_TO_OLD: 'NEW_TO_OLD',
  OLD_TO_NEW: 'OLD_TO_NEW',
  AZ: 'AZ',
  ZA: 'ZA',
  TYPE: 'TYPE',
  SERIES_AZ: 'SERIES_AZ',
  SERIES_ZA: 'SERIES_ZA'
}

export default function SortDropdown({ value, onChange }){
  return (
    <select className="select" value={value} onChange={e=> onChange(e.target.value)}>
      <option value={SORTS.NEW_TO_OLD}>Release date — New to Old</option>
      <option value={SORTS.OLD_TO_NEW}>Release date — Old to New</option>
      <option value={SORTS.AZ}>Alphabetical — A → Z</option>
      <option value={SORTS.ZA}>Alphabetical — Z → A</option>
      <option value={SORTS.TYPE}>Figure Type — Retail / Premium Bandai / Event / Tamashii Store / V-Jump</option>
      <option value={SORTS.SERIES_AZ}>Series — A → Z</option>
      <option value={SORTS.SERIES_ZA}>Series — Z → A</option>
    </select>
  )
}

const safe = s => (s ?? '').toString().trim()
const titleKey = f => safe(f.altTitle) || safe(f.name)

export function sortFigures(figs, mode){
  const arr = [...figs]
  switch(mode){
    case SORTS.NEW_TO_OLD:
      return arr.sort((a,b)=> new Date(b.releaseDate) - new Date(a.releaseDate))
    case SORTS.OLD_TO_NEW:
      return arr.sort((a,b)=> new Date(a.releaseDate) - new Date(b.releaseDate))
    case SORTS.AZ:
      return arr.sort((a,b)=> {
        const t = titleKey(a).localeCompare(titleKey(b), undefined, { sensitivity: 'base' })
        if (t !== 0) return t
        // tie-breaker: newest first for stability
        return new Date(b.releaseDate) - new Date(a.releaseDate)
      })
    case SORTS.ZA:
      return arr.sort((a,b)=> {
        const t = titleKey(b).localeCompare(titleKey(a), undefined, { sensitivity: 'base' })
        if (t !== 0) return t
        return new Date(b.releaseDate) - new Date(a.releaseDate)
      })
    case SORTS.TYPE: {
      const order = { 'Retail': 0, 'Premium Bandai Exclusive': 1, 'Event Exclusive': 2, 'Tamashii Store Exclusive': 3, 'V-Jump Exclusive': 4 }
      return arr.sort((a,b)=> {
        const t = (order[a.type] ?? 99) - (order[b.type] ?? 99)
        if (t !== 0) return t
        // within type, sort by newest to oldest
        return new Date(b.releaseDate) - new Date(a.releaseDate)
      })
    }
    case SORTS.SERIES_AZ:
      return arr.sort((a,b)=> {
        const s = (a.series || '').localeCompare(b.series || '')
        if (s !== 0) return s
        // tie-breaker within a series: newest first
        return new Date(b.releaseDate) - new Date(a.releaseDate)
        // (or: a.name.localeCompare(b.name) if you prefer name tie-breaker)
      })
    case SORTS.SERIES_ZA:
      return arr.sort((a,b)=> {
        const s = (b.series || '').localeCompare(a.series || '')
        if (s !== 0) return s
        return new Date(b.releaseDate) - new Date(a.releaseDate)
      })
    default: return arr
  }
}
