'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/app/lib/firebase.js';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting login with:', email);
      
      // Handle both username t2hasnain and email hasnainff9999@gmail.com
      if (email === 't2hasnain' && password === 'admin') {
        console.log('Using username login flow');
        // Use the default admin credentials
        await signInWithEmailAndPassword(auth, "hasnainff9999@gmail.com", "admin");
      } else {
        console.log('Using email login flow');
        // Use regular email/password login
        await signInWithEmailAndPassword(auth, email, password);
      }
      
      console.log('Login successful, redirecting to admin');
      router.push('/admin');
    } catch (error: unknown) {
      console.error('Login error:', error);
      const authError = error as { code?: string; message?: string };
      
      if (authError.code === 'auth/invalid-email') {
        setError('Invalid email format');
      } else if (authError.code === 'auth/user-not-found') {
        setError('User not found');
      } else if (authError.code === 'auth/wrong-password') {
        setError('Incorrect password');
      } else if (authError.code === 'auth/invalid-credential') {
        setError('Invalid credentials. Please check your email/username and password.');
      } else {
        setError(`Login failed: ${authError.message || 'Please check your credentials.'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper function to simulate login for testing
  const loginAsAdmin = () => {
    setEmail('hasnainff9999@gmail.com');
    setPassword('admin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Admin Login
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to access your admin dashboard
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <div className="rounded-md -space-y-px">
            <div className="mb-5">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Username or Email
              </label>
              <input
                id="email"
                name="email"
                type="text"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username or Email address"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember_me"
                name="remember_me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <button 
                type="button" 
                onClick={loginAsAdmin} 
                className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
              >
                Use Admin Credentials
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </span>
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Default credentials: 
            <span className="font-semibold"> t2hasnain / admin</span>
          </p>
          <Link href="/" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage; 