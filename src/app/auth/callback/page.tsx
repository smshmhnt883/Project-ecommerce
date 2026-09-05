'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { insforge } from '@/lib/insforge';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, refreshSession } = useAuth();
  const { showToast } = useToast();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const hasRedirected = useRef(false);

  // Helper to determine intended landing destination
  const getDestination = () => {
    try {
      if (typeof window !== 'undefined') {
        const stored = sessionStorage.getItem('auth_redirect');
        if (stored) {
          sessionStorage.removeItem('auth_redirect');
          return stored;
        }
      }
    } catch {}
    const param = searchParams.get('redirect');
    if (param) return param;
    return '/shop';
  };

  // Immediate redirect executor with router.replace + hard location fallback
  const performRedirect = (dest?: string) => {
    if (hasRedirected.current) return;
    hasRedirected.current = true;

    const target = dest || getDestination();
    setStatus('success');
    showToast('Signed in successfully with Google!', 'success');

    // Immediate Next.js router transition
    try {
      router.replace(target);
    } catch {}

    // Safety hard-redirect fallback if Next.js router stalls or shallow-navigates
    setTimeout(() => {
      if (typeof window !== 'undefined' && window.location.pathname.includes('/auth/callback')) {
        window.location.replace(target);
      }
    }, 200);
  };

  // Immediate check 1: If AuthContext already has authenticated user, redirect right away
  useEffect(() => {
    if (isAuthenticated && user && !hasRedirected.current) {
      performRedirect();
    }
  }, [isAuthenticated, user]);

  // Main OAuth resolution & timeout fallback
  useEffect(() => {
    // 1. If error parameter returned from OAuth provider
    const errorParam = searchParams.get('error');
    const errorDesc = searchParams.get('error_description');
    if (errorParam) {
      hasRedirected.current = true;
      const msg =
        errorParam === 'access_denied'
          ? 'Google sign-in was cancelled.'
          : errorDesc || errorParam || 'Google authentication encountered an error.';
      setStatus('error');
      setErrorMessage(msg);
      showToast(msg, 'error');
      setTimeout(() => {
        window.location.replace('/login');
      }, 1500);
      return;
    }

    // 2. Check local session storage cache for instant redirect
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('patanjali_user');
        if (cached && !hasRedirected.current) {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.id) {
            performRedirect();
            return;
          }
        }
      } catch {}
    }

    // 3. Resolve session from InsForge
    async function resolveOAuthUser() {
      try {
        const { data, error } = await insforge.auth.getCurrentUser();
        if (!error && data?.user) {
          const authUser = data.user;

          // Non-blocking background profile upsert
          const profileObj = (authUser.profile as any) || {};
          const fullName =
            profileObj.name ||
            profileObj.full_name ||
            authUser.email?.split('@')[0] ||
            'Patanjali Member';
          const email = authUser.email || '';

          (async () => {
            try {
              const { data: existingProfile } = await insforge.database
                .from('profiles')
                .select('id')
                .eq('user_id', authUser.id)
                .maybeSingle();

              if (!existingProfile) {
                await insforge.database.from('profiles').insert({
                  user_id: authUser.id,
                  full_name: fullName,
                  email: email,
                  phone: null,
                });
              }
            } catch (pe) {
              console.warn('Background profile sync warning:', pe);
            }
          })();

          // Trigger background session refresh
          refreshSession().catch(() => {});

          // Redirect immediately without waiting for database operations
          performRedirect();
          return;
        }
      } catch (err) {
        console.warn('OAuth resolution check:', err);
      }
    }

    resolveOAuthUser();

    // 4. Safety Timeout Fallback: NEVER allow spinner to hang indefinitely
    const safetyTimer = setTimeout(async () => {
      if (hasRedirected.current) return;

      try {
        // Final attempt to check user
        const { data } = await insforge.auth.getCurrentUser();
        if (data?.user) {
          performRedirect();
          return;
        }

        const cached = localStorage.getItem('patanjali_user');
        if (cached) {
          performRedirect();
          return;
        }
      } catch {}

      // If still unresolved after safety threshold, route back to login cleanly
      if (!hasRedirected.current) {
        hasRedirected.current = true;
        setStatus('error');
        const timeoutMsg = 'Authentication verification timed out. Please try signing in again.';
        setErrorMessage(timeoutMsg);
        showToast(timeoutMsg, 'error');
        setTimeout(() => {
          window.location.replace('/login');
        }, 1200);
      }
    }, 2000);

    return () => {
      clearTimeout(safetyTimer);
    };
  }, [searchParams]);

  return (
    <div className="max-w-md w-full bg-white rounded-2xl border border-ayur-border shadow-soft p-8 sm:p-10 text-center space-y-6">
      {status === 'loading' && (
        <div className="space-y-4 py-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-ayur-cream flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-ayur-green-800 animate-spin" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-ayur-green-800 block mb-1">
              AYURVEDIC ACCESS
            </span>
            <h1 className="font-serif text-2xl text-ayur-green-950 font-normal">
              Connecting to Google
            </h1>
            <p className="text-xs text-ayur-charcoal-600 mt-2 leading-relaxed">
              Verifying your credentials and synchronizing your account preferences...
            </p>
          </div>
        </div>
      )}

      {status === 'success' && (
        <div className="space-y-4 py-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="font-serif text-2xl text-ayur-green-950 font-normal">
              Sign In Successful
            </h1>
            <p className="text-xs text-ayur-charcoal-600 mt-2">
              Redirecting you to your destination...
            </p>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="space-y-4 py-2">
          <div className="w-12 h-12 mx-auto rounded-full bg-red-50 border border-red-200 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h1 className="font-serif text-xl text-ayur-green-950 font-normal">
              Authentication Notice
            </h1>
            <p className="text-xs text-red-700 mt-2 bg-red-50 p-3 rounded-lg border border-red-200 text-left">
              {errorMessage}
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-6 py-2.5 bg-ayur-green-900 hover:bg-ayur-green-800 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <div className="py-16 sm:py-24 bg-ayur-ivory min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <Suspense
        fallback={
          <div className="max-w-md w-full bg-white rounded-2xl border border-ayur-border shadow-soft p-10 text-center space-y-4">
            <Loader2 className="w-6 h-6 text-ayur-green-800 animate-spin mx-auto" />
            <p className="text-xs text-ayur-charcoal-500">Initializing secure session...</p>
          </div>
        }
      >
        <AuthCallbackContent />
      </Suspense>
    </div>
  );
}
