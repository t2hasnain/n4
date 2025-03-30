'use client';

import { useState, useEffect } from 'react';
import { db } from '@/app/lib/firebase.js';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import Image from 'next/image';
import { FaExternalLinkAlt, FaTimes } from 'react-icons/fa';

export default function Portfolio() {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchPortfolioItems = async () => {
      try {
        setIsLoading(true);
        const portfolioQuery = query(collection(db, 'portfolio'), orderBy('createdAt', 'desc'));
        const portfolioSnapshot = await getDocs(portfolioQuery);
        
        if (portfolioSnapshot.empty) {
          console.log('No portfolio items found');
          setPortfolioItems([]);
          return;
        }
        
        const itemsList = portfolioSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Extract unique categories
        const uniqueCategories = [...new Set(itemsList.map(item => item.category).filter(Boolean))];
        setCategories(uniqueCategories);
        
        setPortfolioItems(itemsList);
      } catch (error) {
        console.error('Error fetching portfolio items:', error);
        setError('Failed to load portfolio items');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolioItems();
  }, []);

  const filterItemsByCategory = (category) => {
    setActiveCategory(category);
  };

  const openItemDetails = (item) => {
    setSelectedItem(item);
    setShowModal(true);
    // Prevent scrolling of the body when modal is open
    document.body.style.overflow = 'hidden';
  };

  const closeItemDetails = () => {
    setSelectedItem(null);
    setShowModal(false);
    // Restore scrolling
    document.body.style.overflow = 'auto';
  };

  // No default dummy items - only show admin uploads
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            My Portfolio
          </h2>
          <div className="flex justify-center">
            <div className="animate-spin h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            My Portfolio
          </h2>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (portfolioItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            My Portfolio
          </h2>
          <p className="text-gray-500 dark:text-gray-400">No portfolio items available yet.</p>
        </div>
      </div>
    );
  }

  const filteredItems = activeCategory === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeCategory);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Portfolio
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Check out some of my recent projects
        </p>
      </div>
      
      {/* Category filters */}
      {categories.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => filterItemsByCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            All
          </button>
          
          {categories.map(category => (
            <button
              key={category}
              onClick={() => filterItemsByCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      )}
      
      {/* Portfolio grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <div 
            key={item.id}
            className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => openItemDetails(item)}
          >
            <div className="relative h-64 w-full overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-lg font-medium px-4 py-2 rounded-full bg-blue-600 bg-opacity-90">
                  View Details
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {item.title}
              </h3>
              
              {item.category && (
                <span className="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-xs font-semibold px-2 py-1 rounded-full mb-2">
                  {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                </span>
              )}
              
              <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Modal for item details */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative">
              <div className="h-72 sm:h-96 w-full relative">
                <Image
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  fill
                  className="object-cover"
                />
              </div>
              
              <button
                onClick={closeItemDetails}
                className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex flex-wrap justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-0">
                  {selectedItem.title}
                </h2>
                
                {selectedItem.link && (
                  <a
                    href={selectedItem.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Visit Project <FaExternalLinkAlt className="ml-2" size={14} />
                  </a>
                )}
              </div>
              
              {selectedItem.category && (
                <span className="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-sm font-semibold px-3 py-1 rounded-full mb-4">
                  {selectedItem.category.charAt(0).toUpperCase() + selectedItem.category.slice(1)}
                </span>
              )}
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Description
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-line">
                  {selectedItem.description}
                </p>
              </div>
              
              {selectedItem.technologies && selectedItem.technologies.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Technologies Used
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.technologies.map((tech, index) => (
                      <span 
                        key={index}
                        className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 px-3 py-1 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 