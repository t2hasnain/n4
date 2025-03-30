'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/app/lib/firebase.js';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { FaFolderOpen, FaNewspaper, FaEnvelope, FaChartLine, FaGlobe, FaLock } from 'react-icons/fa';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    portfolioCount: 0,
    blogCount: 0,
    messagesCount: 0,
    unreadMessagesCount: 0,
    lastLoginDate: new Date()
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Portfolio count
      const portfolioRef = collection(db, 'portfolio');
      const portfolioSnapshot = await getDocs(portfolioRef);
      const portfolioCount = portfolioSnapshot.size;

      // Blog count
      const blogRef = collection(db, 'blog');
      const blogSnapshot = await getDocs(blogRef);
      const blogCount = blogSnapshot.size;

      // Messages count
      const messagesRef = collection(db, 'messages');
      const messagesSnapshot = await getDocs(messagesRef);
      const messagesCount = messagesSnapshot.size;

      // Unread messages count
      const unreadMessagesQuery = query(messagesRef, where('isRead', '==', false));
      const unreadMessagesSnapshot = await getDocs(unreadMessagesQuery);
      const unreadMessagesCount = unreadMessagesSnapshot.size;

      setStats({
        portfolioCount,
        blogCount,
        messagesCount,
        unreadMessagesCount,
        lastLoginDate: new Date()
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Failed to load dashboard statistics');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Admin Dashboard</h1>
        <button
          onClick={fetchStats}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh Stats
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold dark:text-white">Portfolio Items</h2>
                <div className="p-3 bg-indigo-100 text-indigo-500 dark:bg-indigo-900 dark:text-indigo-300 rounded-full">
                  <FaFolderOpen size={20} />
                </div>
              </div>
              <p className="text-3xl font-bold dark:text-white">{stats.portfolioCount}</p>
              <div className="mt-4">
                <Link 
                  href="/admin/portfolio"
                  className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium text-sm"
                >
                  View All Portfolio Items &rarr;
                </Link>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold dark:text-white">Blog Posts</h2>
                <div className="p-3 bg-blue-100 text-blue-500 dark:bg-blue-900 dark:text-blue-300 rounded-full">
                  <FaNewspaper size={20} />
                </div>
              </div>
              <p className="text-3xl font-bold dark:text-white">{stats.blogCount}</p>
              <div className="mt-4">
                <Link 
                  href="/admin/blog"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm"
                >
                  View All Blog Posts &rarr;
                </Link>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold dark:text-white">Messages</h2>
                <div className="p-3 bg-amber-100 text-amber-500 dark:bg-amber-900 dark:text-amber-300 rounded-full">
                  <FaEnvelope size={20} />
                </div>
              </div>
              <p className="text-3xl font-bold dark:text-white">{stats.messagesCount}</p>
              {stats.unreadMessagesCount > 0 && (
                <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                  {stats.unreadMessagesCount} unread
                </p>
              )}
              <div className="mt-4">
                <Link 
                  href="/admin/messages"
                  className="text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300 font-medium text-sm"
                >
                  View All Messages &rarr;
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-green-100 text-green-500 dark:bg-green-900 dark:text-green-300 rounded-full mr-4">
                  <FaChartLine size={20} />
                </div>
                <h2 className="text-lg font-semibold dark:text-white">Quick Actions</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link 
                  href="/admin/portfolio/new"
                  className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                >
                  <div className="p-2 bg-indigo-100 text-indigo-500 dark:bg-indigo-900 dark:text-indigo-300 rounded-full mr-3">
                    <FaFolderOpen size={16} />
                  </div>
                  <div>
                    <h3 className="font-medium dark:text-white">Add Portfolio Item</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Upload new work</p>
                  </div>
                </Link>
                
                <Link 
                  href="/admin/blog/new"
                  className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                >
                  <div className="p-2 bg-blue-100 text-blue-500 dark:bg-blue-900 dark:text-blue-300 rounded-full mr-3">
                    <FaNewspaper size={16} />
                  </div>
                  <div>
                    <h3 className="font-medium dark:text-white">Write Blog Post</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Share your thoughts</p>
                  </div>
                </Link>
                
                <Link 
                  href="/"
                  target="_blank"
                  className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                >
                  <div className="p-2 bg-purple-100 text-purple-500 dark:bg-purple-900 dark:text-purple-300 rounded-full mr-3">
                    <FaGlobe size={16} />
                  </div>
                  <div>
                    <h3 className="font-medium dark:text-white">View Website</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">See your site live</p>
                  </div>
                </Link>
                
                <Link 
                  href="/admin/settings"
                  className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                >
                  <div className="p-2 bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300 rounded-full mr-3">
                    <FaLock size={16} />
                  </div>
                  <div>
                    <h3 className="font-medium dark:text-white">Account Settings</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Manage your account</p>
                  </div>
                </Link>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-blue-100 text-blue-500 dark:bg-blue-900 dark:text-blue-300 rounded-full mr-4">
                  <FaEnvelope size={20} />
                </div>
                <h2 className="text-lg font-semibold dark:text-white">Recent Activity</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="p-2 bg-blue-100 text-blue-500 dark:bg-blue-900 dark:text-blue-300 rounded-full mr-3">
                    <FaLock size={14} />
                  </div>
                  <div>
                    <h3 className="font-medium dark:text-white">Last Login</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {stats.lastLoginDate.toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Welcome to your admin dashboard! From here, you can manage your portfolio, blog posts, and messages. 
                    Use the quick actions to add new content or access important features.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 