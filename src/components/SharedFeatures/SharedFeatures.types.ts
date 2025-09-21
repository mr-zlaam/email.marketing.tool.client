export interface SharedFeaturesProps {
  onFeatureSelect: (feature: string) => void;
}

export interface SharedFeature {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  available: boolean;
  adminOnly: boolean;
  comingSoon?: boolean;
}