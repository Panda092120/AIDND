// API Service for D&D Simulator Frontend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';;

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('dnd_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    // If token is expired or invalid, clear it
    if (response.status === 401) {
      localStorage.removeItem('dnd_token');
      localStorage.removeItem('dnd_user');
    }
    throw new Error(data.message || 'API request failed');
  }
  
  return data;
};

// Authentication API
export const authAPI = {
  // Login user
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    const data = await handleResponse(response);
    
    // Store token and user data
    if (data.token) {
      localStorage.setItem('dnd_token', data.token);
      localStorage.setItem('dnd_user', JSON.stringify(data.user));
    }
    
    return data;
  },

  // Sign up user
  signup: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    const data = await handleResponse(response);
    
    // Store token and user data
    if (data.token) {
      localStorage.setItem('dnd_token', data.token);
      localStorage.setItem('dnd_user', JSON.stringify(data.user));
    }
    
    return data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    
    return handleResponse(response);
  },

  // Logout
  logout: () => {
    localStorage.removeItem('dnd_token');
    localStorage.removeItem('dnd_user');
  },

  // Check if user is logged in
  isLoggedIn: () => {
    return !!localStorage.getItem('dnd_token');
  },

  // Get stored user data
  getStoredUser: () => {
    const userData = localStorage.getItem('dnd_user');
    return userData ? JSON.parse(userData) : null;
  }
};

// Campaign API
export const campaignAPI = {
  // Get all user campaigns
  getCampaigns: async () => {
    const response = await fetch(`${API_BASE_URL}/campaigns`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    
    return handleResponse(response);
  },

  // Get specific campaign
  getCampaign: async (campaignId) => {
    const response = await fetch(`${API_BASE_URL}/campaigns/${campaignId}`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    
    return handleResponse(response);
  },

  // Create new campaign
  createCampaign: async (campaignData) => {
    const response = await fetch(`${API_BASE_URL}/campaigns`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(campaignData),
    });
    
    return handleResponse(response);
  },

  // Update campaign
  updateCampaign: async (campaignId, updateData) => {
    const response = await fetch(`${API_BASE_URL}/campaigns/${campaignId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(updateData),
    });
    
    return handleResponse(response);
  },

  // Delete campaign
  deleteCampaign: async (campaignId) => {
    const response = await fetch(`${API_BASE_URL}/campaigns/${campaignId}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(),
      },
    });
    
    return handleResponse(response);
  }
};

// OpenAI/Chat API
export const chatAPI = {
  // Send message to AI DM
  sendMessage: async (message, character = null, campaignId = null, chatHistory = []) => {
    console.log('📤 Sending message to DM:', { message, character: character?.name, campaignId });
    
    try {
      const response = await fetch(`${API_BASE_URL}/openai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          character,
          campaignId,
          chatHistory
        }),
      });
      
      console.log('📥 Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(`HTTP ${response.status}: ${errorData.message || 'Request failed'}`);
      }
      
      const data = await response.json();
      console.log('✅ Chat response received:', data);
      return data;
      
    } catch (error) {
      console.error('❌ Chat API error:', error);
      throw error;
    }
  },


  // Log dice roll
  logDiceRoll: async (rollData) => {
    const response = await fetch(`${API_BASE_URL}/openai/dice-roll`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(rollData),
    });
    
    return handleResponse(response);
  }
};

// Test API connection
export const testAPI = {
  // Test backend connection
  testConnection: async () => {
    try {
      const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
      return await handleResponse(response);
    } catch (error) {
      throw new Error('Backend server is not running');
    }
  },

  // Test auth routes
  testAuth: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/test`);
    return handleResponse(response);
  },

  // Test campaign routes
  testCampaigns: async () => {
    const response = await fetch(`${API_BASE_URL}/campaigns/test`);
    return handleResponse(response);
  },

  // Test OpenAI routes
  testOpenAI: async () => {
    const response = await fetch(`${API_BASE_URL}/openai/test`);
    return handleResponse(response);
  }
};

export default {
  authAPI,
  campaignAPI,
  chatAPI,
  testAPI
};