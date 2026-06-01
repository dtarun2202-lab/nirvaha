// Backend configuration
export const BACKEND_CONFIG = {
  // Production backend URL
  API_URL: 'https://nirvaha-5cqj.onrender.com',
  SOCKET_URL: 'https://nirvaha-5cqj.onrender.com',

  // Local development URL (prioritized for development)
  LOCAL_API_URL: import.meta.env.VITE_API_BASE_URL || 'https://nirvaha-5cqj.onrender.com',
  LOCAL_SOCKET_URL: import.meta.env.VITE_API_BASE_URL || 'https://nirvaha-5cqj.onrender.com',

  // Check if we're in development mode (localhost or 127.0.0.1)
  IS_DEVELOPMENT:
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.startsWith('192.168.') ||
    window.location.hostname.startsWith('10.') ||
    window.location.hostname.startsWith('172.') ||
    window.location.hostname.endsWith('.local'),

  // Force local development (set to true for local development)
  FORCE_LOCAL: false,

  // Get the appropriate URL based on environment
  get API_BASE_URL() {
    const url = (this.IS_DEVELOPMENT || this.FORCE_LOCAL) ? this.LOCAL_API_URL : this.API_URL;
    console.log('🔗 Using API URL:', url);
    return url;
  },

  get SOCKET_BASE_URL() {
    const url = (this.IS_DEVELOPMENT || this.FORCE_LOCAL) ? this.LOCAL_SOCKET_URL : this.SOCKET_URL;
    console.log('🔌 Using Socket URL:', url);
    return url;
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
