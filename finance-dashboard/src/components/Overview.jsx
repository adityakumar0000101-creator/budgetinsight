import React from 'react'
import { useApp } from '../context/AppContext'
import { monthlyData, categoryData } from '../data/mockData'
import { useCountUp } from '../hooks/useCountUp'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'

const CAT_ICONS = {
  Housing:'🏠', Food:'🍔', Transport:'🚗', Utilities:'⚡',
  Entertainment:'🎬', Health:'💊', Shopping:'🛍', Education:'📚', Income:'💵',
}

const fmt = new Intl.NumberFormat('en-US', { style:'currency', currency:'USD', maximumFractionDigits:0 })

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background:'var(--bg2)', border:'1px solid var(--b2)',
      borderRadius:6, padding:'9px 13px',
      boxShadow:'0 12px 40px rgba(0,0,0,0.7)',
      fontFamily:'var(--mono)', fontSize:11
    }}>
      <p style={{ fontWeight:700, color:'var(--t1)', marginBottom:5, letterSpacing:'0.04em' }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color:p.color, fontWeight:600 }}>
          {p.name.toUpperCase()}: {fmt.format(p.value)}
        </p>
      ))}
    </div>
  )
}

function UsageBar({ label, value, max, color, status }) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div className="usage-bar-wrap">
      <div className="usage-bar-head">
        <span className="usage-bar-label">{label}</span>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <span className={`status-badge ${status}`}>{status.toUpperCase()}</span>
          <span className="usage-bar-val" style={{ color }}>{pct.toFixed(0)}%</span>
        </div>
      </div>
      <div className="usage-bar-track">
        <div className="usage-bar-fill" style={{ width:`${pct}%`, background:color }} />
      </div>
    </div>
  )
}

