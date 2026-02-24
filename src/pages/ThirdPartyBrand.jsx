import React, { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useData } from '../state/DataContext'
import SortDropdown, { SORTS, sortFigures } from '../components/SortDropdown'
import FigureCard from '../components/FigureCard'
import BrandBlurb from '../components/BrandBlurb'

export default function ThirdPartyBrand() {
  const { brand } = useParams()
  const { figures } = useData()
  const [sortMode, setSortMode] = useState(SORTS.NEW_TO_OLD)

  const brandName = decodeURIComponent(brand)

  const seoTitle = `${brandName} — Dragon Ball Action Figures`
  const seoDescription = `Browse info on all ${brandName} Dragon Ball action figures.`
  const canonicalUrl = `https://dragonballactionfigures.com/third-party/${encodeURIComponent(brandName)}`

  const list = useMemo(() => {
    return sortFigures(figures.filter(f => f.brand === brandName), sortMode)
  }, [figures, brandName, sortMode])

  return (
    <section>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <link rel="canonical" href={canonicalUrl} />

        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:url" content={canonicalUrl} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
      </Helmet>

      <h1 style={{ margin: 0 }}>{brandName}</h1>

      <div className="brand-intro-row">
        <BrandBlurb brand={brandName} />
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
