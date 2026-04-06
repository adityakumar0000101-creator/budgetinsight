import React from 'react'
import { useApp, ROLES } from '../context/AppContext'

const NAV = [
  { id:'overview',     label:'Overview',
    icon:<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
  { id:'transactions', label:'Transactions',
    icon:<svg viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg> },
  { id:'insights',     label:'Insights',
    icon:<svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
]

export default function Sidebar({ activeTab, setActiveTab }) {
  const { role, setRole, darkMode, setDarkMode } = useApp()

  return (
    <aside className="sidebar">
      <div className="sb-top">
        <div className="sb-brand">
          <div className="sb-brand-mark">
            <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <div>
            <span className="sb-brand-name">FinanceIQ</span>
            <span className="sb-brand-sub">v2.0 · live</span>
          </div>
        </div>
        <div className="sb-live">
          <span className="sb-live-dot" />
          MONITORING ACTIVE
        </div>
      </div>

      <p className="sb-section">Navigation</p>

      <nav className="sb-nav">
        {NAV.map(n => (
          <button
            key={n.id}
            className={`sb-link ${activeTab === n.id ? 'on' : ''}`}
            onClick={() => setActiveTab(n.id)}
          >
            <span className="sb-link-ic">{n.icon}</span>
            {n.label}
          </button>
        ))}
      </nav>

      <div className="sb-hr" />

      <div className="sb-footer">
        <div className="role-box">
          <p className="role-box-label">Access Level</p>
          <div className="role-status">
            <span className={`role-dot ${role}`} />
            <span className="role-status-name">{role === ROLES.ADMIN ? 'ADMIN' : 'VIEWER'}</span>
          </div>
          <div className="role-btns">
            <button className={`role-btn ${role === ROLES.VIEWER ? 'on' : ''}`} onClick={() => setRole(ROLES.VIEWER)}>VIEWER</button>
            <button className={`role-btn ${role === ROLES.ADMIN ? 'on' : ''}`} onClick={() => setRole(ROLES.ADMIN)}>ADMIN</button>
          </div>
        </div>

        <button className="theme-btn" onClick={() => setDarkMode(d => !d)}>
          {darkMode
            ? <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>
            : <svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
          }
          {darkMode ? 'LIGHT MODE' : 'DARK MODE'}
        </button>
      </div>
    </aside>
  )
}
