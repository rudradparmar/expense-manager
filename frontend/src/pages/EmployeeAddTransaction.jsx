import React, { useState, useEffect, useRef } from "react";
import './EmployeeAddTransaction.css'
import '../styles/theme.css';
import '../styles/dashboard.css';

const CATEGORIES = {
  expense: [
    "Food & Dining",
    "Transportation",
    "Shopping",
    "Entertainment",
    "Healthcare",
    "Bills",
    "Education",
    "Other",
  ],
  income: [
    "Salary",
    "Freelance",
    "Investment",
    "Business",
    "Gift",
    "Other",
  ],
};

export default function EmployeeAddTransaction() {
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const redirectRef = useRef();

  useEffect(() => {
    if (showSuccess && redirectRef.current) {
      redirectRef.current.style.transition = "width 2s ease-in-out";
      setTimeout(() => {
        redirectRef.current.style.width = "100%";
      }, 100);
      // Fake redirect after 2s
      setTimeout(() => {
        // window.location.href = '/dashboard';
      }, 2000);
    }
  }, [showSuccess]);

  const handleTypeChange = (val) => {
    setType(val);
    setCategory("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API
    setTimeout(() => {
      setLoading(false);
      setShowSuccess(true);
    }, 1000);
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="none" stroke="#fff" strokeWidth="2" /></svg>
          </div>
          <div className="logo-text">
            <h1 className="font-cyber glow-text">EXPENSE TRACKER</h1>
            <p>FUTURISTIC FINANCE</p>
          </div>
        </div>
        <div className="user-profile">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe" alt="User Avatar" />
          <div className="user-info">
            <h3>Zoe Washington</h3>
            <p>Employee</p>
          </div>
        </div>
        <nav>
          <a href="/employee/dashboard" className="nav-link" style={{ "--from-color": "var(--neon-blue)", "--to-color": "var(--neon-purple)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            <span>Dashboard</span>
          </a>
          <a href="/employee/add-transaction" className="nav-link active" style={{ "--from-color": "var(--neon-green)", "--to-color": "var(--neon-blue)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
            <span>Add Transaction</span>
          </a>
          <a href="/employee/transactions" className="nav-link" style={{ "--from-color": "var(--neon-purple)", "--to-color": "var(--neon-pink)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" y2="21"></line><line x1="8" y1="12" y2="21"></line><line x1="8" y1="18" y2="21"></line><line x1="3" y1="6" y2="3.01"></line><line x1="3" y1="12" y2="3.01"></line><line x1="3" y1="18" y2="3.01"></line></svg>
            <span>Transactions</span>
          </a>
          <a href="/employee/approval" className="nav-link" style={{ "--from-color": "var(--neon-blue)", "--to-color": "var(--neon-green)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
            <span>Approval Status</span>
          </a>
        </nav>
        <div className="user-actions">
          <a href="profile.html" className="nav-link action-button">
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
        {!showSuccess && (
          <div className="page-container animate-fade-in-up">
            <header className="page-header">
              <h1 className="font-cyber glow-text">ADD TRANSACTION</h1>
              <p className="subtitle">Record your financial activity with precision</p>
            </header>
            <div className="cyber-card">
              <form style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }} onSubmit={handleSubmit}>
                {/* Transaction Type */}
                <div className="form-group">
                  <label>Transaction Type</label>
                  <div className="type-selector">
                    <button
                      type="button"
                      className={`type-button${type === "expense" ? " active" : ""}`}
                      onClick={() => handleTypeChange("expense")}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
                        <polyline points="17 18 23 18 23 12"></polyline>
                      </svg>
                      <span>Expense</span>
                    </button>
                    <button
                      type="button"
                      className={`type-button${type === "income" ? " active" : ""}`}
                      onClick={() => handleTypeChange("income")}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                        <polyline points="17 6 23 6 23 12"></polyline>
                      </svg>
                      <span>Income</span>
                    </button>
                  </div>
                </div>
                {/* Amount */}
                <div className="form-group">
                  <label htmlFor="amount">Amount</label>
                  <div className="input-wrapper">
                    {/* <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg> */}
                    <input
                      type="number"
                      id="amount"
                      className="form-input"
                      placeholder="0.00"
                      value={amount}
                      min={0}
                      required
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                </div>
                {/* Category */}
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <div className="input-wrapper">
                    {/* <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                      <line x1="7" y1="7" x2="7.01" y2="7"></line>
                    </svg> */}
                    <select
                      id="category"
                      className="form-input"
                      value={category}
                      required
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="">Select a category</option>
                      {CATEGORIES[type].map((cat) => (
                        <option value={cat} key={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
                {/* Description */}
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <div className="input-wrapper">
                    {/* <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg> */}
                    <textarea
                      id="description"
                      className="form-input"
                      placeholder="Enter transaction description..."
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </div>
                {/* Date */}
                <div className="form-group">
                  <label htmlFor="date">Date</label>
                  <div className="input-wrapper">
                    {/* <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg> */}
                    <input
                      type="date"
                      id="date"
                      className="form-input"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                </div>
                {/* Submit */}
                <button type="submit" id="submit-btn" className="neon-button" disabled={loading}>
                  {loading ? (
                    <>
                      <div className="loading-spinner" />
                      <span>Adding Transaction...</span>
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
                      <span>Add Transaction</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
        {showSuccess && (
          <div className="page-container animate-fade-in-up">
            <div className="success-container">
              <div className="success-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                  <polyline points="9 11 12 14 22 4"></polyline>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                </svg>
              </div>
              <h2 className="font-cyber">Transaction Added!</h2>
              <p className="subtitle">Redirecting to the dashboard...</p>
              <div id="redirect-bar" className="redirect-bar" ref={redirectRef} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
