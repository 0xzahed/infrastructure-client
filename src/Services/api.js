import axios from "axios";

const API_BASE_URL =
  "https://public-infrastructure-issue-reporti-jade.vercel.app";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      // Don't redirect here, let components handle it
    }
    return Promise.reject(error);
  }
);

// User APIs
export const userAPI = {
  createUser: (userData) => api.post("/users", userData),
  getUser: (email) => api.get(`/users/${email}`),
  updateUser: (email, data) => api.patch(`/users/${email}`, data),
  upgradeToPremium: (email) => api.patch(`/users/${email}/premium`),
};

// Issue APIs
export const issueAPI = {
  getAllIssues: (params) => api.get("/issues", { params }),
  getLatestResolved: () => api.get("/issues/latest-resolved"),
  getMyIssues: (params) => api.get("/issues/my-issues", { params }),
  getIssueById: (id) => api.get(`/issues/${id}`),
  createIssue: (issueData) => api.post("/issues", issueData),
  updateIssue: (id, data) => api.patch(`/issues/${id}`, data),
  deleteIssue: (id) => api.delete(`/issues/${id}`),
  upvoteIssue: (id) => api.post(`/issues/${id}/upvote`),
  boostIssue: (id) => api.post(`/issues/${id}/boost`),
};

// Dashboard APIs
export const dashboardAPI = {
  getStats: () => api.get("/dashboard/stats"),
};

export default api;
