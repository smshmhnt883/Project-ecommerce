'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/account';
  const urlError = searchParams.get('error');

  const { login, isLoading } = useAuth();

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (urlError && !errorMessage) {
      setErrorMessage(
        urlError === 'access_denied'
          ? 'Google sign-in was cancelled.'
          : decodeURIComponent(urlError)
      );
    }
  }, [urlError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const res = await login(emailOrPhone, password);
    if (res.success) {
      router.push(redirectTarget);
    } else if (res.requiresVerification) {
      router.push(
        `/verify?email=${encodeURIComponent(res.email || emailOrPhone)}&redirect=${encodeURIComponent(redirectTarget)}`
      );
    } else {
      setErrorMessage(res.message || 'Authentication failed.');
    }
  };

  return (
    <div className="max-w-md w-full bg-white rounded-2xl border border-ayur-border shadow-soft p-6 sm:p-10 space-y-6">
      {/* Header */}
      <div className="text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-ayur-green-800 block mb-1">
          AYURVEDA PATRON ACCESS
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl text-ayur-green-950 font-normal">
          Sign In to Your Account
        </h1>
        <p className="text-xs text-ayur-charcoal-600 mt-2">
          Access your orders, saved addresses, and wellness preferences.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Google OAuth Button */}
      <div className="space-y-4">
        <GoogleSignInButton
          redirectTarget={redirectTarget}
          text="Continue with Google"
        />

        <div className="relative flex items-center justify-center">
          <div className="border-t border-ayur-border w-full"></div>
          <span className="bg-white px-3 text-[11px] uppercase tracking-wider text-ayur-charcoal-500 font-medium shrink-0">
            or continue with email
          </span>
          <div className="border-t border-ayur-border w-full"></div>
        </div>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="font-semibold text-ayur-charcoal-800 block mb-1">
            Email Address or 10-Digit Mobile *
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              placeholder="e.g. yourname@example.com"
              className="w-full pl-3 pr-10 py-2.5 bg-ayur-ivory border border-ayur-border rounded-lg focus:outline-none focus:border-ayur-green-800 text-xs"
            />
            <Mail className="w-4 h-4 text-ayur-charcoal-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="font-semibold text-ayur-charcoal-800">
              Password *
            </label>
            <Link
              href="/forgot-password"
              className="text-[11px] text-ayur-green-800 font-medium hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-3 pr-10 py-2.5 bg-ayur-ivory border border-ayur-border rounded-lg focus:outline-none focus:border-ayur-green-800 text-xs"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-1 text-ayur-charcoal-400 hover:text-ayur-charcoal-700 absolute right-2.5 top-1/2 -translate-y-1/2"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="remember-me"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="rounded text-ayur-green-900 accent-ayur-green-900 w-3.5 h-3.5"
          />
          <label htmlFor="remember-me" className="ml-2 text-xs text-ayur-charcoal-700 cursor-pointer">
            Remember my session on this device
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-ayur-green-900 hover:bg-ayur-green-800 text-white rounded-lg font-semibold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 shadow-md"
        >
          {isLoading ? (
            <span>Authenticating...</span>
          ) : (
            <>
              <span>SIGN IN</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Footer link to register */}
      <div className="pt-4 border-t border-ayur-border text-center text-xs text-ayur-charcoal-600">
        <span>Don&apos;t have an account yet? </span>
        <Link href={`/register${redirectTarget !== '/account' ? `?redirect=${encodeURIComponent(redirectTarget)}` : ''}`} className="font-semibold text-ayur-green-900 hover:underline">
          Create Account
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="py-12 sm:py-20 bg-ayur-ivory min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="text-xs text-ayur-charcoal-500">Loading sign in...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
