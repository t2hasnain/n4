'use client';

import { useState } from 'react';
import { auth } from '@/app/lib/firebase.js';
import { updatePassword } from 'firebase/auth';
import { FaLock, FaUser, FaSave } from 'react-icons/fa';

export default function SettingsPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('You must be logged in to change your password');
      }
      
      await updatePassword(user, newPassword);
      setSuccess('Password updated successfully');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Error updating password:', error);
      
      if (error.code === 'auth/requires-recent-login') {
        setError('For security reasons, please log out and log back in to change your password');
      } else {
        setError(error.message || 'Failed to update password');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Account Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your account settings and preferences
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 text-blue-500 dark:bg-blue-900 dark:text-blue-300 rounded-full mr-3">
                <FaUser size={18} />
              </div>
              <h2 className="text-lg font-semibold dark:text-white">Account Info</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="font-medium dark:text-white">{auth.currentUser?.email || 'Not logged in'}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Last Sign In</p>
                <p className="font-medium dark:text-white">
                  {auth.currentUser?.metadata.lastSignInTime 
                    ? new Date(auth.currentUser.metadata.lastSignInTime).toLocaleString() 
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-purple-100 text-purple-500 dark:bg-purple-900 dark:text-purple-300 rounded-full mr-3">
                <FaLock size={18} />
              </div>
              <h2 className="text-lg font-semibold dark:text-white">Change Password</h2>
            </div>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {success}
              </div>
            )}
            
            <form onSubmit={handlePasswordChange}>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2" htmlFor="newPassword">
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className={`flex items-center justify-center w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" />
                    Update Password
                  </>
                )}
              </button>
            </form>
          </div>
          
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2 dark:text-white">Firebase Configuration</h3>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <pre className="text-xs text-gray-800 dark:text-gray-300 overflow-x-auto">
                {`apiKey: "AIzaSyCODlyZt50HuI0aATAQko3is7eGO9M9gro",
authDomain: "fexixo-adeb6.firebaseapp.com",
databaseURL: "https://fexixo-adeb6-default-rtdb.firebaseio.com",
projectId: "fexixo-adeb6",
storageBucket: "fexixo-adeb6.firebasestorage.app",
messagingSenderId: "87713372568",
appId: "1:87713372568:web:ba0829a0be32a3409173ed",
measurementId: "G-N15DJVDC5R"`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 