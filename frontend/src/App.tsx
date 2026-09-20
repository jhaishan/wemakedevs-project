import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProvider, useUser } from './context/UserContext';
import { Navbar } from './components/layout/Navbar';
import { LoginPage } from './pages/LoginPage';
import { ReportPage } from './pages/ReportPage';
import { MyComplaintsPage } from './pages/MyComplaintsPage';
import { DashboardPage } from './pages/DashboardPage';
import { ComplaintDetailPage } from './pages/ComplaintDetailPage';

const queryClient = new QueryClient();

// Protected Route Wrapper
function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) {
  const { user } = useUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect based on role if they try to access something they shouldn't
    return <Navigate to={user.role === 'STUDENT' ? '/report' : '/dashboard'} replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/report"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <ReportPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-complaints"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <MyComplaintsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['WARDEN', 'STAFF', 'ADMIN']}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/complaints/:id"
            element={
              <ProtectedRoute>
                <ComplaintDetailPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <Router>
          <AppRoutes />
        </Router>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
