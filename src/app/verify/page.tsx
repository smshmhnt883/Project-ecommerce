'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, ArrowRight, AlertCircle, CheckCircle2, RotateCw, Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function VerifyAccountForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email') || '';
  const redirectTarget = searchParams.get('redirect') || '/account';

  const { verifyCode, resendVerificationCode, user, isAuthenticated, isLoading } = useAuth();

  const [email, setEmail] = useState(emailParam || user?.email || '');
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(60);
  const [isResending, setIsResending] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // If already authenticated and verified, redirect immediately
  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectTarget);
    }
  }, [isAuthenticated, redirectTarget, router]);

  // If email came from searchParams or user state
  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam);
    } else if (user?.email) {
      setEmail(user.email);
    }
  }, [emailParam, user?.email]);

  // 60-second cooldown countdown
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  // Focus first input box on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleDigitChange = (index: number, val: string) => {
    setErrorMessage('');
    const clean = val.replace(/\D/g, '');

    // Handle paste of full 6-digit OTP
    if (clean.length > 1) {
      const chars = clean.slice(0, 6).split('');
      const newDigits = [...digits];
      chars.forEach((c, i) => {
        newDigits[i] = c;
      });
      setDigits(newDigits);
      const nextIndex = Math.min(5, chars.length);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const newDigits = [...digits];
    newDigits[index] = clean.slice(-1);
    setDigits(newDigits);

    // Auto-advance to next input
    if (clean && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasteData) return;

    const newDigits = [...digits];
    pasteData.split('').forEach((char, i) => {
      if (i < 6) newDigits[i] = char;
    });
    setDigits(newDigits);
    const focusIndex = Math.min(5, pasteData.length);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const code = digits.join('');
    if (code.length !== 6) {
      setErrorMessage('Please enter the full 6-digit verification code.');
      return;
    }

    if (!email.trim()) {
      setErrorMessage('Email address is required for verification.');
      return;
    }

    const res = await verifyCode(email, code);
    if (res.success) {
      setIsSuccess(true);
      setTimeout(() => {
        router.push(redirectTarget);
      }, 1200);
    } else {
      setErrorMessage(res.message || 'Invalid or expired verification code.');
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || isResending) return;
    if (!email.trim()) {
      setErrorMessage('Email address is required to resend code.');
      return;
    }

    setIsResending(true);
    setErrorMessage('');
    const res = await resendVerificationCode(email);
    setIsResending(false);

    if (res.success) {
      setCooldown(60);
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } else {
      setErrorMessage(res.message || 'Failed to resend code.');
    }
  };

  return (
    <div className="max-w-md w-full bg-white rounded-2xl border border-ayur-border shadow-soft p-6 sm:p-10 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-12 h-12 bg-ayur-cream rounded-full flex items-center justify-center mx-auto mb-3 text-ayur-green-900 border border-ayur-border">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-ayur-green-800 block mb-1">
          ACCOUNT VERIFICATION
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl text-ayur-green-950 font-normal">
          Verify your account
        </h1>
        <p className="text-xs text-ayur-charcoal-600 mt-2">
          We&apos;ve sent a verification code to your email.
        </p>
      </div>

      {/* Target Email Display */}
      {email ? (
        <div className="p-3 bg-ayur-ivory rounded-lg border border-ayur-border flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-ayur-charcoal-800 truncate">
            <Mail className="w-4 h-4 text-ayur-green-800 shrink-0" />
            <span className="truncate font-medium">{email}</span>
          </div>
          <Link
            href={`/register${redirectTarget !== '/account' ? `?redirect=${encodeURIComponent(redirectTarget)}` : ''}`}
            className="text-[11px] text-ayur-green-800 hover:underline shrink-0 ml-2"
          >
            Change
          </Link>
        </div>
      ) : (
        <div>
          <label className="font-semibold text-ayur-charcoal-800 block mb-1 text-xs">
            Enter Registered Email Address *
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. yourname@example.com"
            className="w-full px-3 py-2.5 bg-ayur-ivory border border-ayur-border rounded-lg text-xs focus:outline-none focus:border-ayur-green-800"
          />
        </div>
      )}

      {/* Success Notification */}
      {isSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Account verified successfully! Establishing secure session...</span>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 6-Digit OTP Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="font-semibold text-ayur-charcoal-800 block mb-3 text-center text-xs">
            Enter 6-Digit Verification Code
          </label>
          <div className="flex justify-center gap-2 sm:gap-3">
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                disabled={isSuccess || isLoading}
                className="w-11 h-12 sm:w-12 sm:h-14 text-center font-mono text-lg sm:text-xl font-bold bg-ayur-ivory border-2 border-ayur-border rounded-lg focus:outline-none focus:border-ayur-green-900 focus:bg-white transition-all text-ayur-charcoal-900"
                aria-label={`Digit ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || isSuccess || digits.join('').length !== 6}
          className="w-full py-3 bg-ayur-green-900 hover:bg-ayur-green-800 disabled:opacity-50 text-white rounded-lg font-semibold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 shadow-md"
        >
          {isLoading ? (
            <span>Verifying Account...</span>
          ) : isSuccess ? (
            <span>Verified!</span>
          ) : (
            <>
              <span>VERIFY ACCOUNT</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Resend Code Section */}
      <div className="pt-4 border-t border-ayur-border flex flex-col items-center gap-2 text-xs text-ayur-charcoal-600">
        <div className="flex items-center gap-1.5">
          <span>Didn&apos;t receive the code?</span>
          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0 || isResending || isSuccess}
            className="font-semibold text-ayur-green-900 hover:underline disabled:text-ayur-charcoal-400 disabled:no-underline flex items-center gap-1"
          >
            {isResending ? (
              <RotateCw className="w-3.5 h-3.5 animate-spin" />
            ) : cooldown > 0 ? (
              <span>Resend in {cooldown}s</span>
            ) : (
              <span>Resend Code</span>
            )}
          </button>
        </div>

        <Link
          href={`/login${redirectTarget !== '/account' ? `?redirect=${encodeURIComponent(redirectTarget)}` : ''}`}
          className="text-[11px] text-ayur-charcoal-500 hover:text-ayur-charcoal-800 flex items-center gap-1 mt-2"
        >
          <ArrowLeft className="w-3 h-3" />
          <span>Back to Sign In</span>
        </Link>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <div className="py-12 sm:py-20 bg-ayur-ivory min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="text-xs text-ayur-charcoal-500">Loading verification...</div>}>
        <VerifyAccountForm />
      </Suspense>
    </div>
  );
}
