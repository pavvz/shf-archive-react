import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App'
import Reference from './pages/Reference'
import FigureDetail from './pages/FigureDetail'
import Checklist from './pages/Checklist'
//import ThirdPartyLanding from './pages/ThirdPartyLanding'
import ThirdPartyBrand from './pages/ThirdPartyBrand'
//import News from './pages/News'
import Home from './pages/Home'
import { SettingsProvider } from './state/SettingsContext'
import { DataProvider } from './state/DataContext'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SettingsProvider>
      <DataProvider>
        <Router>
          <Routes>
            <Route element={<App />}>
              <Route path="/" element={<Home />} />
              <Route path="/shfiguarts" element={<Reference />} />
              <Route path="/figure/:id" element={<FigureDetail />} />
              <Route path="/checklist" element={<Checklist />} />
              <Route path="/third-party/:brand" element={<ThirdPartyBrand />} />
            </Route>
          </Routes>
        </Router>
      </DataProvider>
    </SettingsProvider>
  </React.StrictMode>
)
