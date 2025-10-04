// AdminDashboard.jsx
import React, { useState, useEffect, useRef } from "react";
import ApexCharts from "apexcharts";
import Chart from "react-apexcharts";
import './AdminDashboard.css'

const USERS_MOCK = [
  { id: 1, name: "Zoe Washington", email: "zoe.w@cybercorp.io", role: "Employee", manager: "Alex Ryder" },
  { id: 2, name: "Leo Martinez", email: "leo.m@cybercorp.io", role: "Employee", manager: "Alex Ryder" },
  { id: 3, name: "Alex Ryder", email: "alex.r@cybercorp.io", role: "Manager", manager: "Admin User" },
];

const EXPENSES_MOCK = [
  { id: 1, date: "2025-09-05", userId: 1, description: "Client Dinner", amount: 8500, status: "approved" },
  { id: 2, date: "2025-09-08", userId: 2, description: "Cloud Server Hosting", amount: 15000, status: "approved" },
  { id: 3, date: "2025-09-12", userId: 1, description: "Flights to Conference", amount: 35000, status: "rejected" },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [users, setUsers] = useState(USERS_MOCK);
  const [expenses, setExpenses] = useState(EXPENSES_MOCK);

  // User modal
  const [isUserModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Override modal
  const [isOverrideModalOpen, setOverrideModalOpen] = useState(false);
  const [overrideExpenseId, setOverrideExpenseId] = useState(null);
  const [overrideStatus, setOverrideStatus] = useState("approved");
  const [overrideComment, setOverrideComment] = useState("");

  // Chart data (can be made props)
  const trendsData = {
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    data: [820000, 932000, 901000, 934000, 1290000, 1330000],
  };

  // ApexCharts options for area chart
  const chartOptions = {
    chart: { type: "area", height: 350, toolbar: { show: false }, background: "transparent" },
    series: [{ name: "Total Expenses", data: trendsData.data }],
    xaxis: { categories: trendsData.categories, labels: { style: { colors: "#9ca3af" } } },
    yaxis: { labels: { style: { colors: "#9ca3af" }, formatter: val => `₹${(val / 1000000).toFixed(1)}M` } },
    colors: ["#10b981"], // --neon-green
    stroke: { curve: "smooth", width: 2 },
    dataLabels: { enabled: false },
    grid: { borderColor: "#374151", strokeDashArray: 3 },
    tooltip: { theme: "dark", y: { formatter: val => `₹${val.toLocaleString()}` } },
    fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.2, stops: [0, 90, 100] } },
  };

  // Tab switching
  const handleNav = (tab) => setActiveTab(tab);

  // User modal logic
  const openCreateUser = () => {
    setEditingUser(null);
    setUserModalOpen(true);
  };

  const openEditUser = (user) => {
    setEditingUser(user);
    setUserModalOpen(true);
  };

  const handleUserSave = (e) => {
    e.preventDefault();
    const { id, name, email, role } = e.target.elements;
    if (editingUser) {
      setUsers(users.map(u => u.id === +editingUser.id ? { ...u, name: name.value, email: email.value, role: role.value } : u));
    } else {
      setUsers([
        ...users,
        {
          id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
          name: name.value,
          email: email.value,
          role: role.value,
          manager: "Admin User"
        }
      ]);
    }
    setUserModalOpen(false);
  };

  // Override modal logic
  const openOverrideModal = (expenseId) => {
    setOverrideExpenseId(expenseId);
    setOverrideModalOpen(true);
    setOverrideStatus("approved");
    setOverrideComment("");
  };

  const handleOverrideSave = () => {
    setExpenses(expenses.map(exp =>
      exp.id === overrideExpenseId ? { ...exp, status: overrideStatus } : exp
    ));
    setOverrideModalOpen(false);
  };

  // Utility
  const getUserById = (id) => users.find(u => u.id === id) || { name: "Unknown" };

  return (
    <>
      {/* INLINE STYLES (move to CSS file in practice) */}
      <style>{`/* YOUR CSS CONTENT from <style> tag above, paste here */`}</style>

      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
          </div>
          <div className="logo-text">
            <h1 className="font-cyber glow-text">EXPENSE TRACKER</h1>
            <p>ADMINISTRATOR</p>
          </div>
        </div>
        <div className="user-profile">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Admin Avatar" />
          <div className="user-info">
            <h3>Admin User</h3>
            <p>System Administrator</p>
          </div>
        </div>
        <nav>
          <a href="#" className={`nav-link${activeTab === "dashboard" ? " active" : ""}`} onClick={() => handleNav("dashboard")} style={{ '--from-color': "var(--neon-blue)", '--to-color': "var(--neon-purple)" }}>
            {/* Dashboard icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            <span>Dashboard</span>
          </a>
          <a href="#" className={`nav-link${activeTab === "user-management" ? " active" : ""}`} onClick={() => handleNav("user-management")} style={{ '--from-color': "var(--neon-purple)", '--to-color': "var(--neon-pink)" }}>
            {/* User Management icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <span>User Management</span>
          </a>
          <a href="#" className={`nav-link${activeTab === "approval-flows" ? " active" : ""}`} onClick={() => handleNav("approval-flows")} style={{ '--from-color': "var(--neon-green)", '--to-color': "var(--neon-blue)" }}>
            {/* Approval Flows icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            <span>Approval Flows</span>
          </a>
          <a href="#" className={`nav-link${activeTab === "all-expenses" ? " active" : ""}`} onClick={() => handleNav("all-expenses")} style={{ '--from-color': "var(--neon-orange)", '--to-color': "var(--neon-pink)" }}>
            {/* All Expenses icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
            <span>All Expenses</span>
          </a>
        </nav>
        <div className="user-actions">
          <button className="nav-link action-button">
            {/* System Settings Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            <span>System Settings</span>
          </button>
          <button className="nav-link action-button logout">
            {/* Logout Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" x2="9" y1="12" y2="12"></line></svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="page-container">
          <header className="page-header animate-fade-in-up">
            <h1 className="font-cyber glow-text">ADMINISTRATOR CONTROL PANEL</h1>
            <p className="subtitle">System-wide overview and management tools</p>
          </header>

          {/* DASHBOARD TAB */}
          {activeTab === "dashboard" && (
            <div id="dashboard" className="tab-content active">
              <div className="cyber-card animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                <div className="summary-grid">
                  {/* Cards: Use static values as per HTML */}
                  <div className="summary-card">
                    <div className="icon-container" style={{ backgroundImage: "linear-gradient(to right, var(--neon-blue), var(--neon-purple))" }}>
                      {/* User Icon */}
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    </div>
                    <p className="value font-cyber">142</p>
                    <p className="label">Total Users</p>
                  </div>
                  <div className="summary-card">
                    <div className="icon-container" style={{ backgroundImage: "linear-gradient(to right, var(--neon-green), var(--neon-blue))" }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                    </div>
                    <p className="value font-cyber">₹12.4M</p>
                    <p className="label">Total Expenses (YTD)</p>
                  </div>
                  <div className="summary-card">
                    <div className="icon-container" style={{ backgroundImage: "linear-gradient(to right, var(--neon-orange), var(--neon-pink))" }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                    </div>
                    <p className="value font-cyber">18</p>
                    <p className="label">Pending Approvals</p>
                  </div>
                  <div className="summary-card">
                    <div className="icon-container" style={{ backgroundImage: "linear-gradient(to right, var(--neon-purple), var(--neon-pink))" }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><line x1="8" y1="6" y2="21"></line><line x1="8" y1="12" y2="21"></line><line x1="8" y1="18" y2="21"></line><line x1="3" y1="6" y2="3.01"></line><line x1="3" y1="12" y2="3.01"></line><line x1="3" y1="18" y2="3.01"></line></svg>
                    </div>
                    <p className="value font-cyber">8,921</p>
                    <p className="label">Total Transactions</p>
                  </div>
                </div>
              </div>
              <div className="charts-grid animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                <div className="cyber-card">
                  <div className="card-header">
                    {/* Trends Icon */}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--neon-green)" strokeWidth="2"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
                    <h2>Company-Wide Expense Trends</h2>
                  </div>
                  {/* Using react-apexcharts Chart component */}
                  <Chart options={chartOptions} series={chartOptions.series} type="area" height={350} />
                </div>
                <div className="cyber-card">
                  <div className="card-header">
                    {/* High-Value Activity Icon */}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--neon-orange)" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                    <h2>Recent High-Value Activity</h2>
                  </div>
                  <div className="activity-feed">
                    <div className="activity-item"><p><span className="user">Leo Martinez</span> submitted an expense for <span className="amount text-neon-orange">₹60,000</span>.</p></div>
                    <div className="activity-item"><p><span className="user">Alex Ryder</span> approved an expense for <span className="amount text-neon-green">₹25,000</span>.</p></div>
                    <div className="activity-item"><p><span className="user">Jay Chen</span>&apos;s expense for <span className="amount text-neon-orange">₹45,000</span> was rejected.</p></div>
                    <div className="activity-item"><p><span className="user">System</span> flagged a duplicate expense from <span className="user">Mia Kim</span>.</p></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* USER MANAGEMENT TAB */}
          {activeTab === "user-management" && (
            <div id="user-management" className="tab-content active">
              <div className="cyber-card">
                <div className="card-header">
                  <div className="card-header-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--neon-purple)" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    <h2>User Management</h2>
                  </div>
                  <button className="neon-button" onClick={openCreateUser}>Create User</button>
                </div>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Name</th><th>Email</th><th>Role</th><th>Manager</th><th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user.id}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>{user.role}</td>
                          <td>{user.manager}</td>
                          <td>
                            <button className="table-action-button edit-user-btn" onClick={() => openEditUser(user)}>
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* APPROVAL FLOWS TAB */}
          {activeTab === "approval-flows" && (
            <div id="approval-flows" className="tab-content active">
              <div className="cyber-card">
                <div className="card-header">
                  <div className="card-header-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--neon-green)" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                    <h2>Approval Flow Configuration</h2>
                  </div>
                  <button className="neon-button">Add New Rule</button>
                </div>
                <p style={{ color: "var(--text-secondary)", textAlign: "center" }}>Feature coming soon. This section will allow configuring multi-step approval rules based on expense amount or category.</p>
              </div>
            </div>
          )}

          {/* ALL EXPENSES TAB */}
          {activeTab === "all-expenses" && (
            <div id="all-expenses" className="tab-content active">
              <div className="cyber-card">
                <div className="card-header">
                  <div className="card-header-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--neon-orange)" strokeWidth="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
                    <h2>All Company Expenses</h2>
                  </div>
                </div>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Date</th><th>User</th><th>Description</th><th>Amount</th><th>Status</th><th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenses.map(exp => (
                        <tr key={exp.id}>
                          <td>{new Date(exp.date).toLocaleDateString()}</td>
                          <td>{getUserById(exp.userId).name}</td>
                          <td>{exp.description}</td>
                          <td>₹{exp.amount.toLocaleString()}</td>
                          <td>{exp.status}</td>
                          <td>
                            <button className="table-action-button override-btn" onClick={() => openOverrideModal(exp.id)}>Override</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* User Modal */}
      {isUserModalOpen && (
        <div className="modal-overlay visible">
          <div className="modal-content">
            <div className="modal-header">
              <h2 id="user-modal-title">{editingUser ? "Edit User" : "Create User"}</h2>
              <button className="modal-close-btn" onClick={() => setUserModalOpen(false)}>&times;</button>
            </div>
            <form id="user-form" className="modal-body" onSubmit={handleUserSave}>
              <input type="hidden" name="id" defaultValue={editingUser?.id || ""} />
              <div className="form-group">
                <label htmlFor="user-name">Full Name</label>
                <input type="text" id="user-name" name="name" required defaultValue={editingUser?.name || ""} />
              </div>
              <div className="form-group">
                <label htmlFor="user-email">Email</label>
                <input type="email" id="user-email" name="email" required defaultValue={editingUser?.email || ""} />
              </div>
              <div className="form-group">
                <label htmlFor="user-role">Role</label>
                <select id="user-role" name="role" defaultValue={editingUser?.role || "Employee"}>
                  <option>Employee</option>
                  <option>Manager</option>
                  <option>Admin</option>
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="neon-button-secondary modal-cancel-btn" onClick={() => setUserModalOpen(false)}>Cancel</button>
                <button type="submit" id="save-user-btn" className="neon-button">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Override Modal */}
      {isOverrideModalOpen && (
        <div className="modal-overlay visible">
          <div className="modal-content">
            <div className="modal-header">
              <h2 id="override-modal-title">Override Approval</h2>
              <button className="modal-close-btn" onClick={() => setOverrideModalOpen(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <input type="hidden" id="expense-id" value={overrideExpenseId} readOnly />
              <div className="form-group">
                <label htmlFor="override-status">New Status</label>
                <select id="override-status" value={overrideStatus} onChange={e => setOverrideStatus(e.target.value)}>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="override-comment">Comment (Optional)</label>
                <textarea id="override-comment" rows="3" value={overrideComment} onChange={e => setOverrideComment(e.target.value)}></textarea>
              </div>
              <div className="modal-footer">
                <button className="neon-button-secondary modal-cancel-btn" onClick={() => setOverrideModalOpen(false)}>Cancel</button>
                <button id="save-override-btn" className="neon-button" onClick={handleOverrideSave}>Apply Override</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
