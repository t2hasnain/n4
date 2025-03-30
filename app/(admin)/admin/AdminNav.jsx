'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FaHome, 
  FaEnvelope, 
  FaFileAlt, 
  FaFolder, 
  FaBlog,
  FaHandshake,
  FaCog
} from 'react-icons/fa';

export default function AdminNav() {
  const pathname = usePathname();
  
  const isActive = (path) => {
    return pathname.startsWith(path);
  };
  
  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <FaHome className="mr-2" /> },
    { name: 'Messages', path: '/admin/messages', icon: <FaEnvelope className="mr-2" /> },
    { name: 'Portfolio', path: '/admin/portfolio', icon: <FaFolder className="mr-2" /> },
    { name: 'Blog', path: '/admin/blog', icon: <FaBlog className="mr-2" /> },
    { name: 'Partners', path: '/admin/partners', icon: <FaHandshake className="mr-2" /> },
    { name: 'Settings', path: '/admin/settings', icon: <FaCog className="mr-2" /> },
  ];
  
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md py-4 px-2 md:px-6 mb-8">
      <div className="flex flex-wrap items-center justify-center md:justify-start space-x-2 md:space-x-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
              isActive(item.path)
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {item.icon}
            <span className="hidden sm:inline">{item.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
} 