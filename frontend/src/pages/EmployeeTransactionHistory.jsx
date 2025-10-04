import React, { useState, useMemo, useEffect } from "react";
import apiService from "../utils/apiService";
import './EmployeeTransactionHistory.css'
import '../styles/theme.css';
import '../styles/dashboard.css';

const MOCK_TRANSACTIONS = [
  {
    id: 1,
    type: "income",
    description: "Salary",
    category: "Salary",
    amount: 50000,
    date: "2025-10-01",
  },
  {
    id: 2,
    type: "expense",
    description: "Rent",
    category: "Bills",
    amount: 15000,
    date: "2025-10-02",
  },
  {
    id: 3,
    type: "expense",
    description: "Groceries",
    category: "Food & Dining",
    amount: 3500,
    date: "2025-10-02",
  },
  {
    id: 4,
    type: "expense",
    description: "Movie Night",
    category: "Entertainment",
    amount: 1200,
    date: "2025-09-28",
  },
  {
    id: 5,
    type: "income",
    description: "Freelance Project",
    category: "Freelance",
    amount: 8000,
    date: "2025-09-25",
  },
  {
    id: 6,
    type: "expense",
    description: "Gasoline",
    category: "Transportation",
    amount: 2000,
    date: "2025-09-24",
  },
  {
    id: 7,
    type: "expense",
    description: "New Keyboard",
    category: "Shopping",
    amount: 4500,
    date: "2025-09-22",
  },
];

const CATEGORY_ICONS = {
  "Food & Dining": "🍽️",
  Transportation: "🚗",
  Shopping: "🛍️",
  Entertainment: "🎬",
  Bills: "📄",
  Salary: "💰",
  Freelance: "💼",
};

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getCategoryIcon(cat) {
  return CATEGORY_ICONS[cat] || "📊";
}

