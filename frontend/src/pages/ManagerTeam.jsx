import React, { useState } from "react";
import './ManagerTeam.css'
// Mock initial data for the team
const INITIAL_TEAM = [
  {
    id: 1,
    name: "Zoe Washington",
    email: "zoe.w@cybercorp.io",
    role: "Employee",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe",
  },
  {
    id: 2,
    name: "Leo Martinez",
    email: "leo.m@cybercorp.io",
    role: "Employee",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Leo",
  },
  {
    id: 3,
    name: "Mia Kim",
    email: "mia.k@cybercorp.io",
    role: "Contractor",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mia",
  },
  {
    id: 4,
    name: "Jay Chen",
    email: "jay.c@cybercorp.io",
    role: "Intern",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jay",
  },
];

export default function ManagerTeam() {
  const [team, setTeam] = useState(INITIAL_TEAM);
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "Employee"
  });

  const [modal, setModal] = useState({ open: false, member: null });

  const handleInputChange = (e) => setForm(f => ({
    ...f,
    [e.target.name]: e.target.value
  }));

  const handleAdd = (e) => {
    e.preventDefault();
    const { name, email, role } = form;
    if (!name || !email || !role) return;
    setTeam(team => [
      ...team,
      {
        id: Date.now(),
        name,
        email,
        role,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`
      }
    ]);
    setForm({ name: "", email: "", role: "Employee" });
  };

  const openRemoveModal = member => setModal({ open: true, member });
  const closeRemoveModal = () => setModal({ open: false, member: null });

  const removeMember = () => {
    setTeam(team => team.filter(m => m.id !== modal.member.id));
    closeRemoveModal();
  };

  return (
    <>
      <style>{`/* Place CSS from <style> tag or import in your app! */`}</style>
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
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="User Avatar" />
          <div className="user-info">
            <h3>Alex Ryder</h3>
            <p>Team Manager</p>
          </div>
        </div>
        <nav>
          <a href="#" className="nav-link" style={{"--from-color":"var(--neon-blue)", "--to-color":"var(--neon-purple)"}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg><span>Dashboard</span></a>
          <a href="manager-dashboard.html" className="nav-link" style={{"--from-color":"var(--neon-blue)", "--to-color":"var(--neon-green)"}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg><span>Approvals</span></a>
          <a href="#" className="nav-link active" style={{"--from-color":"var(--neon-purple)", "--to-color":"var(--neon-pink)"}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg><span>Team Members</span></a>
          <a href="#" className="nav-link" style={{"--from-color":"var(--neon-orange)", "--to-color":"var(--neon-pink)"}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg><span>Reports</span></a>
        </nav>
        <div className="user-actions">
          <a href="profile.html" className="nav-link action-button"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg><span>Profile</span></a>
          <button className="nav-link action-button"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg><span>Settings</span></button>
          <button className="nav-link action-button logout"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" x2="9" y1="12" y2="12"></line></svg><span>Logout</span></button>
        </div>
      </aside>
      <main className="main-content">
        <div className="page-container">
          <header className="page-header animate-fade-in-up">
            <h1 className="font-cyber glow-text">TEAM MEMBERS</h1>
            <p className="subtitle">Add, view, and manage your team members</p>
          </header>
          {/* ADD MEMBER */}
          <div className="cyber-card animate-fade-in-up" style={{animationDelay:"0.1s"}}>
            <div className="card-header">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--neon-blue)" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" /></svg>
              <h2>Add New Member</h2>
            </div>
            <form className="add-member-form" onSubmit={handleAdd}>
              <div className="form-group">
                <label htmlFor="name-input">Full Name</label>
                <input type="text" id="name-input" name="name" value={form.name} required onChange={handleInputChange}/>
              </div>
              <div className="form-group">
                <label htmlFor="email-input">Email</label>
                <input type="email" id="email-input" name="email" value={form.email} required onChange={handleInputChange}/>
              </div>
              <div className="form-group">
                <label htmlFor="role-select">Role</label>
                <select id="role-select" name="role" value={form.role} onChange={handleInputChange}>
                  <option>Employee</option>
                  <option>Contractor</option>
                  <option>Intern</option>
                </select>
              </div>
              <button type="submit" className="neon-button">Add Member</button>
            </form>
          </div>
          {/* TEAM LIST */}
          <div className="cyber-card animate-fade-in-up" style={{animationDelay:"0.2s"}}>
            <div className="card-header">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--neon-purple)" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
              <h2>Current Team</h2>
            </div>
            <div className="team-list">
              {team.length === 0 ? (
                <p style={{textAlign:"center", color:"var(--text-secondary)"}}>No team members found. Add one above!</p>
              ) : (
                team.map(member => (
                  <div className="team-member-item" key={member.id}>
                    <div className="member-info">
                      <img src={member.avatar} alt={member.name} />
                      <div>
                        <h3>{member.name}</h3>
                        <p>{member.email} - <span style={{color:"var(--neon-blue)"}}>{member.role}</span></p>
                      </div>
                    </div>
                    <button className="remove-btn" aria-label={`Remove ${member.name}`}
                      onClick={() => openRemoveModal(member)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
      {/* REMOVE MODAL */}
      <div className={`modal-overlay${modal.open ? " visible" : ""}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h2>Confirm Removal</h2>
          </div>
          <div className="modal-body">
            <p>
              {modal.member
                ? `Are you sure you want to remove ${modal.member.name}?`
                : "Are you sure you want to remove this team member?"
              }
            </p>
          </div>
          <div className="modal-footer">
            <button id="cancel-remove-btn" onClick={closeRemoveModal}>Cancel</button>
            <button id="confirm-remove-btn" onClick={removeMember}>Remove</button>
          </div>
        </div>
      </div>
    </>
  );
}
