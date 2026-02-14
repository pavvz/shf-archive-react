// src/pages/Home.jsx
import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../state/DataContext'
import HeroCarousel from '../components/HeroCarousel'
import FigureCard from '../components/FigureCard'
import BrandTitle from '../components/BrandTitle'
import BrandBlurb from '../components/BrandBlurb'
import { Helmet } from "react-helmet-async";

const BRAND_ORDER = ['S.H.Figuarts', 'Demoniacal Fit', 'Kong Studios', 'Tonsen Arttoys', 'Black Hole Toys'] // extend as needed

function brandLink(brand) {
  return brand === 'S.H.Figuarts'
    ? '/shfiguarts'                            // adjust if your SHF route is different
    : `/third-party/${encodeURIComponent(brand)}`
}

export default function Home() {
  const { figures } = useData()

  // group by brand and sort recent first
  const byBrand = useMemo(() => {
    const map = {}
    for (const f of figures) {
      if (!map[f.brand]) map[f.brand] = []
      map[f.brand].push(f)
    }
    for (const b of Object.keys(map)) {
      map[b].sort((a, b) => (new Date(b.releaseDate || 0)) - (new Date(a.releaseDate || 0)))
    }
    return map
  }, [figures])

  const orderedBrands = BRAND_ORDER.filter(b => byBrand[b]?.length)
    .concat(Object.keys(byBrand).filter(b => !BRAND_ORDER.includes(b)))

  return (
    <>
      <Helmet>
        <title>Dragon Ball Action Figures</title>
        <meta
          name="description"
          content="The #1 database for S.H.Figuarts and third party Dragon Ball action figures."
        />
        <link rel="canonical" href="https://dragonballactionfigures.com/" />
      </Helmet>

      <main className="home">
        {/* HERO */}
        <HeroCarousel figures={figures} fullBleed fullScreen />

        {/* Tagline + description */}
        <p className="home-tagline">The #1 database for Dragon Ball action figures</p>
        <p className="home-desc">
          Here you can find the most accurate, detailed, and up-to-date information on all S.H.Figuarts and third party Dragon Ball action figures.
          You can search for any figure in the database either by name or accessories.
          You can also sort and track your S.H.Figuarts collection with an interactable checklist that keeps your selections saved when revisting the site.
          Notice any incorrect information that needs correcting or have a suggestion on how the site can be improved? Please send an email to dragonballactionfigures@gmail.com or by messaging me on Instagram @pavplays.
        </p>

        {/* Brand sections */}
        {orderedBrands.map(brand => {
          const list = (byBrand[brand] || []).slice(0, 6)
          if (!list.length) return null
          return (
            <section key={brand} className="home-brand-section">
              <div className="home-brand-header">
                <h1 style={{ margin: 1 }}>{brand}</h1>
              </div>

              <div className="grid-figs">
                {list.map(f => <FigureCard key={f.id} fig={f} />)}
              </div>

              <div className="home-view-all">
                <Link className="btn" to={brandLink(brand)}>View All</Link>
              </div>
            </section>
          )
        })}

        <div className="home-bottom">
          <button
            className="btn back-to-top"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Back to Top
          </button>
        </div>
      </main>
    </>
  )
}
