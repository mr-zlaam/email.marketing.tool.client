import { useAuth } from '@/context/AuthContext';
import { Calendar, MessageSquare, FileText, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SharedFeaturesProps {
  onFeatureSelect: (feature: string) => void;
}

export const SharedFeatures = ({ onFeatureSelect }: SharedFeaturesProps) => {
  const { isAdmin } = useAuth();

  const sharedFeatures = [
    {
      id: 'calendar',
      name: 'Campaign Calendar',
      description: 'View and manage your email campaign schedule',
      icon: Calendar,
      available: true,
      adminOnly: false
    },
    {
      id: 'templates',
      name: 'Email Templates',
      description: 'Create and manage reusable email templates',
      icon: FileText,
      available: false,
      adminOnly: false
    },
    {
      id: 'chat',
      name: 'Team Communication',
      description: 'Collaborate with team members',
      icon: MessageSquare,
      available: false,
      adminOnly: false
    },
    {
      id: 'settings',
      name: 'Account Settings',
      description: 'Manage your account preferences',
      icon: Settings,
      available: true,
      adminOnly: false
    }
  ];

  const filteredFeatures = sharedFeatures.filter(feature =>
    !feature.adminOnly || (feature.adminOnly && isAdmin)
  );

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Shared Features</h2>
        <p className="text-gray-600 text-sm">
          Features available to {isAdmin ? 'all users' : 'your role'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFeatures.map((feature) => {
          const Icon = feature.icon;

          return (
            <div
              key={feature.id}
              className={`border rounded-lg p-4 transition-all ${
                feature.available
                  ? 'border-gray-200 hover:border-amber-300 hover:shadow-sm'
                  : 'border-gray-100 bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  feature.available
                    ? 'bg-amber-100 text-amber-600'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1">
                  <h3 className={`font-medium ${
                    feature.available ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {feature.name}
                  </h3>
                  <p className={`text-sm mt-1 ${
                    feature.available ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {feature.description}
                  </p>

                  <div className="mt-3">
                    {feature.available ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onFeatureSelect(feature.id)}
                        className="text-amber-700 border-amber-200 hover:bg-amber-50"
                      >
                        Open
                      </Button>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded">
                        Coming Soon
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isAdmin && (
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Settings className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-amber-800">Admin Preview</h4>
              <p className="text-sm text-amber-700 mt-1">
                You're seeing shared features that will be available to all users.
                These features are designed to work across different user roles.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};