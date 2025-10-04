import React, { useState } from "react";
import './ManagerDashboard.css'


// Mock initial expense data
const INITIAL_EXPENSES = [
  {
    id: 1,
    user: "Zoe Washington",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe",
    description: "New Office Monitor",
    amount: 25000,
    date: "2025-10-03",
    status: "pending",
    comment: null,
  },
  {
    id: 2,
    user: "Leo Martinez",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Leo",
    description: "Client Lunch Meeting",
    amount: 4500,
    date: "2025-10-02",
    status: "pending",
    comment: null,
  },
  {
    id: 3,
    user: "Mia Kim",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mia",
    description: "Software Subscription Renewal",
    amount: 8000,
    date: "2025-10-01",
    status: "approved",
    comment: "Approved for Q4.",
  },
  {
    id: 4,
    user: "Jay Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jay",
    description: "Team Off-site Travel",
    amount: 45000,
    date: "2025-09-28",
    status: "rejected",
    comment: "Exceeds budget. Please resubmit next quarter.",
  },
  {
    id: 5,
    user: "Zoe Washington",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe",
    description: "Ergonomic Keyboard",
    amount: 7500,
    date: "2025-09-25",
    status: "pending",
    comment: null,
  },
  {
    id: 6,
    user: "Leo Martinez",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Leo",
    description: "Marketing Conference Tickets",
    amount: 60000,
    date: "2025-09-22",
    status: "escalated",
    comment: "Forwarded to senior management for final approval.",
  },
];

export default function ManagerDashboard() {
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [modal, setModal] = useState({
    open: false,
    expenseId: null,
    action: null,
    comment: ""
  });

  // Filter expenses
  const pendingExpenses = expenses.filter(exp => exp.status === "pending");
  const historyExpenses = expenses
    .filter(exp => exp.status !== "pending")
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // Modal handlers
  const openModal = (expenseId, action) => {
    setModal({ open: true, expenseId, action, comment: "" });
  };

  const closeModal = () => {
    setModal({ open: false, expenseId: null, action: null, comment: "" });
  };

  const confirmAction = () => {
    const { expenseId, action, comment } = modal;
    setExpenses(expenses.map(exp => 
      exp.id === expenseId 
        ? { ...exp, status: action + "d", comment: comment || null }
        : exp
    ));
    closeModal();
  };

  // Render expense item
  const renderExpenseItem = (expense) => (
    <div key={expense.id} className={`list-item ${expense.status}`}>
      <div className="item-info">
        <div className="icon">
          <img 
            src={expense.avatar} 
            alt={expense.user} 
            style={{ width: "100%", height: "100%", borderRadius: "50%" }}
          />
        </div>
        <div>
          <h3>
            {expense.description}{" "}
            <span className="font-cyber" style={{ color: "var(--neon-blue)" }}>
              ₹{expense.amount.toLocaleString()}
            </span>
          </h3>
          <p>
            Requested by {expense.user} on {new Date(expense.date).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="item-status">
        <span className={`status-badge ${expense.status}`}>{expense.status}</span>
      </div>
      <div className="item-actions">
        {expense.status === "pending" && (
          <>
            <button 
              className="action-btn approve-btn" 
              onClick={() => openModal(expense.id, "approve")}
            >
              Approve
            </button>
            <button 
              className="action-btn reject-btn" 
              onClick={() => openModal(expense.id, "reject")}
            >
              Reject
            </button>
            <button 
              className="action-btn escalate-btn" 
              onClick={() => openModal(expense.id, "escalate")}
            >
              Escalate
            </button>
          </>
        )}
      </div>
    </div>
  );

  const currentExpense = expenses.find(exp => exp.id === modal.expenseId);

  return (
    <>
      <style>{`/* Place your CSS from <style> tag here or import from CSS file */`}</style>
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
            <p>Team Manager</p>
          </div>
        </div>
        <nav>
          <a href="#" className="nav-link" style={{"--from-color":"var(--neon-blue)", "--to-color":"var(--neon-purple)"}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span>Dashboard</span>
          </a>
          <a href="manager-dashboard.html" className="nav-link active" style={{"--from-color":"var(--neon-blue)", "--to-color":"var(--neon-green)"}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 11 12 14 22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
            <span>Approvals</span>
          </a>
          <a href="#" className="nav-link" style={{"--from-color":"var(--neon-purple)", "--to-color":"var(--neon-pink)"}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>Team Members</span>
          </a>
          <a href="#" className="nav-link" style={{"--from-color":"var(--neon-orange)", "--to-color":"var(--neon-pink)"}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
              <path d="M22 12A10 10 0 0 0 12 2v10z" />
            </svg>
            <span>Reports</span>
          </a>
        </nav>
        <div className="user-actions">
          <a href="profile.html" className="nav-link action-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Profile</span>
          </a>
          <button className="nav-link action-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            <span>Settings</span>
          </button>
          <button className="nav-link action-button logout">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" x2="9" y1="12" y2="12" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>
      <main className="main-content">
        <div className="page-container">
          <header className="page-header animate-fade-in-up">
            <h1 className="font-cyber glow-text">MANAGER DASHBOARD</h1>
            <p className="subtitle">Review team expenses and manage approvals</p>
          </header>

          {/* PENDING APPROVALS */}
          <div className="cyber-card animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <div className="card-header">
              <div className="card-header-title">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--neon-blue)" strokeWidth="2">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                </svg>
                <h2>Pending Approvals</h2>
              </div>
            </div>
            <div className="item-list">
              {pendingExpenses.length > 0 ? (
                pendingExpenses.map(renderExpenseItem)
              ) : (
                <p style={{ textAlign: "center", color: "var(--text-secondary)" }}>
                  No pending requests.
                </p>
              )}
            </div>
          </div>

          {/* TEAM EXPENSE HISTORY */}
          <div className="cyber-card animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="card-header">
              <div className="card-header-title">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--neon-purple)" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <h2>Team Expense History</h2>
              </div>
            </div>
            <div className="item-list">
              {historyExpenses.length > 0 ? (
                historyExpenses.map(renderExpenseItem)
              ) : (
                <p style={{ textAlign: "center", color: "var(--text-secondary)" }}>
                  No historical data found.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* APPROVAL MODAL */}
      <div className={`modal-overlay${modal.open ? " visible" : ""}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h2>
              {modal.action ? modal.action.charAt(0).toUpperCase() + modal.action.slice(1) : "Confirm"} Expense
            </h2>
            <button onClick={closeModal}>&times;</button>
          </div>
          <div className="modal-body">
            <p style={{ marginTop: 0, marginBottom: "0.5rem", color: "var(--text-secondary)" }}>
              {currentExpense && modal.action && (
                `You are about to ${modal.action} the request for "${currentExpense.description}" (₹${currentExpense.amount.toLocaleString()}).`
              )}
            </p>
            <textarea
              placeholder="Add an optional comment..."
              value={modal.comment}
              onChange={(e) => setModal(m => ({ ...m, comment: e.target.value }))}
            />
          </div>
          <div className="modal-footer">
            <button onClick={closeModal}>Cancel</button>
            <button 
              className={modal.action}
              onClick={confirmAction}
            >
              Confirm {modal.action ? modal.action.charAt(0).toUpperCase() + modal.action.slice(1) : "Action"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
