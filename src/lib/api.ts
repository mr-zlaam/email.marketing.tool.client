const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export class ApiError extends Error {
  constructor(
    public status: number,
    public data: unknown,
    message?: string
  ) {
    super(message || `API Error: ${status}`);
    this.name = 'ApiError';
  }
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: response.statusText };
        }
        throw new ApiError(response.status, errorData, errorData.message);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }

      return response as unknown as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  // Authentication
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: {
    username: string;
    fullName: string;
    email: string;
    password: string;
    role: string;
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // User Management
  async createUser(userData: {
    username: string;
    fullName: string;
    email: string;
    password: string;
    role?: string;
  }) {
    return this.request('/user/adminCreatesTheUser', {
      method: 'POST',
      body: JSON.stringify({
        username: userData.username,
        fullName: userData.fullName,
        email: userData.email,
        password: userData.password,
      }),
    });
  }

  async getUsers(page = 1, limit = 10) {
    return this.request(`/users?page=${page}&limit=${limit}`);
  }

  async getUserProfile() {
    return this.request('/users/profile');
  }

  // Email Batch Management
  async createEmailBatch(formData: FormData) {
    const token = this.getAuthToken();
    const headers: HeadersInit = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseURL}/email-batch`, {
      method: 'POST',
      headers,
      body: formData, // Don't set Content-Type for FormData
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }
      throw new ApiError(response.status, errorData, errorData.message);
    }

    return response.json();
  }

  async getEmailBatches(page = 1, limit = 10) {
    return this.request(`/email-batch?page=${page}&limit=${limit}`);
  }

  async getEmailBatch(id: string) {
    return this.request(`/email-batch/${id}`);
  }

  async updateEmailBatchStatus(id: string, status: string) {
    return this.request(`/email-batch/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Analytics
  async getAnalytics(dateRange?: { from: string; to: string }) {
    const params = new URLSearchParams();
    if (dateRange) {
      params.append('from', dateRange.from);
      params.append('to', dateRange.to);
    }
    return this.request(`/analytics?${params.toString()}`);
  }

  async getCampaignStats(campaignId: string) {
    return this.request(`/analytics/campaign/${campaignId}`);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// Utility functions for common patterns
export const withErrorHandling = async <T>(
  apiCall: () => Promise<T>,
  onError?: (error: ApiError) => void
): Promise<{ data: T | null; error: string | null }> => {
  try {
    const data = await apiCall();
    return { data, error: null };
  } catch (error) {
    const errorMessage = error instanceof ApiError
      ? error.data?.message || error.message
      : 'An unexpected error occurred';

    onError?.(error as ApiError);
    return { data: null, error: errorMessage };
  }
};

export default apiClient;