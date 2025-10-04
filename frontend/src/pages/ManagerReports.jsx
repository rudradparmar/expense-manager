import React, { useEffect, useState } from "react";
import ApexCharts from "apexcharts";
import Chart from "react-apexcharts";
import './ManagerReports.css'
// MOCK DATA
const TEAM_MEMBERS = [
  { id: 1, name: "Zoe Washington" },
  { id: 2, name: "Leo Martinez" },
  { id: 3, name: "Mia Kim" },
  { id: 4, name: "Jay Chen" },
];
const ALL_EXPENSES = [
  {
    date: "2025-09-05",
    memberId: 1,
    description: "Client Dinner",
    category: "Food",
    amount: 8500,
    status: "approved",
  },
  {
    date: "2025-09-08",
    memberId: 2,
    description: "Cloud Server Hosting",
    category: "Software",
    amount: 15000,
    status: "approved",
  },
  {
    date: "2025-09-12",
    memberId: 1,
    description: "Flights to Conference",
    category: "Travel",
    amount: 35000,
    status: "rejected",
  },
  {
    date: "2025-09-15",
    memberId: 3,
    description: "Design Software Suite",
    category: "Software",
    amount: 12000,
    status: "approved",
  },
  {
    date: "2025-09-20",
    memberId: 4,
    description: "Local Transport",
    category: "Travel",
    amount: 3000,
    status: "escalated",
  },
  {
    date: "2025-09-22",
    memberId: 2,
    description: "Team Lunch",
    category: "Food",
    amount: 6000,
    status: "approved",
  },
];

function getDatesRangeDefault() {
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);
  return {
    start: thirtyDaysAgo.toISOString().split("T")[0],
    end: today.toISOString().split("T")[0],
  };
}

