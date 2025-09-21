export interface AnalyticsProps {
  onBack: () => void;
}

export interface AnalyticsMetric {
  label: string;
  value: string | number;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: string;
}

export interface CampaignPerformance {
  id: string;
  name: string;
  sentDate: string;
  recipients: number;
  openRate: number;
  clickRate?: number;
  status: 'completed' | 'ongoing' | 'scheduled';
}

export interface DeviceAnalytics {
  device: string;
  percentage: number;
  color: string;
}

export interface EngagementMetric {
  label: string;
  value: number;
  unit: string;
  color: string;
}