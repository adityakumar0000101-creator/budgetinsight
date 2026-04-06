import React, { useEffect } from 'react'
import { AppProvider } from './context/AppContext'
import Layout from './components/Layout'

const TILT_SEL = '.metric-card, .card, .kpi-card'
const STR = 6

export default function App() {
  useEffect(() => {
    const onMove = (e) => {
      const el = e.target.closest(TILT_SEL)
      if (!el) return
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width - 0.5
      const y = (e.clientY - r.top) / r.height - 0.5
      el.style.transform = `perspective(600px) rotateX(${-y * STR}deg) rotateY(${x * STR}deg) translateY(-4px)`
    }
    const onLeave = (e) => {
      const el = e.target.closest(TILT_SEL)
      if (!el) return
      el.style.transform = ''
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave, true)
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave, true)
    }
  }, [])

  return (
    <AppProvider>
      <Layout />
    </AppProvider>
  )
}
