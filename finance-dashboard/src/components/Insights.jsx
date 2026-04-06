import React, { useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { categoryData } from '../data/mockData'
import { useCountUp } from '../hooks/useCountUp'

const fmt = v => new Intl.NumberFormat('en-US', { style:'currency', currency:'USD' }).format(v)

const IC = {
  savings: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 100 20A10 10 0 0012 2z"/><path d="M12 6v6l4 2"/></svg>,
  avg:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
  top:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  low:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>,
  inc:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  exp:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>,
  ok:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  warn:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  info:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  bulb:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0018 8 6 6 0 006 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 018.91 14"/></svg>,
}

export default function Insights() {
  const { transactions, summary } = useApp()

  const d = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense')
    const incomes  = transactions.filter(t => t.type === 'income')
    const byCategory = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount)
      return acc
    }, {})
    const sorted  = Object.entries(byCategory).sort((a, b) => b[1] - a[1])
    const highest = sorted[0]
    const lowest  = sorted[sorted.length - 1]
    const savingsRate = summary.income > 0
      ? (((summary.income - summary.expenses) / summary.income) * 100).toFixed(1) : 0
    const avgExpense = expenses.length > 0
      ? (summary.expenses / expenses.length).toFixed(2) : 0
    return { sorted, highest, lowest, savingsRate, avgExpense, expenseCount: expenses.length, incomeCount: incomes.length }
  }, [transactions, summary])

  const maxVal = d.sorted[0]?.[1] || 1
  const isGood = parseFloat(d.savingsRate) >= 20

  const kpis = [
    { icon:IC.savings, label:'SAVINGS RATE',     value:`${d.savingsRate}%`,  sub:'of income saved',       line:'#22c55e', bg:'var(--green-bg)', color:isGood?'green':'red' },
    { icon:IC.avg,     label:'AVG EXPENSE',       value:`$${d.avgExpense}`,   sub:'per transaction',        line:'#6366f1', bg:'var(--blue-bg)',  color:'blue' },
    d.highest && { icon:IC.top, label:'TOP CATEGORY',    value:d.highest[0],         sub:`${fmt(d.highest[1])} total`, line:'#ef4444', bg:'var(--red-bg)',    color:'red',    sm:true },
    d.lowest  && { icon:IC.low, label:'LOWEST CATEGORY', value:d.lowest[0],          sub:`${fmt(d.lowest[1])} total`,  line:'#eab308', bg:'var(--yellow-bg)', color:'yellow', sm:true },
    { icon:IC.inc,     label:'INCOME TXNS',       value:d.incomeCount,        sub:'this period',            line:'#22c55e', bg:'var(--green-bg)', color:'green' },
    { icon:IC.exp,     label:'EXPENSE TXNS',      value:d.expenseCount,       sub:'this period',            line:'#ec4899', bg:'var(--red-bg)',   color:'pink' },
  ].filter(Boolean)

  const obs = [
    { type:isGood?'ok':'warn', color:isGood?'var(--green)':'var(--yellow)', bg:isGood?'var(--green-bg)':'var(--yellow-bg)',
      text:<>Savings rate is <strong>{d.savingsRate}%</strong> — {isGood ? 'above the 20% benchmark. Excellent.' : 'below 20% target. Reduce discretionary spending.'}</> },
    d.highest && { type:'info', color:'var(--blue)', bg:'var(--blue-bg)',
      text:<><strong>{d.highest[0]}</strong> is the largest expense at <strong>{fmt(d.highest[1])}</strong> ({summary.expenses > 0 ? ((d.highest[1]/summary.expenses)*100).toFixed(0) : 0}% of total).</> },
    { type:'info', color:'var(--green)', bg:'var(--green-bg)',
      text:<><strong>{d.incomeCount}</strong> income txns (<strong>{fmt(summary.income)}</strong>) and <strong>{d.expenseCount}</strong> expense txns (<strong>{fmt(summary.expenses)}</strong>) this period.</> },
    { type:'bulb', color:'var(--yellow)', bg:'var(--yellow-bg)',
      text:<>Avg expense is <strong>${d.avgExpense}</strong> — {parseFloat(d.avgExpense) > 100 ? 'larger, less frequent purchases.' : 'smaller, more frequent purchases.'}</> },
  ].filter(Boolean)

  return (
    <div className="page">

      <div className="sec-hd">
        <span className="sec-title">PERFORMANCE METRICS</span>
      </div>

      <div className="kpi-grid">
        {kpis.map((k, i) => (
          <div key={i} className="kpi-card">
            <div className="kpi-line" style={{ background:k.line }} />
            <div className="kpi-icon" style={{ background:k.bg, color:k.line }}>{k.icon}</div>
            <p className="kpi-label">{k.label}</p>
            <p className={`kpi-value ${k.color}`} style={k.sm ? { fontSize:16 } : {}}>{k.value}</p>
            <p className="kpi-sub">{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="sec-hd" style={{ marginTop:8 }}>
        <span className="sec-title">SPENDING BREAKDOWN</span>
      </div>

      <div className="card" style={{ marginBottom:12 }}>
        {d.sorted.length === 0 ? (
          <p style={{ color:'var(--t3)', fontSize:11, fontFamily:'var(--mono)' }}>NO EXPENSE DATA</p>
        ) : (
          <div className="bar-list">
            {d.sorted.map(([cat, val]) => {
              const pct      = ((val / maxVal) * 100).toFixed(1)
              const totalPct = summary.expenses > 0 ? ((val / summary.expenses) * 100).toFixed(0) : 0
              const color    = categoryData.find(c => c.name === cat)?.color || '#6366f1'
              return (
                <div key={cat} className="bar-row">
                  <span className="bar-lbl">{cat.toUpperCase()}</span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width:`${pct}%`, background:color }} />
                  </div>
                  <span className="bar-pct">{totalPct}%</span>
                  <span className="bar-amt">{fmt(val)}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="sec-hd">
        <span className="sec-title">SYSTEM OBSERVATIONS</span>
      </div>

      <div className="card">
        <div className="obs-list">
          {obs.map((o, i) => (
            <div key={i} className="obs-item">
              <div className="obs-icon" style={{ background:o.bg, color:o.color }}>{IC[o.type]}</div>
              <p className="obs-text">{o.text}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
