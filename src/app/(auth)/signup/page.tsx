'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { signup, type AuthState } from '@/app/actions/auth';
import { Eye, EyeOff, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export default function SignupPage() {
  const [state, action, pending] = useActionState<AuthState, FormData>(signup, null);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');

  const requirements = [
    { label: 'At least 6 characters', met: password.length >= 6 },
    { label: 'Contains a letter', met: /[a-zA-Z]/.test(password) },
    { label: 'Contains a number', met: /[0-9]/.test(password) },
  ];

  // Success state
  if (state?.message) {
    return (
      <div className="w-full max-w-[420px]">
        <div className="bg-white/[0.06] backdrop-blur-xl border border-white/[0.1] rounded-[2rem] p-8 lg:p-10 shadow-2xl shadow-black/20 text-center">
          <div className="w-16 h-16 rounded-full bg-[#22c55e]/15 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={32} className="text-[#22c55e]" />
          </div>
          <h1 className="text-2xl font-extrabold text-white mb-3">Check your email</h1>
          <p className="text-sm text-white/50 leading-relaxed mb-8">
            {state.message}
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 btn-lime px-8 py-3.5 text-sm"
          >
            Go to login
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[420px]">
      {/* Card */}
      <div className="bg-white/[0.06] backdrop-blur-xl border border-white/[0.1] rounded-[2rem] p-8 lg:p-10 shadow-2xl shadow-black/20">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-white mb-2">Create your account</h1>
          <p className="text-sm text-white/50">Start converting visitors into leads</p>
        </div>

        {/* Error */}
        {state?.error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20">
            <p className="text-sm text-red-400 text-center">{state.error}</p>
          </div>
        )}

        {/* Form */}
        <form action={action} className="space-y-5">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder="John Doe"
              className="w-full px-4 py-3.5 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-[#d2e823]/50 focus:ring-1 focus:ring-[#d2e823]/30 transition-all"
            />
          </div>

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
            <label htmlFor="password" className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

            {/* Password Requirements */}
            {password.length > 0 && (
              <div className="mt-3 space-y-1.5">
                {requirements.map((req) => (
                  <div key={req.label} className="flex items-center gap-2">
                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${req.met ? 'bg-[#22c55e]/20' : 'bg-white/[0.06]'}`}>
                      {req.met ? (
                        <svg width="8" height="8" viewBox="0 0 12 12" fill="none"><path d="M3 6l2 2 4-4" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      ) : (
                        <div className="w-1 h-1 rounded-full bg-white/20" />
                      )}
                    </div>
                    <span className={`text-xs ${req.met ? 'text-[#22c55e]/80' : 'text-white/30'}`}>{req.label}</span>
                  </div>
                ))}
              </div>
            )}
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
                Creating account...
              </>
            ) : (
              <>
                Create account
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Terms */}
        <p className="text-[11px] text-white/25 text-center mt-5 leading-relaxed">
          By creating an account, you agree to our{' '}
          <a href="#" className="text-white/40 hover:text-white/60 underline transition-colors">Terms of Service</a>{' '}
          and{' '}
          <a href="#" className="text-white/40 hover:text-white/60 underline transition-colors">Privacy Policy</a>.
        </p>
      </div>

      {/* Login link */}
      <p className="text-center mt-8 text-sm text-white/40">
        Already have an account?{' '}
        <Link href="/login" className="text-[#d2e823] font-semibold hover:text-[#e4f73a] transition-colors">
          Log in
        </Link>
      </p>
    </div>
  );
}
