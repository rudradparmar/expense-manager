import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import EmployeeAddTransaction from "./pages/EmployeeAddTransaction";
import EmployeeProfile from "./pages/EmployeeProfile";
import EmployeeTransactionHistory from "./pages/EmployeeTransactionHistory";
import ManagerDashboard from "./pages/ManagerDashboard";
import ManagerProfile from "./pages/ManagerProfile";
import ManagerReports from "./pages/ManagerReports";
import ManagerTeam from "./pages/ManagerTeam";
// Add other imports if you have AdminDashboard, etc.

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Employee Dashboard */}
        <Route path="/employee/profile" element={<EmployeeProfile />} />
        <Route path="/employee/transactions" element={<EmployeeTransactionHistory />} />
        <Route path="/employee/add-transaction" element={<EmployeeAddTransaction />} />

        {/* Manager Dashboard */}
        <Route path="/manager/dashboard" element={<ManagerDashboard />} />
        <Route path="/manager/profile" element={<ManagerProfile />} />
        <Route path="/manager/reports" element={<ManagerReports />} />
        <Route path="/manager/team" element={<ManagerTeam />} />

        {/* Add more routes as needed for admin or other modules */}
      </Routes>
    </Router>
  );
}

export default App;
