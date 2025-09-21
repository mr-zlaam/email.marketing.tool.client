import { useState } from 'react';
import { EmailSidebar } from '@/components/email-sidebar';
import { EmailSiteHeader } from '@/components/email-site-header';
import { CreateUser } from '@/pages/CreateUser/CreateUser';
import { Analytics } from '@/pages/Analytics/Analytics';
import { EmailComposer } from '@/pages/EmailComposer/EmailComposer';
import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const Dashboard = () => {
  const [currentView, setCurrentView] = useState<string>('dashboard');

  const handleNavigate = (view: string) => {
    setCurrentView(view);
  };

  if (currentView === 'createUser') {
    return (
      <SidebarProvider
        style={{
          "--sidebar-width": "280px",
          "--header-height": "60px",
        } as React.CSSProperties}
      >
        <EmailSidebar onNavigate={handleNavigate} variant="inset" />
        <SidebarInset>
          <EmailSiteHeader title="Create User" />
          <div className="flex flex-1 flex-col p-6">
            <CreateUser onBack={() => handleNavigate('dashboard')} />
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (currentView === 'analytics') {
    return (
      <SidebarProvider
        style={{
          "--sidebar-width": "280px",
          "--header-height": "60px",
        } as React.CSSProperties}
      >
        <EmailSidebar onNavigate={handleNavigate} variant="inset" />
        <SidebarInset>
          <EmailSiteHeader title="Analytics" />
          <div className="flex flex-1 flex-col p-6">
            <Analytics onBack={() => handleNavigate('dashboard')} />
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (currentView === 'emailComposer') {
    return (
      <SidebarProvider
        style={{
          "--sidebar-width": "280px",
          "--header-height": "60px",
        } as React.CSSProperties}
      >
        <EmailSidebar onNavigate={handleNavigate} variant="inset" />
        <SidebarInset>
          <EmailSiteHeader title="Email Composer" />
          <div className="flex flex-1 flex-col">
            <EmailComposer onBack={() => handleNavigate('dashboard')} />
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "280px",
        "--header-height": "60px",
      } as React.CSSProperties}
    >
      <EmailSidebar onNavigate={handleNavigate} variant="inset" />
      <SidebarInset>
        <EmailSiteHeader title="Dashboard" />
        <div className="flex flex-1 flex-col p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
                <div className="h-4 w-4 rounded bg-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+2 from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
                <div className="h-4 w-4 rounded bg-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">+180 from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
                <div className="h-4 w-4 rounded bg-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24.5%</div>
                <p className="text-xs text-muted-foreground">+2.1% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
                <div className="h-4 w-4 rounded bg-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.2%</div>
                <p className="text-xs text-muted-foreground">+0.4% from last month</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Recent Campaigns */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Campaigns</CardTitle>
                <CardDescription>Your latest email marketing campaigns</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Welcome Series</p>
                    <p className="text-xs text-muted-foreground">Sent 2 days ago</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Delivered</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Product Launch</p>
                    <p className="text-xs text-muted-foreground">Sent 1 week ago</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Delivered</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Monthly Newsletter</p>
                    <p className="text-xs text-muted-foreground">Scheduled for tomorrow</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">Scheduled</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your email marketing platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-3">
                  <div
                    onClick={() => handleNavigate('emailComposer')}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 text-sm font-medium">📧</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Create Campaign</p>
                        <p className="text-xs text-muted-foreground">Compose and send emails</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-not-allowed opacity-60">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded bg-green-100 flex items-center justify-center">
                        <span className="text-green-600 text-sm font-medium">👥</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Manage Subscribers</p>
                        <p className="text-xs text-muted-foreground">Coming Soon</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-not-allowed opacity-60">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded bg-purple-100 flex items-center justify-center">
                        <span className="text-purple-600 text-sm font-medium">📝</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Email Templates</p>
                        <p className="text-xs text-muted-foreground">Coming Soon</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Welcome Section */}
          <Card>
            <CardHeader>
              <CardTitle>Welcome to your Email Marketing Dashboard</CardTitle>
              <CardDescription>
                Manage your email campaigns, track performance, and grow your subscriber base all from one place.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex items-start space-x-3 p-4 border rounded-lg">
                    <div className="h-8 w-8 rounded bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 text-sm">📊</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Track Performance</h4>
                      <p className="text-xs text-muted-foreground">Monitor open rates, click rates, and subscriber growth in real-time.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 border rounded-lg">
                    <div className="h-8 w-8 rounded bg-green-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 text-sm">🎯</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Target Audiences</h4>
                      <p className="text-xs text-muted-foreground">Segment your subscribers and send personalized campaigns.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 border rounded-lg">
                    <div className="h-8 w-8 rounded bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-600 text-sm">⚡</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Automation</h4>
                      <p className="text-xs text-muted-foreground">Set up automated email sequences and drip campaigns.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};