'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { login, type AuthState } from '@/app/actions/auth';
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function LoginForm() {
  const searchParams = useSearchParams();
  const urlError = searchParams.get('error');
  const [state, action, pending] = useActionState<AuthState, FormData>(login, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-[420px]">
      {/* Card */}
      <div className="bg-white/[0.06] backdrop-blur-xl border border-white/[0.1] rounded-[2rem] p-8 lg:p-10 shadow-2xl shadow-black/20">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-white mb-2">Welcome back</h1>
          <p className="text-sm text-white/50">Log in to your FunnelLink account</p>
        </div>

        {/* Error / URL Error */}
        {(state?.error || urlError) && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20">
            <p className="text-sm text-red-400 text-center">{state?.error || urlError}</p>
          </div>
        )}

        {/* Form */}
        <form action={action} className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3.5 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-[#d2e823]/50 focus:ring-1 focus:ring-[#d2e823]/30 transition-all"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="block text-xs font-semibold text-white/60 uppercase tracking-wider">
                Password
              </label>
              <a href="#" className="text-xs text-[#d2e823]/80 hover:text-[#d2e823] transition-colors font-medium">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full px-4 py-3.5 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-[#d2e823]/50 focus:ring-1 focus:ring-[#d2e823]/30 transition-all pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors p-1"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={pending}
            className="w-full btn-lime py-3.5 text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {pending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Logging in...
              </>
            ) : (
              <>
                Log in
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-white/[0.08]" />
          <span className="text-xs text-white/30">OR</span>
          <div className="flex-1 h-px bg-white/[0.08]" />
        </div>

        {/* Google OAuth placeholder */}
        <button
          type="button"
          disabled
          className="w-full py-3.5 rounded-full bg-white/[0.06] border border-white/[0.1] text-white/50 text-sm font-medium flex items-center justify-center gap-3 cursor-not-allowed hover:bg-white/[0.08] transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continue with Google (Coming soon)
        </button>
      </div>

      {/* Sign up link */}
      <p className="text-center mt-8 text-sm text-white/40">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-[#d2e823] font-semibold hover:text-[#e4f73a] transition-colors">
          Sign up free
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-white/50 text-sm">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
