# FinanceIQ — Personal Finance Dashboard

A clean, professional finance monitoring dashboard built with React + Vite. Features a dark/light theme, role-based access, animated charts, and full transaction management.

---

## Tech Stack

- **React 18** — UI framework
- **Vite 5** — Build tool & dev server
- **Recharts** — Charts (bar, pie)
- **CSS Variables** — Theming (dark/light)
- **Context API** — Global state management

---

## Features

### Dashboard Overview
- Animated metric cards — Net Balance, Total Income, Total Expenses, Savings Rate
- Income utilization progress bars
- 6-month cash flow bar chart
- Spending split donut chart by category
- Recent activity feed

### Transactions
- Full transaction table with search, filter by type & category
- Add new transactions (Admin only)
- Delete transactions with two-click confirmation (Admin only)
- Export to CSV

### Insights
- KPI cards — Savings Rate, Avg Expense, Top/Lowest Category
- Spending breakdown with animated horizontal bars
- Key observations derived from transaction data

### Role-Based Access
| Feature | Viewer | Admin |
|---|---|---|
| View dashboard | ✓ | ✓ |
| Filter & search | ✓ | ✓ |
| Export CSV | ✓ | ✓ |
| Add transaction | ✗ | ✓ |
| Delete transaction | ✗ | ✓ |

### UI/UX
- Dark mode (default) + Light mode toggle
- Smooth page transitions & staggered card animations
- Animated number counters on metric values
- Responsive — works on mobile, tablet, desktop
- Inter font throughout

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Install & Run

```bash
cd finance-dashboard
npm install
npm run dev
```

Open **http://localhost:5173**

### Build for Production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
finance-dashboard/
├── src/
│   ├── components/
│   │   ├── Layout.jsx        # App shell, tab switching
│   │   ├── Sidebar.jsx       # Navigation, role switcher, theme toggle
│   │   ├── Overview.jsx      # Dashboard page
│   │   ├── Transactions.jsx  # Transactions page
│   │   └── Insights.jsx      # Insights & analytics page
│   ├── context/
│   │   └── AppContext.jsx    # Global state (role, transactions, theme)
│   ├── data/
│   │   └── mockData.js       # Sample transactions & chart data
│   ├── hooks/
│   │   └── useCountUp.js     # Animated number counter hook
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css             # All styles + dark/light themes
├── index.html
├── vite.config.js
└── package.json
```

---

## State Management

All state lives in `AppContext`:

| State | Type | Description |
|---|---|---|
| `role` | `admin` \| `viewer` | Controls feature access |
| `transactions` | Array | Full transaction list |
| `filteredTransactions` | Array | Derived — filtered by search/type/category |
| `summary` | Object | Derived — income, expenses, balance totals |
| `darkMode` | Boolean | Theme toggle |
| `filterType` | String | `all` \| `income` \| `expense` |
| `filterCategory` | String | Category filter value |
| `searchQuery` | String | Search input value |

---

## Switching Roles

Use the **Viewer / Admin** toggle at the bottom of the sidebar. Admin unlocks the **+ New Transaction** button and **delete** buttons in the table.

---

## Theme

Toggle between **Dark Mode** and **Light Mode** using the button at the bottom of the sidebar. Dark is the default.
