import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  KeyRound,
  CheckCircle2,
  Building2
} from 'lucide-react';
import { AdminUser } from '../../types';
import { api } from '../../services/api';

interface AdminLoginProps {
  onSuccess: (user: AdminUser, token: string) => void;
  onCancel: () => void;
  logoutNotice?: string | null;
}

export function AdminLogin({ onSuccess, onCancel, logoutNotice }: AdminLoginProps) {
  const [email, setEmail] = useState('admin@luxeliving.in');
  const [password, setPassword] = useState('luxe2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please fill in both your executive email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.adminLogin(email.trim(), password);
      if (res.success && res.user && res.token) {
        if (rememberMe) {
          localStorage.setItem('luxeliving_admin_token', res.token);
          localStorage.setItem('luxeliving_admin_user', JSON.stringify(res.user));
        } else {
          sessionStorage.setItem('luxeliving_admin_token', res.token);
          sessionStorage.setItem('luxeliving_admin_user', JSON.stringify(res.user));
        }
        onSuccess(res.user, res.token);
      } else {
        setErrorMessage(res.message || 'Invalid credentials. Please use demo credentials below.');
      }
    } catch {
      setErrorMessage('An unexpected network error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 text-white flex flex-col justify-between p-4 sm:p-6 lg:p-10 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#22c55e]/30 selection:text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#22c55e]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header / Return to Public Portfolio */}
      <div className="relative z-10 max-w-5xl w-full mx-auto flex items-center justify-between">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/80 text-xs font-semibold text-neutral-300 hover:text-white transition-all cursor-pointer group shadow-sm active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-[#22c55e]" />
          <span>Return to Public Website</span>
        </button>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-800/60 border border-neutral-700/60 text-[11px] text-neutral-400">
          <ShieldCheck className="w-3.5 h-3.5 text-[#22c55e]" />
          <span>MahaRERA Reg. #A51900028491</span>
        </div>
      </div>

      {/* Center Auth Card */}
      <div className="relative z-10 max-w-md w-full mx-auto my-8">
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          {/* Logo & Headline */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-neutral-800 border border-neutral-700 text-white flex items-center justify-center font-bold text-xl mx-auto shadow-inner mb-3">
              <span className="text-[#22c55e]">L</span>L
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#22c55e]/15 border border-[#22c55e]/30 text-[#22c55e] text-[10px] font-bold uppercase tracking-wider mb-2">
              <KeyRound className="w-3 h-3" />
              Executive Access
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Portfolio Command Center
            </h2>
            <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
              Sign in to manage luxury estates, private showings, VIP inquiries, and MahaRERA advisory records.
            </p>
          </div>

          {/* Logout notification if user just signed out */}
          {logoutNotice && (
            <div className="mb-5 p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#22c55e] shrink-0" />
              <span>{logoutNotice}</span>
            </div>
          )}

          {/* Error message */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-red-950/60 border border-red-800/80 text-red-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Executive Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@luxeliving.in"
                  required
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 text-xs focus:outline-hidden focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  Password
                </label>
                <span className="text-[11px] text-neutral-400">
                  Demo: <code className="text-[#22c55e] font-mono font-bold">luxe2026</code>
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 text-xs focus:outline-hidden focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-200 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-400 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded-sm bg-neutral-950 border-neutral-700 text-[#22c55e] focus:ring-0 cursor-pointer"
                />
                <span>Remember session on this device</span>
              </label>
            </div>

            <button
              id="admin-login-submit"
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-white text-xs font-bold tracking-wide transition-all shadow-lg shadow-[#22c55e]/20 flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authorize & Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Fill Buttons */}
          <div className="mt-6 pt-5 border-t border-neutral-800">
            <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2.5 text-center flex items-center justify-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#22c55e]" />
              Quick Demo Accounts
            </p>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('admin@luxeliving.in', 'luxe2026')}
                className="w-full p-2.5 rounded-xl bg-neutral-800/60 hover:bg-neutral-800 border border-neutral-700/60 text-left flex items-center justify-between text-xs transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#22c55e]/20 text-[#22c55e] flex items-center justify-center font-bold text-[11px]">
                    PS
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-200 group-hover:text-white">Priya Sharma</p>
                    <p className="text-[10px] text-neutral-400">Managing Principal & Superadmin</p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-sm bg-neutral-700/60 text-neutral-300 font-mono">
                  Select
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('director@luxeliving.in', 'luxe2026')}
                className="w-full p-2.5 rounded-xl bg-neutral-800/60 hover:bg-neutral-800 border border-neutral-700/60 text-left flex items-center justify-between text-xs transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[11px]">
                    VS
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-200 group-hover:text-white">Vikram Singhania</p>
                    <p className="text-[10px] text-neutral-400">Portfolio Lead Director</p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-sm bg-neutral-700/60 text-neutral-300 font-mono">
                  Select
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Security Notice */}
      <div className="relative z-10 max-w-5xl w-full mx-auto text-center text-xs text-neutral-400 flex flex-col sm:flex-row items-center justify-between gap-2 pt-4 border-t border-neutral-800/60">
        <div className="flex items-center gap-2">
          <Building2 className="w-3.5 h-3.5 text-[#22c55e]" />
          <span>LuxeLiving India Private Client Group</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>256-Bit SSL Enforced</span>
          <span>•</span>
          <span>MahaRERA Audited</span>
          <span>•</span>
          <span>Laravel 11 REST API</span>
        </div>
      </div>
    </div>
  );
}
