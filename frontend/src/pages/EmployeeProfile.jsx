import React, { useState } from "react";
import './EmployeeProfile.css'

export default function EmployeeProfile() {
  const [user, setUser] = useState({
    name: "Alex Ryder",
    email: "alex.ryder@cybercorp.io",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    createdAt: "2024-01-15T10:00:00Z",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [temp, setTemp] = useState({ name: user.name, email: user.email });

  const handleEdit = () => { setTemp({ name: user.name, email: user.email }); setIsEditing(true); };
  const handleCancel = () => setIsEditing(false);
  const handleSave = () => { setUser(u => ({ ...u, ...temp })); setIsEditing(false); };

  const joinDate = new Date(user.createdAt);
  const memberSince = `Member since ${joinDate.toLocaleDateString()}`;
  const statMemberSince = joinDate.toLocaleDateString("en-US", { month: "short", year: "numeric" });

  return (
    <div className="layout-shell">
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
          <img src={user.avatar} alt="User Avatar" />
          <div className="user-info">
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </div>
        </div>
        <nav>
          <a href="/dashboard" className="nav-link" style={{"--from-color": "var(--neon-blue)", "--to-color": "var(--neon-purple)"}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg><span>Dashboard</span></a>
          <a href="/add-transaction" className="nav-link" style={{"--from-color": "var(--neon-green)", "--to-color": "var(--neon-blue)"}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14" /><path d="M12 5v14" /></svg><span>Add Transaction</span></a>
          <a href="/transactions" className="nav-link" style={{"--from-color": "var(--neon-purple)", "--to-color": "var(--neon-pink)"}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" y2="21" /><line x1="8" y1="12" y2="21" /><line x1="8" y1="18" y2="21" /><line x1="3" y1="6" y2="3.01" /><line x1="3" y1="12" y2="3.01" /><line x1="3" y1="18" y2="3.01" /></svg><span>Transactions</span></a>
          <a href="/budget" className="nav-link" style={{"--from-color": "var(--neon-orange)", "--to-color": "var(--neon-pink)"}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" /></svg><span>Budget & Insights</span></a>
          <a href="/approvals" className="nav-link" style={{"--from-color": "var(--neon-blue)", "--to-color": "var(--neon-green)"}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg><span>Approval Status</span></a>
        </nav>
        <div className="user-actions">
          <a href="/profile" className="nav-link action-button active" style={{"--from-color": "var(--neon-blue)", "--to-color": "var(--neon-purple)"}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg><span>Profile</span></a>
          <button className="nav-link action-button"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg><span>Settings</span></button>
          <button className="nav-link action-button logout"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" x2="9" y1="12" y2="12"></line></svg><span>Logout</span></button>
        </div>
      </aside>
      <main className="main-content main-scroll">
        <div className="page-container">
          <header className="page-header animate-fade-in-up">
            <h1 className="font-cyber glow-text">USER PROFILE</h1>
            <p className="subtitle">Manage your account and preferences</p>
          </header>
          <div className="profile-grid">
            <div className="profile-card cyber-card animate-fade-in-up" style={{animationDelay: "0.1s"}}>
              <div className="profile-avatar">
                <img src={user.avatar} alt="User Avatar" />
              </div>
              <h2>{user.name}</h2>
              <p className="email">{user.email}</p>
              <div className="meta-info">
                <div className="meta-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  <span>{memberSince}</span>
                </div>
                <div className="meta-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                  <span>Account Verified</span>
                </div>
              </div>
            </div>
            <div className="profile-details cyber-card animate-fade-in-up" style={{animationDelay: "0.2s"}}>
              <div className="profile-details-header">
                <h3>Profile Information</h3>
                {!isEditing && (
                  <button className="neon-button-secondary" onClick={handleEdit}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    <span>Edit Profile</span>
                  </button>
                )}
                {isEditing && (
                  <div className="edit-controls">
                    <button type="button" className="neon-button" onClick={handleSave}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                      <span>Save</span>
                    </button>
                    <button type="button" className="neon-button-secondary" onClick={handleCancel}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>
              <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
                <div className="form-group">
                  <label htmlFor="name-input">Full Name</label>
                  <div className="input-wrapper">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    <input type="text" id="name-input" value={isEditing ? temp.name : user.name} onChange={e => setTemp(t => ({ ...t, name: e.target.value }))} disabled={!isEditing} />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="email-input">Email Address</label>
                  <div className="input-wrapper">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    <input type="email" id="email-input" value={isEditing ? temp.email : user.email} onChange={e => setTemp(t => ({ ...t, email: e.target.value }))} disabled={!isEditing} />
                  </div>
                </div>
              </form>
              <div className="stats-section">
                <h4 style={{fontSize:"1.125rem", fontWeight:600, marginBottom:"1rem"}}>Account Statistics</h4>
                <div className="stats-grid">
                  <div className="stat-box">
                    <div className="icon-container" style={{backgroundImage: "linear-gradient(to right,var(--neon-green),var(--neon-blue))"}}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                    </div>
                    <p className="label">Account Status</p>
                    <p className="value text-neon-green">Active</p>
                  </div>
                  <div className="stat-box">
                    <div className="icon-container" style={{backgroundImage: "linear-gradient(to right,var(--neon-purple),var(--neon-pink))"}}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    </div>
                    <p className="label">Member Since</p>
                    <p className="value text-neon-purple">{statMemberSince}</p>
                  </div>
                  <div className="stat-box">
                    <div className="icon-container" style={{backgroundImage: "linear-gradient(to right,var(--neon-orange),var(--neon-pink))"}}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                    </div>
                    <p className="label">Security</p>
                    <p className="value text-neon-orange">Protected</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
