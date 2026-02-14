import React, { createContext, useContext, useEffect, useState } from 'react'

const SettingsContext = createContext(null)

export function SettingsProvider({ children }){
  const [currency, setCurrency] = useState(() => localStorage.getItem('currency') || 'USD')
  useEffect(()=> { localStorage.setItem('currency', currency) }, [currency])
  return (
    <SettingsContext.Provider value={{ currency, setCurrency }}>
      {children}
    </SettingsContext.Provider>
  )
}
export function useSettings(){ return useContext(SettingsContext) }
