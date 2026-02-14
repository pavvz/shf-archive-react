import React, { createContext, useContext, useMemo } from 'react'
import rawFigures from '../data/figures.json'

const DataContext = createContext(null)

export function DataProvider({ children }) {
  // Normalize dates once
  const figures = useMemo(() =>
    rawFigures.map((f, i) => {
      return {
        id: f.id ?? String(i + 1),
        name: f.name,
        altTitle: f.altTitle || '',
        brand: f.brand,
        series: f.series,
        images: f.images || [],


        id: f.id ?? String(i + 1),
        name: f.name,
        badgeIcon: f.badgeIcon ?? null,
        badgeTitle: f.badgeTitle ?? null,
        altTitle: f.altTitle ?? null,
        headerImage: f.headerImage ?? null,
        series: f.series || 'Dragon Ball',
        brand: f.brand || 'S.H.Figuarts',
        type: f.type, // 'Retail' | 'Event Exclusive' | 'Tamashii Store Exclusive'
        event: f.event ?? null,
        releaseDate: f.releaseDate, // ISO date string
        priceUSD: f.priceUSD ?? null,
        priceJPY: f.priceJPY ?? null,
        images: f.images && f.images.length ? f.images : ['https://via.placeholder.com/800x800?text=No+Image'],
        heightIn: f.heightIn ?? null,
        heightMm: f.heightMm ?? (f.heightIn != null ? Math.round(Number(f.heightIn) * 25.4) : null), // auto-calc mm if inches provided and mm missing (round to whole mm)
        materials: Array.isArray(f.materials) ? f.materials : (f.materials ? [f.materials] : []),
        accessories: Array.isArray(f.accessories)
          ? f.accessories.filter(Boolean)
          : (f.accessories ? [f.accessories] : []),
        originX: typeof f.originX === 'number' ? f.originX : 55,
        originY: typeof f.originY === 'number' ? f.originY : 15,
        nudgeY: typeof f.nudgeY === 'number' ? f.nudgeY : 0,
        nudgeZoom: typeof f.nudgeZoom === 'number' ? f.nudgeZoom : 2,
      }
    }), [rawFigures])

  const brands = useMemo(() => {
    const s = new Set(figures.map(f => f.brand))
    return Array.from(s).sort()
  }, [figures])

  return (
    <DataContext.Provider value={{ figures, brands }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() { return useContext(DataContext) }
