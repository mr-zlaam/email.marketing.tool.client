import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Login } from '@/pages/Login/Login';
import { Dashboard } from '@/pages/Dashboard/Dashboard';
import { CreateCampaign } from '@/pages/CreateCampaign/CreateCampaign';
import { ExistingCampaigns } from '@/pages/ExistingCampaigns/ExistingCampaigns';
import { EmailComposer } from '@/pages/EmailComposer/EmailComposer';
import { ManageCampaigns } from '@/pages/ManageCampaigns/ManageCampaigns';
import { UserManagement } from '@/pages/UserManagement/UserManagement';
import { CreateUser } from '@/pages/CreateUser/CreateUser';
import { Analytics } from '@/pages/Analytics/Analytics';
import { Toaster } from '@/components/ui/sonner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />

      {/* All other routes require authentication */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-campaign"
        element={
          <ProtectedRoute>
            <CreateCampaign />
          </ProtectedRoute>
        }
      />

      <Route
        path="/existing-campaigns"
        element={
          <ProtectedRoute>
            <ExistingCampaigns />
          </ProtectedRoute>
        }
      />

      <Route
        path="/email-composer"
        element={
          <ProtectedRoute>
            <EmailComposer />
          </ProtectedRoute>
        }
      />

      <Route
        path="/manage-campaigns"
        element={
          <ProtectedRoute>
            <ManageCampaigns />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user-management"
        element={
          <ProtectedRoute>
            <UserManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-user"
        element={
          <ProtectedRoute>
            <CreateUser />
          </ProtectedRoute>
        }
      />

      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        }
      />

      {/* Any other path redirects to dashboard if authenticated, or login if not */}
      <Route
        path="*"
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppRoutes />
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
