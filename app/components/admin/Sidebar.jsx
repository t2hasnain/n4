'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FaHome, 
  FaBriefcase, 
  FaBlog, 
  FaCog, 
  FaEnvelope, 
  FaSignOutAlt,
  FaChevronDown,
  FaChevronUp,
  FaBars,
  FaTimes,
  FaHandshake
} from 'react-icons/fa';
import { auth, signInAsAdmin } from '@/app/lib/firebase.js';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const [user, loading] = useAuthState(auth);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <FaHome size={20} /> },
    { name: 'Portfolio', path: '/admin/portfolio', icon: <FaBriefcase size={20} /> },
    { name: 'Blog', path: '/admin/blog', icon: <FaBlog size={20} /> },
    { name: 'Messages', path: '/admin/messages', icon: <FaEnvelope size={20} /> },
    { name: 'Partners', path: '/admin/partners', icon: <FaHandshake size={20} /> },
    { name: 'Settings', path: '/admin/settings', icon: <FaCog size={20} /> },
  ];

  if (loading) {
    return (
      <div className="h-screen w-20 bg-gray-800 flex justify-center items-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const renderNavLinks = () => (
    <div className="mt-6">
      {navItems.map(item => (
        <Link
          href={item.path}
          key={item.path}
          className={`flex items-center p-4 ${
            collapsed ? 'justify-center' : 'space-x-3'
          } ${
            pathname === item.path
              ? 'bg-gray-700 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white transition-colors'
          } rounded-md mb-1`}
        >
          <span className="text-lg">{item.icon}</span>
          {!collapsed && <span>{item.name}</span>}
        </Link>
      ))}
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed z-50 top-5 left-5 p-2 rounded-md bg-gray-800 text-white"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 bg-gray-800 z-40 lg:hidden transition-transform transform ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Admin Panel</h2>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-300 hover:text-white"
            >
              <FaTimes size={24} />
            </button>
          </div>
          
          <div className="mb-6">
            <div className="text-white text-sm mb-2">Logged in as:</div>
            <div className="bg-gray-700 text-white p-3 rounded-md">
              {user?.email}
            </div>
          </div>
          
          {renderNavLinks()}
          
          <div className="mt-auto">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center p-4 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors rounded-md"
            >
              <FaSignOutAlt size={20} className="mr-3" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div
        className={`hidden lg:flex flex-col h-full ${
          collapsed ? 'w-20' : 'w-64'
        } bg-gray-800 text-white transition-all duration-300 ease-in-out`}
      >
        <div className={`p-4 ${collapsed ? 'justify-center' : ''} flex`}>
          {!collapsed && <h2 className="text-xl font-bold">Admin Panel</h2>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`${collapsed ? 'mx-auto' : 'ml-auto'} text-gray-300 hover:text-white`}
          >
            {collapsed ? <FaChevronUp size={20} /> : <FaChevronDown size={20} />}
          </button>
        </div>
        
        {!collapsed && (
          <div className="px-4 py-2">
            <div className="text-white text-sm mb-2">Logged in as:</div>
            <div className="bg-gray-700 text-white p-3 rounded-md text-sm truncate">
              {user?.email}
            </div>
          </div>
        )}
        
        {renderNavLinks()}
        
        <div className="mt-auto mb-4">
          <button
            onClick={handleSignOut}
            className={`w-full flex items-center p-4 ${
              collapsed ? 'justify-center' : 'space-x-3'
            } text-gray-300 hover:bg-gray-700 hover:text-white transition-colors rounded-md`}
          >
            <FaSignOutAlt size={20} />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </div>
    </>
  );
} 