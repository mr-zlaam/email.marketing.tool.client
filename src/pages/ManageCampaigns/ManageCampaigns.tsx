import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { CampaignList } from '../Dashboard/CampaignList';
import { Button } from '@/components/ui/button';
import {
  IconArrowLeft,
  IconFileText,
} from '@tabler/icons-react';

export const ManageCampaigns = () => {
  return (
    <Layout title="Manage Campaigns">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link to="/">
              <Button
                variant="ghost"
                className="mb-4 text-gray-600 hover:text-gray-900"
              >
                <IconArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
              <IconFileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Manage Campaigns
              </h1>
              <p className="text-gray-600">
                View and manage all your email marketing campaigns
              </p>
            </div>
          </div>
        </div>

        {/* Campaign List */}
        <CampaignList />
        </div>
      </div>
    </Layout>
  );
};