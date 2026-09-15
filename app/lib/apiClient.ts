// apiclinet for api calls to the backend server. It handles authentication, user management, and admin functionalities.


const API_BASE_URL = process.env.NEXT_PUBLIC_API_KEY || 'http://localhost:3000'


class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      headers: { "Content-Type": "application/json", ...options.headers },
      credentials: "include",
      ...options,
    };

    const response = await fetch(url, config);

    if (response.status === 401) return null;

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Network error" }));
      throw new Error(error.error || "Request Failed");
    }

    return response.json(); // return parsed JSON, not the raw Response
  }

  //Auth methods 
  // Register method
  async register(userData: unknown) {
    return this.request('/api/auth/register', {
      method: "POST",
      body: JSON.stringify(userData)
    });
  }

  // Login method
  async login(email: string, password: string) {
    return this.request('/api/auth/login', {
      method: "POST",
      body: JSON.stringify({ email, password })
    });
  }

  //Logout method 
  async logout() {
    return this.request('/api/auth/logout', {
      method: "POST",
    });
  }

  //Me fetching user data 
  async getUserData() {
    return this.request('/api/auth/me')
  }

  // USERS METHOD
  async getUsers() {
    return this.request('/api/user')
  }


  // ADMIN METHODS

  async updateUserRole(userId: string, role: string) {
    return this.request(`/api/user/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role })
    })
  }

  async updateUserTeam(userId: string, teamId: string | null) {
    return this.request(`/api/user/${userId}/team`, {
      method: 'PATCH',
      body: JSON.stringify({ teamId })
    })
  }
}

export const apiClient = new ApiClient()


