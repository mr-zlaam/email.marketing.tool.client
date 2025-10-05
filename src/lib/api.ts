const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

export class ApiError extends Error {
  public status: number;
  public data: unknown;

  constructor(status: number, data: unknown, message?: string) {
    super(message || `API Error: ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getAuthToken(): string | null {
    return localStorage.getItem("accessToken");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
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
        throw new ApiError(
          response.status,
          errorData,
          (errorData as { message?: string })?.message
        );
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      }

      return response as unknown as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error("Network error occurred");
    }
  }

  // Authentication
  async login(
    email: string,
    password: string
  ): Promise<{ accessToken: string; user: unknown }> {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: {
    username: string;
    fullName: string;
    email: string;
    password: string;
  }): Promise<{ accessToken: string; user: unknown }> {
    return this.request("/user/registerUser", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  // User Management
  async createUser(userData: {
    username: string;
    fullName: string;
    email: string;
    password: string;
  }): Promise<{ user: unknown }> {
    return this.request("/user/adminCreatesTheUser", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async getAllUsers(): Promise<{ users: unknown[]; pagination: unknown }> {
    return this.request(`/user/getAllUser`);
  }

  async deleteUser(userId: string): Promise<{ message: string }> {
    return this.request(`/user/deleteUser/${userId}`, {
      method: "DELETE",
    });
  }

  // Email Batch Management
  async createEmailBatch(formData: FormData): Promise<unknown> {
    const token = this.getAuthToken();
    const headers: Record<string, string> = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(
      `${this.baseURL}/emailBatch/createEmailBatch`,
      {
        method: "POST",
        headers,
        body: formData, // Don't set Content-Type for FormData
      }
    );

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }
      throw new ApiError(
        response.status,
        errorData,
        (errorData as { message?: string })?.message
      );
    }

    return response.json();
  }

  async getUploadsWithBatches(
    page = 1,
    pageSize = 10
  ): Promise<unknown> {
    return this.request(`/emailBatch/getUploadsWithBatches?page=${page}&pageSize=${pageSize}`);
  }

  async getUploadWithBatches(uploadId: number): Promise<unknown> {
    return this.request(`/emailBatch/getUploadsWithBatches?uploadId=${uploadId}`);
  }

  async createEmailBatchFromExistingUpload(data: {
    uploadId: number;
    batchName: string;
    subject: string;
    composedEmail: string;
    delayBetweenEmails: string;
    emailsPerBatch: string;
    scheduleTime: string;
  }) {
    return this.request<unknown>("/emailBatch/createEmailBatch", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async pauseBatch(batchId: string): Promise<{ message: string }> {
    return this.request(`/emailBatch/pauseBatch/${batchId}`, {
      method: "PATCH",
    });
  }

  async resumeBatch(batchId: string): Promise<{ message: string }> {
    return this.request(`/emailBatch/resumeBatch/${batchId}`, {
      method: "PATCH",
    });
  }

  async deleteCampaign(uploadId: number) {
    return this.request<unknown>(`/emailBatch/admin/deleteCampaign/${uploadId}`, {
      method: "DELETE",
    });
  }

  // Analytics (placeholder for future implementation)
  async getAnalytics(dateRange?: {
    from: string;
    to: string;
  }): Promise<unknown> {
    const params = new URLSearchParams();
    if (dateRange) {
      params.append("from", dateRange.from);
      params.append("to", dateRange.to);
    }
    return this.request(`/analytics?${params.toString()}`);
  }

  async getCampaignStats(campaignId: string): Promise<unknown> {
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
    console.info(error);
    const errorMessage =
      error instanceof ApiError
        ? (error.data as { message?: string })?.message || error.message
        : "An unexpected error occurred";

    onError?.(error as ApiError);
    return { data: null, error: errorMessage };
  }
};

export default apiClient;
