import axios from "axios";

const API_URL = "http://localhost:5001/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
);

export const userService = {
  login: async (name) => {
    try {
      const response = await api.post("/users/login", { name });
      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },
  getAllUsers: async () => {
    try {
      const response = await api.get("/users");
      return response;
    } catch (error) {
      console.error("Get users error:", error);
      throw error;
    }
  },
  getUserById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response;
    } catch (error) {
      console.error("Get user error:", error);
      throw error;
    }
  },
};

export const kudosService = {
  getAll: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/kudos?page=${page}&limit=${limit}`);
      return response;
    } catch (error) {
      console.error("Get kudos error:", error);
      throw error;
    }
  },
  create: async (kudos) => {
    try {
      const response = await api.post("/kudos", kudos);
      return response;
    } catch (error) {
      console.error("Create kudos error:", error);
      throw error;
    }
  },
  like: async (id, userName) => {
    try {
      const response = await api.post(`/kudos/${id}/like`, { userName });
      return response;
    } catch (error) {
      console.error("Like kudos error:", error);
      throw error;
    }
  },
  getByUser: async (userName) => {
    try {
      const response = await api.get(`/kudos/user/${userName}`);
      return response;
    } catch (error) {
      console.error("Get user kudos error:", error);
      throw error;
    }
  },
};

export const badgeService = {
  getAll: async () => {
    try {
      const response = await api.get("/badges");
      return response;
    } catch (error) {
      console.error("Get badges error:", error);
      throw error;
    }
  },
  initialize: async () => {
    try {
      const response = await api.post("/badges/init");
      return response;
    } catch (error) {
      console.error("Initialize badges error:", error);
      throw error;
    }
  },
};

export const analyticsService = {
  getKudosByBadge: async () => {
    try {
      const response = await api.get("/analytics/kudos-by-badge");
      return response;
    } catch (error) {
      console.error("Get kudos by badge error:", error);
      throw error;
    }
  },
  getLeaderboard: async () => {
    try {
      const response = await api.get("/analytics/leaderboard");
      return response;
    } catch (error) {
      console.error("Get leaderboard error:", error);
      throw error;
    }
  },
  getMostLiked: async () => {
    try {
      const response = await api.get("/analytics/most-liked");
      return response;
    } catch (error) {
      console.error("Get most liked error:", error);
      throw error;
    }
  },
  getUserStats: async (userName) => {
    try {
      const response = await api.get(`/analytics/user-stats/${userName}`);
      return response;
    } catch (error) {
      console.error("Get user stats error:", error);
      throw error;
    }
  },
};
