import { ArrowLeft, BarChart3, TrendingUp, Users, Mail, Eye, MousePointer } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AnalyticsProps {
  onBack: () => void;
}

export const Analytics = ({ onBack }: AnalyticsProps) => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-800 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600">Comprehensive email marketing insights and performance metrics</p>
            </div>
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Campaigns</h3>
              <Mail className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">47</p>
            <p className="text-sm text-green-600 mt-1">+12% from last month</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Subscribers</h3>
              <Users className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">12,847</p>
            <p className="text-sm text-green-600 mt-1">+8.2% from last month</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Average Open Rate</h3>
              <Eye className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">24.8%</p>
            <p className="text-sm text-red-600 mt-1">-2.1% from last month</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Click-through Rate</h3>
              <MousePointer className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">3.7%</p>
            <p className="text-sm text-green-600 mt-1">+0.8% from last month</p>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Performance Trends</h2>
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">Chart visualization coming soon</p>
                <p className="text-sm text-gray-400">Integration with charting library pending</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Performing Campaigns</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <h4 className="font-medium text-gray-900">Black Friday Sale 2024</h4>
                  <p className="text-sm text-gray-600">Sent 3 days ago • 8,942 recipients</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">32.1%</p>
                  <p className="text-xs text-gray-500">Open rate</p>
                </div>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <h4 className="font-medium text-gray-900">Product Launch Announcement</h4>
                  <p className="text-sm text-gray-600">Sent 1 week ago • 12,156 recipients</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">28.7%</p>
                  <p className="text-xs text-gray-500">Open rate</p>
                </div>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <h4 className="font-medium text-gray-900">Welcome Series - Week 1</h4>
                  <p className="text-sm text-gray-600">Ongoing • 2,384 recipients</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">41.3%</p>
                  <p className="text-xs text-gray-500">Open rate</p>
                </div>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <h4 className="font-medium text-gray-900">Monthly Newsletter</h4>
                  <p className="text-sm text-gray-600">Sent 2 weeks ago • 11,834 recipients</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-amber-600">19.4%</p>
                  <p className="text-xs text-gray-500">Open rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Analytics Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Subscriber Growth</h2>
            <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500 text-sm">Growth chart placeholder</p>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">This month</span>
                <span className="font-medium text-green-600">+1,047</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Last month</span>
                <span className="font-medium text-gray-900">+967</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Device Analytics</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Desktop</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-amber-600 h-2 rounded-full" style={{width: '64%'}}></div>
                  </div>
                  <span className="text-sm font-medium">64%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Mobile</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-amber-600 h-2 rounded-full" style={{width: '28%'}}></div>
                  </div>
                  <span className="text-sm font-medium">28%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tablet</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-amber-600 h-2 rounded-full" style={{width: '8%'}}></div>
                  </div>
                  <span className="text-sm font-medium">8%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Engagement Insights</h2>
            <div className="space-y-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">87%</p>
                <p className="text-sm text-green-700">Delivery Rate</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">2.4%</p>
                <p className="text-sm text-blue-700">Unsubscribe Rate</p>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-lg">
                <p className="text-2xl font-bold text-amber-600">0.3%</p>
                <p className="text-sm text-amber-700">Bounce Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Notice */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <BarChart3 className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-800">Admin Analytics Access</h3>
              <p className="text-sm text-amber-700 mt-1">
                This comprehensive analytics dashboard is currently available only to admin users.
                Future updates will include shared analytics features for all user roles.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};