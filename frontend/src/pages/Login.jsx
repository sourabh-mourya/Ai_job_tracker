import { useState } from 'react';
import { Lock, ArrowRight, Zap, Briefcase } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAppStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) return;

    setLoading(true);
    setError('');

    try {
      // Send a lightweight test request to verify password
      const API = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:8000/api' : '/api');
      const res = await fetch(`${API}/applications?limit=1`, {
        headers: { 'x-app-password': password }
      });

      if (res.status === 401) {
        setError('Nice try! 😂 Only Admin has access.');
      } else {
        login(password);
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col items-center justify-center p-4">

      <div className="mb-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 mx-auto mb-4">
          <Briefcase className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">AI Job Tracker</h1>
        <p className="text-sm text-gray-500 font-medium flex items-center justify-center space-x-1 mt-1">
          <Zap className="w-4 h-4 text-amber-500" />
          <span>Workspace of Sourabh</span>
        </p>
      </div>

      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-indigo-50 rounded-full">
            <Lock className="w-6 h-6 text-indigo-600" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 text-center mb-2">Restricted Access</h2>
        <p className="text-sm text-gray-500 text-center mb-8">Please enter your Master Password to unlock the workspace.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className={`w-full px-4 py-3 rounded-xl border ${error ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200' : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-200'} bg-gray-50/50 focus:bg-white transition-all outline-none text-center tracking-widest text-lg font-medium`}
              autoFocus
            />
            {error && <p className="text-rose-500 text-xs font-medium text-center mt-2 animate-pulse">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={!password || loading}
            className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            <span>{loading ? 'Verifying...' : 'Unlock Workspace'}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}
