import React, { useMemo, useRef, useState } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useData } from './state/DataContext'
import { useSettings } from './state/SettingsContext'
import SearchBar from './components/SearchBar'

export default function App() {
  const { figures } = useData()
  const brands = useMemo(() => {
    const set = new Set(figures.filter(f => f.brand && f.brand !== 'S.H.Figuarts').map(f => f.brand))
    return Array.from(set).sort()
    const location = useLocation()
    useEffect(() => {
      setOpenDrop(false)   // close dropdown on route change
    }, [location.pathname])
  }, [figures])

  const [openDrop, setOpenDrop] = useState(false)

  return (
    <div>
      <header className="site-header">
        <div className="container nav-row">
          <div className="logo-wrap">
            <a href="/">
              <img className="logo-img" src="/uploads/logo.png" alt="Dragon Ball Action Figures" />
            </a>
          </div>
          <nav className="site-menu">
            <Link to="/shfiguarts">S.H.Figuarts</Link>
            <Link to="/checklist">Checklist</Link>

            <div className={['dropdown', openDrop ? 'open' : ''].join(' ')}>
              <button
                type="button"
                className="menu-trigger"
                onClick={() => setOpenDrop(o => !o)}
                aria-haspopup="true"
                aria-expanded={openDrop}
              >
                Third Party
              </button>
              <div className="dropdown-list">
                {brands.map(b => (
                  <Link
                    key={b}
                    to={`/third-party/${encodeURIComponent(b)}`}
                    onClick={() => setOpenDrop(false)}
                  >
                    {b}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
          <div className="tools">
            <SearchBar />
            <Social />
          </div>
        </div>
      </header>
      <main className="container" style={{ padding: '18px 0 40px' }}>
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="container" style={{ textAlign: 'center' }}>
          © {new Date().getFullYear()} <Link to="/">dragonballactionfigures.com</Link>. All Rights Reserved.
          <div className="container" style={{ textAlign: 'center' }}>
            © BIRD STUDIO/SHUEISHA, TOEI ANIMATION All Rights Reserved., TM & © Toho Co., Ltd. © Warner Bros. Entertainment Inc.
          </div>
        </div>
      </footer>
    </div>
  )
}

function Social() {
  return (
    <div className="social">
      <a href="https://www.youtube.com/@Pav_Plays" target="_blank" rel="noreferrer" title="" aria-label="YouTube">
        <img src="/uploads/youtube.png" alt="YouTube" width="25" height="25" />
      </a>
      <a href="https://www.instagram.com/pavplays/" target="_blank" rel="noreferrer" title="" aria-label="Instagram">
        <img src="/uploads/instagram.png" alt="Instagram" width="25" height="25" />
      </a>
    </div>
  )
}
