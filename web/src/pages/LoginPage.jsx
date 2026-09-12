import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GlassCard } from '../components/GlassCard';
import { Mail, Lock, LogIn, UserCheck, AlertCircle } from 'lucide-react';

export const LoginPage = ({ onNavigate }) => {
  const { login, loginAsGuest } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      onNavigate('home');
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = () => {
    loginAsGuest();
    onNavigate('home');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 animate-fade-in">
      <GlassCard className="p-8 border-gold-500/30">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-gold-400 mx-auto flex items-center justify-center text-3xl shadow-glow-gold mb-3">
            ♟️
          </div>
          <h2 className="text-2xl font-black text-white">Sign In to PressureChess</h2>
          <p className="text-xs text-slate-400 mt-1">
            Access your rating, streak, and match history
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="master@pressurechess.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-dark-800/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-gold-400 transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={() => onNavigate('forgot-password')}
                className="text-xs text-gold-400 hover:underline"
              >
                Forgot?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-dark-800/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-gold-400 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-black font-extrabold text-sm shadow-glow-gold transition-all duration-200 flex items-center justify-center gap-2 mt-2"
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <span className="relative px-3 bg-dark-900 text-slate-500 text-[11px] uppercase tracking-wider">
            Or quick play
          </span>
        </div>

        <button
          onClick={handleGuest}
          className="w-full py-3 rounded-xl bg-dark-800/80 hover:bg-dark-700 border border-white/10 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
        >
          <UserCheck className="w-4 h-4 text-emerald-400" />
          Continue as Guest Mode
        </button>

        <p className="text-center text-xs text-slate-400 mt-6">
          Don't have an account?{' '}
          <button
            onClick={() => onNavigate('signup')}
            className="text-gold-400 font-bold hover:underline"
          >
            Create Account
          </button>
        </p>

      </GlassCard>
    </div>
  );
};
