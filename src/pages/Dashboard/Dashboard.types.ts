export type DashboardProps = Record<string, never>

export interface DashboardStats {
  totalCampaigns: number;
  totalSubscribers: number;
  averageOpenRate: number;
}

export interface Campaign {
  id: string;
  name: string;
  status: 'completed' | 'scheduled' | 'draft' | 'sending';
  sentAt?: string;
  scheduledFor?: string;
}