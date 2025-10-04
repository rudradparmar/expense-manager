import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeAddTransaction from "./pages/EmployeeAddTransaction";
import EmployeeProfile from "./pages/EmployeeProfile";
import EmployeeTransactionHistory from "./pages/EmployeeTransactionHistory";
import ManagerDashboard from "./pages/ManagerDashboard";
import ManagerProfile from "./pages/ManagerProfile";
import ManagerReports from "./pages/ManagerReports";
import ManagerTeam from "./pages/ManagerTeam";
import DashboardRedirect from "./components/DashboardRedirect";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/manager/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['Manager', 'Admin']}>
                <ManagerDashboard />
              </ProtectedRoute>
            } 
          />
          {/* Employee Routes */}
          <Route 
            path="/employee/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['Employee', 'Manager', 'Admin']}>
                <EmployeeAddTransaction />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/employee/profile" 
            element={
              <ProtectedRoute allowedRoles={['Employee', 'Manager', 'Admin']}>
                <EmployeeProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/employee/transactions" 
            element={
              <ProtectedRoute allowedRoles={['Employee', 'Manager', 'Admin']}>
                <EmployeeTransactionHistory />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/employee/add-transaction" 
            element={
              <ProtectedRoute allowedRoles={['Employee', 'Manager', 'Admin']}>
                <EmployeeAddTransaction />
              </ProtectedRoute>
            } 
          />

          {/* Manager Routes */}
          <Route 
            path="/manager/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['Manager', 'Admin']}>
                <ManagerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/manager/profile" 
            element={
              <ProtectedRoute allowedRoles={['Manager', 'Admin']}>
                <ManagerProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/manager/reports" 
            element={
              <ProtectedRoute allowedRoles={['Manager', 'Admin']}>
                <ManagerReports />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/manager/team" 
            element={
              <ProtectedRoute allowedRoles={['Manager', 'Admin']}>
                <ManagerTeam />
              </ProtectedRoute>
            } 
          />

          {/* Admin Routes */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Dashboard redirect route */}
          <Route path="/dashboard" element={<DashboardRedirect />} />
          
          {/* Catch-all route for undefined paths */}
          <Route path="*" element={<DashboardRedirect />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
