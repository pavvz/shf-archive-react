import React, { useMemo, useState } from 'react'
import { useData } from '../state/DataContext'
import SortDropdown, { SORTS, sortFigures } from '../components/SortDropdown'
import FigureCard from '../components/FigureCard'
import BrandBlurb from '../components/BrandBlurb'
import { Helmet } from "react-helmet-async";

<Helmet>
  <title>S.H.Figuarts - Dragon Ball Action Figures</title>
  <meta
    name="description"
    content="Browse info on all S.H.Figuarts Dragon Ball action figures."
  />
</Helmet>

export default function Reference(){
  const { figures } = useData()
  const [sortMode, setSortMode] = useState(SORTS.NEW_TO_OLD)

  const sorted = useMemo(() => sortFigures(figures.filter(f => f.brand === 'S.H.Figuarts'), sortMode), [figures, sortMode])

return (
    <section>
      <h1 style={{margin:0}}>S.H.Figuarts</h1>

      <div className="brand-intro-row">
        <BrandBlurb brand="S.H.Figuarts" />
        <div className="brand-intro-controls">
          <SortDropdown value={sortMode} onChange={setSortMode} />
        </div>
      </div>

      <div className="grid-figs">
        {sorted.map(fig => <FigureCard key={fig.id} fig={fig} />)}
      </div>
    </section>
  )
}