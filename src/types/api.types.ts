// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// User Types
export interface User {
  uid: string;
  username: string;
  fullName: string;
  email: string;
  role: 'ADMIN' | 'USER';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  username: string;
  fullName: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'USER';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message: string;
}

// Email Batch Types
export interface EmailBatch {
  id: number;
  batchId: string;
  batchName: string;
  composedEmail: string;
  totalEmails: number;
  emailsSent: number;
  emailsFailed: number;
  status: 'pending' | 'sending' | 'completed' | 'failed';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmailBatchRequest {
  batchName: string;
  composedEmail: string;
  scheduleTime: 'NOW' | string; // ISO date string for scheduled
  delayBetweenEmails: string; // in seconds
  emailsPerBatch: string;
  file: File; // CSV/Excel file with emails
}

export interface EmailBatchResponse extends ApiResponse<EmailBatch> {
  totalEmails: number;
}

// Analytics Types
export interface CampaignStats {
  totalCampaigns: number;
  totalEmailsSent: number;
  totalEmailsFailed: number;
  averageOpenRate: number;
  averageClickRate: number;
  recentCampaigns: EmailBatch[];
}

export type AnalyticsResponse = ApiResponse<CampaignStats>;

// Error Types
export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: string;
  statusCode?: number;
}