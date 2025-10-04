const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async signup(userData) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Company endpoints
  async getCompanies() {
    return this.request('/company');
  }

  async createCompany(companyData) {
    return this.request('/company', {
      method: 'POST',
      body: JSON.stringify(companyData),
    });
  }

  // User endpoints
  async getUserProfile() {
    return this.request('/users/profile');
  }

  async updateUserProfile(userData) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async changePassword(passwordData) {
    return this.request('/users/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  }

  async getTeamMembers() {
    return this.request('/users/team');
  }

  async getAllUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/users/all${queryString ? '?' + queryString : ''}`);
  }

  async createUser(userData) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(userId, userData) {
    return this.request(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(userId) {
    return this.request(`/users/${userId}`, {
      method: 'DELETE',
    });
  }

  async getManagers() {
    return this.request('/users/managers');
  }

  // Expense endpoints
  async getMyExpenses() {
    return this.request('/expenses/my-expenses');
  }

  async getPendingApprovals() {
    return this.request('/expenses/pending-approvals');
  }

  async getAllExpenses(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/expenses/all${queryString ? '?' + queryString : ''}`);
  }

  async getTeamExpenses(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/expenses/team-expenses${queryString ? '?' + queryString : ''}`);
  }

  async createExpense(expenseData) {
    return this.request('/expenses', {
      method: 'POST',
      body: JSON.stringify(expenseData),
    });
  }

  async approveExpense(expenseId, comment = '') {
    return this.request(`/expenses/${expenseId}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ comment }),
    });
  }

  async rejectExpense(expenseId, comment = '') {
    return this.request(`/expenses/${expenseId}/reject`, {
      method: 'PUT',
      body: JSON.stringify({ comment }),
    });
  }

  async overrideExpense(expenseId, status, comment = '') {
    return this.request(`/expenses/${expenseId}/override`, {
      method: 'PUT',
      body: JSON.stringify({ status, comment }),
    });
  }

  async deleteExpense(expenseId) {
    return this.request(`/expenses/${expenseId}`, {
      method: 'DELETE',
    });
  }

  async getExpenseStats() {
    return this.request('/expenses/stats');
  }

  // Reports endpoints
  async getExpenseSummary(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/reports/expense-summary${queryString ? '?' + queryString : ''}`);
  }

  async getCategoryBreakdown(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/reports/category-breakdown${queryString ? '?' + queryString : ''}`);
  }

  async getMonthlyTrends(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/reports/monthly-trends${queryString ? '?' + queryString : ''}`);
  }

  async getTeamMemberReport(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/reports/team-member-report${queryString ? '?' + queryString : ''}`);
  }

  async getTopExpenses(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/reports/top-expenses${queryString ? '?' + queryString : ''}`);
  }

  async getApprovalRates(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/reports/approval-rates${queryString ? '?' + queryString : ''}`);
  }
}

export default new ApiService();
