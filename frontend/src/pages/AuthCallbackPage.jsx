import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { applyOAuthCallbackParams } from '../services/auth';
import { useAuth } from '../context/AuthContext';

export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [message, setMessage] = useState('Completing sign in…');

  useEffect(() => {
    let cancelled = false;

    async function finish() {
      const result = applyOAuthCallbackParams(searchParams);
      if (cancelled) return;

      if (!result.success) {
        setMessage(result.error || 'Google sign-in failed.');
        setTimeout(() => navigate('/login', { replace: true, state: { authError: result.error } }), 2500);
        return;
      }

      try {
        const currentUser = await refreshUser();
        const returnTo = result.returnTo || '/jobs';
        const needsProfile = !currentUser?.country || !currentUser?.city || !currentUser?.phone || !currentUser?.date_of_birth;
        window.history.replaceState({}, '', '/auth/callback');

        if (needsProfile) {
          navigate('/complete-profile', { replace: true });
          return;
        }

        navigate(returnTo.startsWith('/') ? returnTo : '/jobs', { replace: true });
      } catch {
        setMessage('Signed in but failed to load profile.');
        setTimeout(() => navigate('/login', { replace: true }), 2500);
      }
    }

    finish();
    return () => {
      cancelled = true;
    };
  }, [searchParams, navigate, refreshUser]);

  return (
    <div className="min-h-screen bg-[#FAF9F5] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center max-w-md w-full">
        <div className="w-12 h-12 rounded-xl bg-[#4F52E6] text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">
          J
        </div>
        <p className="text-slate-700 font-medium">{message}</p>
      </div>
    </div>
  );
}
