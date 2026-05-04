// Backend configuration
export const BACKEND_CONFIG = {
  // Production backend URL
  API_URL: 'https://nirvaha-5cqj.onrender.com',
  SOCKET_URL: 'https://nirvaha-5cqj.onrender.com',

  // Local development URL (prioritized for development)
  LOCAL_API_URL: 'http://localhost:5001',
  LOCAL_SOCKET_URL: 'http://localhost:5001',

  // Check if we're in development mode
  IS_DEVELOPMENT: import.meta.env.DEV ||
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1',

  // Force local development (set to true for local development)
  FORCE_LOCAL: false,

  // Get the appropriate URL based on environment
  get API_BASE_URL() {
    console.log('🔗 Using API URL:', this.API_URL);
    return this.API_URL;
  },

  get SOCKET_BASE_URL() {
    console.log('🔌 Using Socket URL:', this.SOCKET_URL);
    return this.SOCKET_URL;
  },

  // Health check function
  async checkHealth() {
    try {
      const response = await fetch(`${this.API_BASE_URL}/api/health`);
      const data = await response.json();
      console.log('✅ Backend health check:', data);
      return data;
    } catch (error) {
      console.error('❌ Backend health check failed:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      return { status: 'unhealthy', error: errorMessage };
    }
  }
};

export default BACKEND_CONFIG;
