import React, { createContext, useContext, useState, useMemo } from 'react'
import { transactions as initialTransactions } from '../data/mockData'

const AppContext = createContext(null)

export const ROLES = { ADMIN: 'admin', VIEWER: 'viewer' }

export function AppProvider({ children }) {
  const [role, setRole] = useState(ROLES.ADMIN)
  const [transactions, setTransactions] = useState(initialTransactions)
  const [filterType, setFilterType] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [darkMode, setDarkMode] = useState(true)

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchType = filterType === 'all' || t.type === filterType
      const matchCategory = filterCategory === 'all' || t.category === filterCategory
      const matchSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchType && matchCategory && matchSearch
    })
  }, [transactions, filterType, filterCategory, searchQuery])

  const summary = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Math.abs(t.amount), 0)
    return { income, expenses, balance: income - expenses }
  }, [transactions])

  const addTransaction = (tx) => {
    setTransactions(prev => [{ ...tx, id: Date.now() }, ...prev])
  }

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id))
  }

  return (
    <AppContext.Provider value={{
      role, setRole,
      transactions, filteredTransactions,
      filterType, setFilterType,
      filterCategory, setFilterCategory,
      searchQuery, setSearchQuery,
      summary,
      addTransaction,
      deleteTransaction,
      darkMode, setDarkMode,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
