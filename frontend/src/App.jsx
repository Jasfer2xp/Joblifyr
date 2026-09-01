import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AuthCallbackPage from './pages/AuthCallbackPage';
import JoblifyrApp from './pages/JoblifyrApp';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/" element={<JoblifyrApp />} />
        <Route path="/login" element={<JoblifyrApp />} />
        <Route path="/register" element={<JoblifyrApp />} />
        <Route path="/verify" element={<JoblifyrApp />} />
        <Route path="/profile" element={<JoblifyrApp />} />
        <Route path="/jobs" element={<JoblifyrApp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
