import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  IconUpload,
  IconRefresh,
  IconMail,
  IconArrowLeft,
} from '@tabler/icons-react';

export const CreateCampaign = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="mb-4 text-gray-600 hover:text-gray-900">
              <IconArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
              <IconMail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Create New Campaign
              </h1>
              <p className="text-gray-600">
                Choose how you want to create your email campaign
              </p>
            </div>
          </div>
        </div>

        {/* Campaign Options */}
        <div className="grid gap-6 md:grid-cols-2 max-w-4xl">
          {/* Upload New File Option */}
          <Link to="/email-composer">
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-500 group h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <IconUpload className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Upload New File</CardTitle>
                    <CardDescription className="text-base">
                      Create a completely new campaign
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-gray-600">
                    Perfect for launching fresh email campaigns with new subscriber lists.
                  </p>
                  <div className="text-sm text-gray-500 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                      Upload CSV or Excel file
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                      Create new email campaign from scratch
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                      Set up campaign details and content
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Use Existing Campaign Option */}
          <Link to="/existing-campaigns">
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-green-500 group h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <IconRefresh className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Use Existing Campaign</CardTitle>
                    <CardDescription className="text-base">
                      Create new batches from uploaded lists
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-gray-600">
                    Ideal for follow-up campaigns, A/B testing, or continuing previous campaigns.
                  </p>
                  <div className="text-sm text-gray-500 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                      Select from existing uploads
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                      Create additional batches with different content
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                      Continue previous campaigns efficiently
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Help Section */}
        <div className="mt-12 bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Need Help Choosing?</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Choose "Upload New File" when:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• You have a fresh list of email addresses</li>
                <li>• Starting a completely new campaign</li>
                <li>• Your existing campaigns are finished</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Choose "Use Existing Campaign" when:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• You want to send follow-up emails</li>
                <li>• Testing different content with same audience</li>
                <li>• Previous batches were paused and you want to continue</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};