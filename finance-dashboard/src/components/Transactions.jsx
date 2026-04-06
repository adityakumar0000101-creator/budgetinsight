import React, { useState } from 'react'
import { useApp, ROLES } from '../context/AppContext'

const CATS = ['Income','Housing','Food','Transport','Utilities','Entertainment','Health','Shopping','Education']
const CAT_ICONS = { Housing:'🏠', Food:'🍔', Transport:'🚗', Utilities:'⚡', Entertainment:'🎬', Health:'💊', Shopping:'🛍', Education:'📚', Income:'💵' }
const CAT_COLORS = { Housing:'#6366f1', Food:'#f59e0b', Transport:'#22c55e', Utilities:'#3b82f6', Entertainment:'#ec4899', Health:'#14b8a6', Shopping:'#f97316', Education:'#a855f7', Income:'#22c55e' }
const EMPTY = { description:'', amount:'', category:'Food', type:'expense', date:'' }
const fmt = new Intl.NumberFormat('en-US', { style:'currency', currency:'USD' })

export default function Transactions() {
  const { role, filteredTransactions, transactions, filterType, setFilterType, filterCategory, setFilterCategory, searchQuery, setSearchQuery, addTransaction, deleteTransaction } = useApp()
  const [showForm, setShowForm]           = useState(false)
  const [form, setForm]                   = useState(EMPTY)
  const [formError, setFormError]         = useState('')
  const [exportMsg, setExportMsg]         = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const submit = (e) => {
    e.preventDefault()
    if (!form.description || !form.amount || !form.date) { setFormError('All fields required.'); return }
    const amount = parseFloat(form.amount)
    if (isNaN(amount) || amount <= 0) { setFormError('Amount must be positive.'); return }
    addTransaction({ ...form, amount: form.type === 'expense' ? -Math.abs(amount) : Math.abs(amount) })
    setForm(EMPTY); setShowForm(false); setFormError('')
  }

  const exportCSV = () => {
    const rows = filteredTransactions.map(t => [t.date, `"${t.description}"`, t.category, t.type, t.amount].join(','))
    const csv = ['Date,Description,Category,Type,Amount', ...rows].join('\n')
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([csv], { type:'text/csv' })), download:'transactions.csv' })
    a.click()
    setExportMsg('✓ EXPORTED'); setTimeout(() => setExportMsg(''), 2500)
  }

  const handleDelete = (id) => {
    if (deleteConfirm === id) { deleteTransaction(id); setDeleteConfirm(null) }
    else { setDeleteConfirm(id); setTimeout(() => setDeleteConfirm(null), 3000) }
  }

  const allCats = [...new Set(transactions.map(t => t.category))]

  return (
    <div className="page">
      <div className="ph">
        <div>
          <h1 className="ph-title">Transactions</h1>
          <p className="ph-sub">LEDGER · {filteredTransactions.length} OF {transactions.length} RECORDS</p>
        </div>
        <div className="ph-actions">
          <button className="btn btn-ghost" onClick={exportCSV}>{exportMsg || '↓ EXPORT CSV'}</button>
          {role === ROLES.ADMIN && (
            <button className={`btn ${showForm ? 'btn-ghost' : 'btn-primary'}`} onClick={() => { setShowForm(s => !s); setFormError('') }}>
              {showForm ? '✕ CANCEL' : '+ NEW ENTRY'}
            </button>
          )}
        </div>
      </div>

      {role === ROLES.ADMIN && showForm && (
        <form className="add-form" onSubmit={submit}>
          <p className="add-form-title">NEW TRANSACTION</p>
          {formError && (
            <div className="form-err">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {formError}
            </div>
          )}
          <div className="add-form-grid">
            {[
              { label:'DESCRIPTION *', key:'description', type:'text',   ph:'e.g. Grocery Store' },
              { label:'AMOUNT *',      key:'amount',      type:'number', ph:'0.00' },
              { label:'DATE *',        key:'date',        type:'date',   ph:'' },
            ].map(f => (
              <div key={f.key} className="ff">
                <label className="ff-label">{f.label}</label>
                <input className="fi" type={f.type} placeholder={f.ph} min={f.type==='number'?'0':undefined} step={f.type==='number'?'0.01':undefined} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
              </div>
            ))}
            <div className="ff">
              <label className="ff-label">CATEGORY</label>
              <select className="fi" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                {CATS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="ff">
              <label className="ff-label">TYPE</label>
              <select className="fi" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                <option value="income">INCOME</option>
                <option value="expense">EXPENSE</option>
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">SAVE ENTRY</button>
            <button type="button" className="btn btn-ghost" onClick={() => { setShowForm(false); setFormError('') }}>CANCEL</button>
          </div>
        </form>
      )}

      <div className="fbar">
        <div className="fbar-search">
          <span className="fbar-search-ic"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
          <input className="fi fbar-input" placeholder="SEARCH TRANSACTIONS..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <div className="fbar-sep" />
        <span className="fbar-label">TYPE</span>
        <select className="fi" style={{ width:'auto' }} value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="all">ALL</option>
          <option value="income">INCOME</option>
          <option value="expense">EXPENSE</option>
        </select>
        <span className="fbar-label">CATEGORY</span>
        <select className="fi" style={{ width:'auto' }} value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
          <option value="all">ALL</option>
          {allCats.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
        </select>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="empty">
          <div className="empty-icon"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div>
          <p className="empty-title">No records found</p>
          <p className="empty-desc">ADJUST FILTERS OR SEARCH QUERY</p>
        </div>
      ) : (
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>DATE</th>
                <th>DESCRIPTION</th>
                <th>CATEGORY</th>
                <th>TYPE</th>
                <th>AMOUNT</th>
                {role === ROLES.ADMIN && <th style={{ textAlign:'center' }}>DELETE</th>}
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(tx => {
                const color = CAT_COLORS[tx.category] || '#6366f1'
                const icon  = CAT_ICONS[tx.category]  || '💰'
                const armed = deleteConfirm === tx.id
                return (
                  <tr key={tx.id}>
                    <td className="tbl-date">{tx.date}</td>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                        <div style={{ width:26, height:26, borderRadius:6, flexShrink:0, background:`${color}15`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12 }}>{icon}</div>
                        <span className="tbl-name">{tx.description}</span>
                      </div>
                    </td>
                    <td>
                      <span className="cat-tag" style={{ background:`${color}12`, color, border:`1px solid ${color}25` }}>
                        {tx.category.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <span className={`type-tag ${tx.type}`}>
                        {tx.type === 'income' ? '↑' : '↓'} {tx.type.toUpperCase()}
                      </span>
                    </td>
                    <td className={`amt ${tx.type}`}>
                      {tx.type === 'income' ? '+' : ''}{fmt.format(tx.amount)}
                    </td>
                    {role === ROLES.ADMIN && (
                      <td style={{ textAlign:'center' }}>
                        <button className={`del-btn ${armed ? 'armed' : ''}`} onClick={() => handleDelete(tx.id)} title={armed ? 'Confirm delete' : 'Delete'}>
                          {armed ? '✓' : '×'}
                        </button>
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
