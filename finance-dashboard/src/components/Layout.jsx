import React, { useState, useRef } from 'react'
import { useApp } from '../context/AppContext'
import Sidebar from './Sidebar'
import Overview from './Overview'
import Transactions from './Transactions'
import Insights from './Insights'

const META = {
  overview:     { title:'Overview',     sub:'FINANCIAL MONITORING DASHBOARD' },
  transactions: { title:'Transactions', sub:'TRANSACTION LEDGER' },
  insights:     { title:'Insights',     sub:'ANALYTICS & OBSERVATIONS' },
}

export default function Layout() {
  const [tab, setTab] = useState('overview')
  const [visible, setVisible] = useState(true)
  const { darkMode } = useApp()
  const m = META[tab]
  const prevTab = useRef(tab)

  const switchTab = (newTab) => {
    if (newTab === tab) return
    setVisible(false)
    setTimeout(() => {
      prevTab.current = newTab
      setTab(newTab)
      setVisible(true)
    }, 120)
  }

  const now = new Date().toLocaleString('en-US', {
    month:'short', day:'numeric', year:'numeric',
    hour:'2-digit', minute:'2-digit'
  })

  return (
    <div className={`shell ${darkMode ? '' : 'light'}`}>
      <Sidebar activeTab={tab} setActiveTab={switchTab} />
      <div className="main">
        <div className="topbar">
          <div className="topbar-left">
            <span className="topbar-title">{m.title}</span>
            <span className="topbar-sep" />
            <span className="topbar-sub">{m.sub}</span>
          </div>
          <div className="topbar-right">
            <span className="topbar-tag">
              <span className="dot" />
              LIVE · {now}
            </span>
          </div>
        </div>
        <div style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.12s ease' }}>
          {tab === 'overview'     && <Overview />}
          {tab === 'transactions' && <Transactions />}
          {tab === 'insights'     && <Insights />}
        </div>
      </div>
    </div>
  )
}
