'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// Sample portfolio items
const portfolioItems = [
  {
    id: 1,
    title: 'E-Commerce Website',
    category: 'web',
    image: '/images/portfolio/portfolio-1.jpg',
    link: '/portfolio/e-commerce-website',
  },
  {
    id: 2,
    title: 'Mobile App UI',
    category: 'app',
    image: '/images/portfolio/portfolio-2.jpg',
    link: '/portfolio/mobile-app-ui',
  },
  {
    id: 3,
    title: 'Brand Identity',
    category: 'design',
    image: '/images/portfolio/portfolio-3.jpg',
    link: '/portfolio/brand-identity',
  },
  {
    id: 4,
    title: 'WordPress Blog',
    category: 'web',
    image: '/images/portfolio/portfolio-4.jpg',
    link: '/portfolio/wordpress-blog',
  },
  {
    id: 5,
    title: 'Data Dashboard',
    category: 'app',
    image: '/images/portfolio/portfolio-5.jpg',
    link: '/portfolio/data-dashboard',
  },
  {
    id: 6,
    title: 'Logo Collection',
    category: 'design',
    image: '/images/portfolio/portfolio-6.jpg',
    link: '/portfolio/logo-collection',
  },
];

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  
  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
  };
  
  const filteredItems = activeFilter === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeFilter);
  
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800" id="portfolio">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">My Portfolio</h2>
          <div className="w-20 h-1 bg-indigo-600 mx-auto mb-6"></div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Check out some of my recent work that showcases my skills and expertise.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center mb-12 space-x-2">
          <button 
            onClick={() => handleFilterClick('all')}
            className={`px-6 py-2 rounded-full mb-2 transition-colors ${
              activeFilter === 'all' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-200 dark:hover:bg-indigo-900'
            }`}
          >
            All
          </button>
          <button 
            onClick={() => handleFilterClick('web')}
            className={`px-6 py-2 rounded-full mb-2 transition-colors ${
              activeFilter === 'web' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-200 dark:hover:bg-indigo-900'
            }`}
          >
            Web Development
          </button>
          <button 
            onClick={() => handleFilterClick('app')}
            className={`px-6 py-2 rounded-full mb-2 transition-colors ${
              activeFilter === 'app' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-200 dark:hover:bg-indigo-900'
            }`}
          >
            App Development
          </button>
          <button 
            onClick={() => handleFilterClick('design')}
            className={`px-6 py-2 rounded-full mb-2 transition-colors ${
              activeFilter === 'design' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-200 dark:hover:bg-indigo-900'
            }`}
          >
            Design
          </button>
        </div>

        <AnimatePresence>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            layout
          >
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                className="bg-white dark:bg-gray-700 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4 }}
              >
                <Link href={item.link}>
                  <div className="relative h-60 w-full">
                    <div className="absolute inset-0 bg-gray-900 opacity-0 hover:opacity-80 transition-opacity duration-300 flex items-center justify-center z-10">
                      <span className="text-white font-medium text-lg">View Project</span>
                    </div>
                    <Image 
                      src={item.image} 
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 dark:text-white">{item.title}</h3>
                    <p className="text-indigo-600 dark:text-indigo-400 capitalize">
                      {item.category === 'web' ? 'Web Development' : 
                       item.category === 'app' ? 'App Development' : 'Design'}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
        
        <div className="mt-12 text-center">
          <Link 
            href="/portfolio" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-300 inline-block"
          >
            View All Projects
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Portfolio; 