export default function EmployeeTransactionHistory() {
  // State
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});

  // Load user's expenses
  useEffect(() => {
    loadMyExpenses();
  }, []);

  const loadMyExpenses = async () => {
    try {
      setLoading(true);
      const expenses = await apiService.getMyExpenses();
      // Transform backend expense format to match frontend transaction format
      const transformedExpenses = expenses.map(expense => ({
        id: expense._id,
        type: 'expense',
        description: expense.description,
        category: expense.category,
        amount: expense.amount,
        date: expense.date,
        status: expense.status
      }));
      setTransactions(transformedExpenses);
    } catch (error) {
      console.error('Error loading expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  // Categories for the filter dropdown
  const categories = useMemo(
    () => Array.from(new Set(transactions.map((t) => t.category))),
    [transactions]
  );

  // Filter and sort transactions
  const filtered = useMemo(() => {
    let res = [...transactions];
    // Filter
    res = res.filter((t) => {
      const matchesSearch =
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase());
      const matchesType = filterType === "all" || t.type === filterType;
      const matchesCategory = filterCategory === "all" || t.category === filterCategory;
      return matchesSearch && matchesType && matchesCategory;
    });
    // Sort
    res.sort((a, b) => {
      let aVal, bVal;
      if (sortBy === "amount") {
        aVal = a.amount;
        bVal = b.amount;
      } else if (sortBy === "category") {
        aVal = a.category;
        bVal = b.category;
      } else {
        aVal = new Date(a.date);
        bVal = new Date(b.date);
      }
      if (sortOrder === "asc") return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });
    return res;
  }, [transactions, search, filterType, filterCategory, sortBy, sortOrder]);

  // Summary
  const filteredIncome = filtered.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const filteredExpenses = filtered.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);

  // Edit helpers
  const openEdit = (t) => {
    setEditingId(t.id);
    setEditValues({ description: t.description, amount: t.amount, date: t.date });
  };
  const cancelEdit = () => setEditingId(null);
  const saveEdit = (id) => {
    setTransactions((txs) =>
      txs.map((t) =>
        t.id === id ? { ...t, ...editValues, amount: parseFloat(editValues.amount) } : t
      )
    );
    setEditingId(null);
  };
  const deleteTransaction = (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      setTransactions((txs) => txs.filter((t) => t.id !== id));
    }
  };

  // Layout
  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="none" stroke="#fff" strokeWidth="2" />
            </svg>
          </div>
          <div className="logo-text">
            <h1 className="font-cyber glow-text">EXPENSE TRACKER</h1>
            <p>FUTURISTIC FINANCE</p>
          </div>
        </div>
        <div className="user-profile">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="User Avatar" />
          <div className="user-info">
            <h3>Alex Ryder</h3>
            <p>alex.ryder@cybercorp.io</p>
          </div>
        </div>
        <nav>
          <a href="dashboard.html" className="nav-link" style={{ "--from-color": "var(--neon-blue)", "--to-color": "var(--neon-purple)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
            <span>Dashboard</span>
          </a>
          <a href="#" className="nav-link" style={{ "--from-color": "var(--neon-green)", "--to-color": "var(--neon-blue)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
            <span>Add Transaction</span>
          </a>
          <a href="#" className="nav-link active" style={{ "--from-color": "var(--neon-purple)", "--to-color": "var(--neon-pink)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" x2="21" y1="6" y2="6" />
              <line x1="8" x2="21" y1="12" y2="12" />
              <line x1="8" x2="21" y1="18" y2="18" />
              <line x1="3" x2="3.01" y1="6" y2="6" />
              <line x1="3" x2="3.01" y1="12" y2="12" />
              <line x1="3" x2="3.01" y1="18" y2="18" />
            </svg>
            <span>Transactions</span>
          </a>
          <a href="#" className="nav-link" style={{ "--from-color": "var(--neon-blue)", "--to-color": "var(--neon-green)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
            <span>Approval Status</span>
          </a>
        </nav>
        <div className="user-actions">
          <a href="#" className="nav-link action-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span>Profile</span>
          </a>
          <button className="nav-link action-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            <span>Settings</span>
          </button>
          <button className="nav-link action-button logout">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" x2="9" y1="12" y2="12"></line></svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>
      <main className="main-content">
        <div className="page-container">
          <header className="page-header animate-fade-in-up">
            <h1 className="font-cyber glow-text">TRANSACTIONS</h1>
            <p className="subtitle">View and manage all your financial transactions</p>
          </header>
          {/* FILTERS */}
          <section className="cyber-card animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <div className="filter-grid">
              {/* <div className="search-input">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div> */}
              <select value={filterType} onChange={e => setFilterType(e.target.value)}>
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <div className="sort-controls">
                <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  <option value="date">Date</option>
                  <option value="amount">Amount</option>
                  <option value="category">Category</option>
                </select>
                <button onClick={() => setSortOrder(o => (o === "asc" ? "desc" : "asc"))}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 4h18M3 8h18M3 12h18M3 16h18M3 20h18" />
                  </svg>
                </button>
              </div>
            </div>
          </section>
          {/* TRANSACTION LIST */}
          <section className="transactions-list" id="transactions-list-container">
            {filtered.length === 0 ? (
              <div className="no-transactions">
                <h3>No transactions found</h3>
                <p>Try adjusting your filters.</p>
              </div>
            ) : (
              filtered.map((t) => (
                <div className="cyber-card transaction-item" key={t.id}>
                  <div className="transaction-details">
                    <div className={`transaction-icon ${t.type}`}>
                      {t.type === "income" ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                          <polyline points="17 6 23 6 23 12"></polyline>
                        </svg>
                      ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                          <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
                          <polyline points="17 18 23 18 23 12"></polyline>
                        </svg>
                      )}
                    </div>
                    <div className="transaction-info">
                      <div className="description">
                        {t.description} <span>{getCategoryIcon(t.category)}</span>
                      </div>
                      <div className="meta">
                        <span className="meta-item">{formatDate(t.date)}</span>
                        <span className="meta-item">{t.category}</span>
                      </div>
                    </div>
                  </div>
                  <div className="transaction-right">
                    <span className={`transaction-amount ${t.type}`}>
                      {t.type === "income" ? "+" : "-"}₹{t.amount.toLocaleString()}
                    </span>
                    <div className="transaction-actions">
                      <button className="edit-btn" onClick={() => openEdit(t)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                      </button>
                      <button className="delete-btn" onClick={() => deleteTransaction(t.id)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                      </button>
                    </div>
                  </div>
                  {/* EDIT FORM */}
                  {editingId === t.id && (
                    <div className="edit-form active">
                      <div className="edit-form-grid">
                        <input
                          type="text"
                          value={editValues.description}
                          onChange={e => setEditValues(val => ({ ...val, description: e.target.value }))}
                        />
                        <input
                          type="number"
                          value={editValues.amount}
                          onChange={e => setEditValues(val => ({ ...val, amount: e.target.value }))}
                        />
                        <input
                          type="date"
                          value={editValues.date}
                          onChange={e => setEditValues(val => ({ ...val, date: e.target.value }))}
                        />
                      </div>
                      <div className="edit-form-actions">
                        <button type="button" className="save-btn" onClick={() => saveEdit(t.id)}>Save</button>
                        <button type="button" className="cancel-btn" onClick={cancelEdit}>Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </section>
          {/* SUMMARY */}
          <section className="cyber-card summary-section animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="summary-grid">
              <div>
                <p className="label">Total Transactions</p>
                <p className="value">{filtered.length}</p>
              </div>
              <div>
                <p className="label">Filtered Income</p>
                <p className="value text-neon-green">₹{filteredIncome.toLocaleString()}</p>
              </div>
              <div>
                <p className="label">Filtered Expenses</p>
                <p className="value text-neon-orange">₹{filteredExpenses.toLocaleString()}</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
