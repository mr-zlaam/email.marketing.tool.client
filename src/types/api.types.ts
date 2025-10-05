// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  status: number;
  message: string;
  data?: T;
  requestInfo?: {
    url: string;
    ip: string;
    method: string;
  };
}

export interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalRecord: number; // Updated to match new backend
  totalPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationInfo;
}

// User Types
export interface User {
  uid: string;
  username: string;
  fullName: string;
  email: string;
  role: "ADMIN" | "USER";
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  username: string;
  fullName: string;
  email: string;
  password: string;
}

export type CreateUserResponse = ApiResponse<{ user: User }>;

export type GetUsersResponse = ApiResponse<{
  data: User[];
  pagination: PaginationInfo;
}>;

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
  message: string;
}

// Email Batch Types
export interface EmailBatch {
  id: number;
  batchId: string;
  batchName: string;
  totalEmails: number;
  status: "pending" | "processing" | "paused" | "completed" | "failed";
  emailsPerBatch: number;
  delayBetweenEmails: number;
  subject: string;
  composedEmail?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmailUpload {
  id: number;
  uploadedFileName: string;
  totalEmails: number;
  totalEmailSentToQueue: number;
  remainingEmails: number;
  status: string;
  uploadedBy: string;
  createdAt: string;
  metaData: unknown;
  batches: EmailBatch[];
}

export interface CreateEmailBatchRequest {
  batchName: string;
  subject: string;
  composedEmail: string;
  scheduleTime: "NOW" | string;
  delayBetweenEmails: string;
  emailsPerBatch: string;
  file?: File;
  uploadId?: number;
}

export type CreateEmailBatchResponse = ApiResponse<{
  batch: EmailBatch;
  uploadId: number;
  totalEmails: number;
  status: string;
  operation: "created" | "resumed";
}>;

export type GetUploadsWithBatchesResponse = ApiResponse<{
  uploads: EmailUpload[];
  pagination: PaginationInfo;
}>;

export type GetSingleUploadResponse = ApiResponse<{
  upload: EmailUpload;
  totalBatches: number;
}>;

export interface DeletedCampaignData {
  uploadId: number;
  uploadedFileName: string;
  uploadedBy: string;
  batchId: string;
  batchName: string;
  deletedIndividualEmails: number;
  removedQueuedJobs: string;
  redisCleanup: string;
}

export type DeleteCampaignResponse = ApiResponse<{
  deletedCampaign: DeletedCampaignData;
  deletedAt: string;
}>;

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