export default function Overview() {
  const { summary, transactions } = useApp()
  const savingsRate = summary.income > 0
    ? ((summary.balance / summary.income) * 100).toFixed(1) : 0

  const expensePct = summary.income > 0
    ? ((summary.expenses / summary.income) * 100).toFixed(1) : 0

  const animBalance  = useCountUp(summary.balance,  900, 0)
  const animIncome   = useCountUp(summary.income,   900, 0)
  const animExpenses = useCountUp(summary.expenses, 900, 0)
  const animSavings  = useCountUp(parseFloat(savingsRate), 900, 1)

  const fmtAnim = (v) => new Intl.NumberFormat('en-US', { style:'currency', currency:'USD', maximumFractionDigits:0 }).format(v)

  const recent = transactions.slice(0, 6)

  const getStatus = (pct) => {
    if (pct >= 80) return 'critical'
    if (pct >= 60) return 'warning'
    return 'normal'
  }

  return (
    <div className="page">

      <div className="sec-hd">
        <span className="sec-title">KEY METRICS</span>
      </div>

      <div className="metric-grid">
        <div className="metric-card">
          <div className="metric-top">
            <span className="metric-label">NET BALANCE</span>
            <span className="status-badge normal">HEALTHY</span>
          </div>
          <div className="metric-value green">{fmtAnim(animBalance)}</div>
          <div className="metric-sub">income − expenses</div>
        </div>

        <div className="metric-card">
          <div className="metric-top">
            <span className="metric-label">TOTAL INCOME</span>
            <span className="status-badge normal">NORMAL</span>
          </div>
          <div className="metric-value white">{fmtAnim(animIncome)}</div>
          <div className="metric-sub">all income sources</div>
        </div>

        <div className="metric-card red">
          <div className="metric-top">
            <span className="metric-label">TOTAL EXPENSES</span>
            <span className={`status-badge ${parseFloat(expensePct) > 80 ? 'critical' : 'warning'}`}>
              {parseFloat(expensePct) > 80 ? 'HIGH' : 'MODERATE'}
            </span>
          </div>
          <div className="metric-value red">{fmtAnim(animExpenses)}</div>
          <div className="metric-sub">{expensePct}% of income</div>
        </div>

        <div className="metric-card">
          <div className="metric-top">
            <span className="metric-label">SAVINGS RATE</span>
            <span className={`status-badge ${parseFloat(savingsRate) >= 20 ? 'normal' : 'warning'}`}>
              {parseFloat(savingsRate) >= 20 ? 'ON TRACK' : 'LOW'}
            </span>
          </div>
          <div className={`metric-value ${parseFloat(savingsRate) >= 20 ? 'green' : 'yellow'}`}>
            {animSavings}%
          </div>
          <div className="metric-sub">target: ≥ 20%</div>
        </div>
      </div>

      <div className="sec-hd" style={{ marginTop:8 }}>
        <span className="sec-title">FINANCIAL HEALTH</span>
      </div>

      <div className="chart-row" style={{ marginBottom:20 }}>
        <div className="card">
          <div className="card-hd">
            <div>
              <p className="card-title">INCOME UTILIZATION</p>
              <p className="card-desc">How your income is being allocated</p>
            </div>
          </div>
          <UsageBar
            label="EXPENSES"
            value={summary.expenses}
            max={summary.income}
            color="var(--red)"
            status={getStatus(parseFloat(expensePct))}
          />
          <div style={{ height:10 }} />
          <UsageBar
            label="SAVINGS"
            value={summary.balance}
            max={summary.income}
            color="var(--green)"
            status={parseFloat(savingsRate) >= 20 ? 'normal' : 'warning'}
          />
          <div style={{ height:20 }} />
          <p className="card-title" style={{ marginBottom:12 }}>CASH FLOW — 6 MONTHS</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={monthlyData} margin={{ top:4, right:4, left:-16, bottom:0 }} barGap={3}>
              <CartesianGrid strokeDasharray="2 4" stroke="var(--b)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill:'var(--t3)', fontSize:10, fontFamily:'var(--mono)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:'var(--t3)', fontSize:9, fontFamily:'var(--mono)' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}k`} />
              <Tooltip content={<Tip />} cursor={{ fill:'rgba(255,255,255,0.02)' }} />
              <Legend wrapperStyle={{ fontSize:10, paddingTop:8, color:'var(--t3)', fontFamily:'var(--mono)' }} />
              <Bar dataKey="income"   fill="var(--green)" radius={[3,3,0,0]} name="Income"   maxBarSize={24} />
              <Bar dataKey="expenses" fill="var(--red)"   radius={[3,3,0,0]} name="Expenses" maxBarSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-hd">
            <div>
              <p className="card-title">SPENDING SPLIT</p>
              <p className="card-desc">By category this period</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={130}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%"
                innerRadius={38} outerRadius={58}
                paddingAngle={3} dataKey="value" strokeWidth={0}
              >
                {categoryData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip
                formatter={v => [`$${v}`, 'AMOUNT']}
                contentStyle={{ background:'var(--bg2)', border:'1px solid var(--b2)', borderRadius:6, fontSize:10, fontFamily:'var(--mono)' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pie-legend">
            {categoryData.slice(0, 6).map(c => (
              <div key={c.name} className="pie-row">
                <span className="pie-dot" style={{ background:c.color }} />
                <span className="pie-name">{c.name.toUpperCase()}</span>
                <span className="pie-val">${c.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="sec-hd">
        <span className="sec-title">RECENT ACTIVITY</span>
        <span className="card-tag">LAST {recent.length} TRANSACTIONS</span>
      </div>

      <div className="card">
        <div className="recent-list">
          {recent.map(tx => (
            <div key={tx.id} className="recent-row">
              <div className="recent-av" style={{
                background: tx.type === 'income' ? 'var(--green-bg)' : 'var(--red-bg)'
              }}>
                {CAT_ICONS[tx.category] || '💰'}
              </div>
              <div className="recent-info">
                <p className="recent-name">{tx.description}</p>
                <p className="recent-meta">{tx.category.toUpperCase()} · {tx.date}</p>
              </div>
              <span className={`recent-amt ${tx.type}`}>
                {tx.type === 'income' ? '+' : ''}
                {new Intl.NumberFormat('en-US', { style:'currency', currency:'USD' }).format(tx.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
