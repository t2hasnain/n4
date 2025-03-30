'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { auth } from '@/app/lib/firebase.js';
import { useRouter } from 'next/navigation';
import { FaHome, FaFolderOpen, FaNewspaper, FaEnvelope, FaCog, FaSignOutAlt, FaLock, FaHandshake } from 'react-icons/fa';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login in the useEffect
  }

  const isActive = (path) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const navigation = [
    { name: 'Dashboard', path: '/admin', icon: FaHome },
    { name: 'Portfolio', path: '/admin/portfolio', icon: FaFolderOpen },
    { name: 'Blog', path: '/admin/blog', icon: FaNewspaper },
    { name: 'Partners', path: '/admin/partners', icon: FaHandshake },
    { name: 'Messages', path: '/admin/messages', icon: FaEnvelope },
    { name: 'Settings', path: '/admin/settings', icon: FaCog },
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-md">
        <div className="p-4 flex flex-col h-full">
          <div className="flex items-center justify-center mb-8 pt-4">
            <FaLock className="text-blue-600 dark:text-blue-400 text-xl mr-2" />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Admin Panel</h1>
          </div>
          
          <nav className="space-y-1 flex-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                  isActive(item.path)
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <item.icon className={`mr-3 h-5 w-5 ${
                  isActive(item.path)
                    ? 'text-blue-500 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400'
                }`} />
                {item.name}
              </Link>
            ))}
          </nav>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <FaSignOutAlt className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              Sign Out
            </button>
            
            <div className="flex items-center mt-6 px-4 py-3">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user?.email || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Admin
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <main className="p-6 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
} 