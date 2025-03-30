'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { FaHome, FaCog, FaUser, FaBell } from 'react-icons/fa';
import { auth } from '@/app/lib/firebase.js';

export default function AdminHeader() {
  const pathname = usePathname();
  const [title, setTitle] = useState('Dashboard');
  const [notifications, setNotifications] = useState(0);

  useEffect(() => {
    // Set page title based on current path
    if (pathname === '/admin') {
      setTitle('Dashboard');
    } else if (pathname.includes('/admin/portfolio')) {
      setTitle('Portfolio Management');
    } else if (pathname.includes('/admin/blog')) {
      setTitle('Blog Management');
    } else if (pathname.includes('/admin/messages')) {
      setTitle('Messages');
    } else if (pathname.includes('/admin/partners')) {
      setTitle('Partners');
    } else if (pathname.includes('/admin/settings')) {
      setTitle('Settings');
    }

    // Simulate notifications (in a real app, you'd fetch these from your backend)
    setNotifications(Math.floor(Math.random() * 5));
  }, [pathname]);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
          {title}
        </h1>
        
        <div className="flex items-center space-x-4">
          <Link 
            href="/"
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title="View Site"
          >
            <FaHome size={20} />
          </Link>
          
          <div className="relative">
            <button className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <FaBell size={20} />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>
          </div>
          
          <Link 
            href="/admin/settings"
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title="Settings"
          >
            <FaCog size={20} />
          </Link>
          
          <div className="relative ml-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              {auth.currentUser?.email?.[0]?.toUpperCase() || <FaUser size={16} />}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 