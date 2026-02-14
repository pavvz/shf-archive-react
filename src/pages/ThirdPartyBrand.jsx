import React, { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useData } from '../state/DataContext'
import SortDropdown, { SORTS, sortFigures } from '../components/SortDropdown'
import FigureCard from '../components/FigureCard'
import BrandBlurb from '../components/BrandBlurb'

export default function ThirdPartyBrand() {
  const { brand } = useParams()
  const { figures } = useData()
  const [sortMode, setSortMode] = useState(SORTS.NEW_TO_OLD)

  const list = useMemo(() => {
    return sortFigures(figures.filter(f => f.brand === decodeURIComponent(brand)), sortMode)
  }, [figures, brand, sortMode])

  return (
    <section>
      <h1 style={{ margin: 0 }}>{decodeURIComponent(brand)}</h1>
      
      <div className="brand-intro-row">
        <BrandBlurb brand={decodeURIComponent(brand)} />
        <div className="brand-intro-controls">
          <SortDropdown value={sortMode} onChange={setSortMode} />
        </div>
      </div>

      <div className="grid-figs">
        {list.map(fig => (<FigureCard key={fig.id} fig={fig} />))}
      </div>
    </section>
  )
}