export default function ManagerReports() {
  // Filter state
  const [startDate, setStartDate] = useState(getDatesRangeDefault().start);
  const [endDate, setEndDate] = useState(getDatesRangeDefault().end);
  const [memberId, setMemberId] = useState("all");
  const [status, setStatus] = useState("all");
  const [showReport, setShowReport] = useState(false);

  // Report result data
  const [filteredData, setFilteredData] = useState([]);
  const [chartOptions, setChartOptions] = useState({});
  const [chartSeries, setChartSeries] = useState([]);
  const [summary, setSummary] = useState({
    totalExpenses: 0,
    totalTransactions: 0,
    avgExpense: 0,
  });

  // Generate Report
  const handleGenerate = () => {
    let data = ALL_EXPENSES.filter((ex) => {
      const exDate = new Date(ex.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      if (start && exDate < start) return false;
      if (end && exDate > end) return false;
      if (memberId !== "all" && "" + ex.memberId !== memberId) return false;
      if (status !== "all" && ex.status !== status) return false;
      return true;
    });
    setFilteredData(data);

    // Summary
    const totalExpenses = data.reduce((sum, ex) => sum + ex.amount, 0);
    const totalTransactions = data.length;
    const avgExpense = totalTransactions > 0 ? totalExpenses / totalTransactions : 0;
    setSummary({
      totalExpenses,
      totalTransactions,
      avgExpense,
    });

    // Chart: Expenses by Category
    const categoryTotals = data.reduce((acc, ex) => {
      acc[ex.category] = (acc[ex.category] || 0) + ex.amount;
      return acc;
    }, {});
    setChartOptions({
      chart: { type: "bar", height: 300, toolbar: { show: false }, background: "transparent" },
      xaxis: {
        categories: Object.keys(categoryTotals),
        labels: { style: { colors: "var(--text-secondary)" } },
      },
      yaxis: { labels: { style: { colors: "var(--text-secondary)" } } },
      colors: ["var(--neon-purple)"],
      plotOptions: { bar: { horizontal: false, borderRadius: 4 } },
      grid: { borderColor: "var(--cyber-light-gray)", strokeDashArray: 3 },
      tooltip: {
        theme: "dark",
        y: { formatter: (val) => `₹${val.toLocaleString()}` },
      },
    });
    setChartSeries([{ name: "Expenses", data: Object.values(categoryTotals) }]);
    setShowReport(true);
  };

  useEffect(() => {
    // Redraw chart on data change
    if (showReport && chartOptions.chart) {
      // no-op needed with react-apexcharts (see below)
    }
  }, [filteredData, chartOptions, chartSeries, showReport]);

  // Render
  return (
    <>
      <style>{`/* Paste your cyberpunk style or import CSS file here for best experience */`}</style>
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
          <a href="#" className="nav-link" style={{"--from-color":"var(--neon-blue)", "--to-color":"var(--neon-purple)"}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg><span>Dashboard</span></a>
          <a href="manager-dashboard.html" className="nav-link" style={{"--from-color":"var(--neon-blue)", "--to-color":"var(--neon-green)"}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg><span>Approvals</span></a>
          <a href="team-members.html" className="nav-link" style={{"--from-color":"var(--neon-purple)", "--to-color":"var(--neon-pink)"}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg><span>Team Members</span></a>
          <a href="#" className="nav-link active" style={{"--from-color":"var(--neon-orange)", "--to-color":"var(--neon-pink)"}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg><span>Reports</span></a>
        </nav>
        <div className="user-actions">
          <a href="profile.html" className="nav-link action-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span>Profile</span>
          </a>
          <button className="nav-link action-button"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
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
            <h1 className="font-cyber glow-text">REPORTS & ANALYTICS</h1>
            <p className="subtitle">
              Analyze team spending and generate expense reports
            </p>
          </header>
          <div className="cyber-card animate-fade-in-up" style={{animationDelay: "0.1s"}}>
            <div className="card-header">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--neon-blue)" strokeWidth="2">
                <path d="M12 20v-6M12 8V2" /><path d="M12 14v-2" /><path d="m15.09 13.34-.9-.52" /><path d="m15.09 10.16.9-.52" /><path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20z" /><path d="M8.91 13.34l.9-.52" /><path d="M8.91 10.16-.9-.52" />
              </svg>
              <h2>Generate Report</h2>
            </div>
            <div className="report-controls">
              <div className="form-group">
                <label htmlFor="start-date">Start Date</label>
                <input
                  type="date"
                  id="start-date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="end-date">End Date</label>
                <input
                  type="date"
                  id="end-date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="member-select">Team Member</label>
                <select
                  id="member-select"
                  value={memberId}
                  onChange={e => setMemberId(e.target.value)}
                >
                  <option value="all">All Members</option>
                  {TEAM_MEMBERS.map((m) =>
                    <option key={m.id} value={m.id}>{m.name}</option>
                  )}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="status-select">Status</label>
                <select
                  id="status-select"
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="escalated">Escalated</option>
                </select>
              </div>
              <button className="neon-button" onClick={handleGenerate}>Generate</button>
            </div>
          </div>
          {showReport && (
            <div className="animate-fade-in-up" style={{animationDelay: "0.2s"}}>
              <div className="cyber-card" style={{marginBottom: "2rem"}}>
                <div className="card-header">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--neon-green)" strokeWidth="2">
                    <path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" />
                  </svg>
                  <h2>Report Summary</h2>
                </div>
                <div className="summary-grid">
                  <div className="summary-item">
                    <p className="label">Total Expenses</p>
                    <p className="value">₹{summary.totalExpenses.toLocaleString()}</p>
                  </div>
                  <div className="summary-item">
                    <p className="label">Transactions</p>
                    <p className="value">{summary.totalTransactions}</p>
                  </div>
                  <div className="summary-item">
                    <p className="label">Avg. Expense</p>
                    <p className="value">₹{summary.avgExpense.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                  </div>
                </div>
              </div>

              <div className="cyber-card" style={{marginBottom: "2rem"}}>
                <div className="card-header">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--neon-purple)" strokeWidth="2">
                    <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
                    <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
                  </svg>
                  <h2>Expenses by Category</h2>
                </div>
                {/* Use react-apexcharts for charts */}
                {chartOptions && chartSeries.length > 0 && (
                  <Chart options={chartOptions} series={chartSeries} type="bar" height={300} />
                )}
              </div>

              <div className="cyber-card">
                <div className="card-header">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--neon-pink)" strokeWidth="2">
                    <line x1="8" y1="6" y2="21"></line>
                    <line x1="8" y1="12" y2="21"></line>
                    <line x1="8" y1="18" y2="21"></line>
                    <line x1="3" y1="6" y2="3.01"></line>
                    <line x1="3" y1="12" y2="3.01"></line>
                    <line x1="3" y1="18" y2="3.01"></line>
                  </svg>
                  <h2>Detailed Transactions</h2>
                </div>
                <div className="report-table-container">
                  <table className="report-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Member</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.length === 0 ? (
                        <tr>
                          <td colSpan={5} style={{textAlign: "center", color:"var(--text-secondary)"}}>
                            No transactions match the criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredData.map((ex, i) => (
                          <tr key={i}>
                            <td>{new Date(ex.date).toLocaleDateString()}</td>
                            <td>{TEAM_MEMBERS.find(m => m.id === ex.memberId)?.name}</td>
                            <td>{ex.description}</td>
                            <td>₹{ex.amount.toLocaleString()}</td>
                            <td>
                              <span className={`status-badge ${ex.status}`}>
                                {ex.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
