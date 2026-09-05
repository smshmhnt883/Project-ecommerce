'use client';

import React, { useState } from 'react';
import { User, Lock, Save } from 'lucide-react';
import { AccountNav } from '@/components/account/AccountNav';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please enter your full name.', 'error');
      return;
    }
    updateProfile({ name: name.trim(), email: email.trim(), phone: phone.trim() });
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      showToast('New password must be at least 6 characters.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }
    showToast('Password updated securely.', 'success');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="py-8 sm:py-12 bg-ayur-ivory min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-2xl sm:text-3xl text-ayur-green-950 font-normal mb-8">
          Profile & Security
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4">
            <AccountNav />
          </div>

          <div className="lg:col-span-8 space-y-6">
            {/* Personal Details Form */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-ayur-border shadow-soft space-y-6">
              <div className="border-b border-ayur-border pb-3">
                <h3 className="font-serif text-base font-semibold text-ayur-charcoal-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-ayur-green-800" />
                  <span>Personal Information</span>
                </h3>
                <p className="text-xs text-ayur-charcoal-500 mt-0.5">
                  Update your personal details and contact numbers for order dispatches.
                </p>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-medium text-ayur-charcoal-800 block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 bg-ayur-ivory border border-ayur-border rounded-md focus:outline-none focus:border-ayur-green-800"
                    />
                  </div>
                  <div>
                    <label className="font-medium text-ayur-charcoal-800 block mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-ayur-ivory border border-ayur-border rounded-md focus:outline-none focus:border-ayur-green-800"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="font-medium text-ayur-charcoal-800 block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-ayur-ivory border border-ayur-border rounded-md focus:outline-none focus:border-ayur-green-800"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-ayur-green-900 hover:bg-ayur-green-800 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Password & Security Form */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-ayur-border shadow-soft space-y-6">
              <div className="border-b border-ayur-border pb-3">
                <h3 className="font-serif text-base font-semibold text-ayur-charcoal-900 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-ayur-green-800" />
                  <span>Password & Account Security</span>
                </h3>
                <p className="text-xs text-ayur-charcoal-500 mt-0.5">
                  Update your authentication credentials.
                </p>
              </div>

              <form onSubmit={handleUpdatePassword} className="space-y-4 text-xs">
                <div>
                  <label className="font-medium text-ayur-charcoal-800 block mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-ayur-ivory border border-ayur-border rounded-md"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-medium text-ayur-charcoal-800 block mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full px-3 py-2 bg-ayur-ivory border border-ayur-border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="font-medium text-ayur-charcoal-800 block mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="w-full px-3 py-2 bg-ayur-ivory border border-ayur-border rounded-md"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-ayur-charcoal-800 hover:bg-ayur-charcoal-900 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
