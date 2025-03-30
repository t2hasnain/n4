'use client';

import { useState, useEffect } from 'react';
import { db, storage } from '@/app/lib/firebase.js';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import Link from 'next/link';
import Image from 'next/image';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';

export default function PortfolioAdmin() {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    fetchPortfolioItems();
  }, []);

  const fetchPortfolioItems = async () => {
    setIsLoading(true);
    try {
      const portfolioSnapshot = await getDocs(collection(db, 'portfolio'));
      const items = portfolioSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPortfolioItems(items);
    } catch (error) {
      console.error('Error fetching portfolio items:', error);
      setError('Failed to load portfolio items. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id, imageUrl) => {
    setDeleteInProgress(true);
    setItemToDelete(id);
    
    try {
      // Delete image from storage
      if (imageUrl) {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
      }
      
      // Delete document from Firestore
      await deleteDoc(doc(db, 'portfolio', id));
      
      // Update state
      setPortfolioItems(portfolioItems.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting portfolio item:', error);
      setError('Failed to delete portfolio item. Please try again.');
    } finally {
      setDeleteInProgress(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Portfolio Management</h1>
        <Link 
          href="/admin/portfolio/new" 
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <FaPlus />
          <span>Add New Item</span>
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : portfolioItems.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center shadow-md">
          <p className="text-gray-600 dark:text-gray-300 mb-4">No portfolio items found.</p>
          <Link 
            href="/admin/portfolio/new" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Add your first portfolio item
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {portfolioItems.map((item) => (
            <div 
              key={item.id} 
              className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow flex flex-col md:flex-row"
            >
              <div className="md:w-1/4 relative h-48 md:h-auto">
                {item.imageUrl ? (
                  <Image 
                    src={item.imageUrl} 
                    alt={item.title} 
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400">No image</span>
                  </div>
                )}
              </div>
              
              <div className="p-6 flex-1">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <div>
                    <h2 className="text-xl font-bold mb-2 dark:text-white">{item.title}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      {item.category || 'No category'}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 line-clamp-2 mb-4">
                      {item.description || 'No description provided.'}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.technologies?.map((tech, index) => (
                        <span 
                          key={index}
                          className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex mt-4 md:mt-0 space-x-2 self-end md:self-start">
                    <Link
                      href={`/portfolio/${item.id}`}
                      className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 p-2 rounded hover:bg-green-200 dark:hover:bg-green-800"
                      title="View"
                      target="_blank"
                    >
                      <FaEye />
                    </Link>
                    <Link
                      href={`/admin/portfolio/edit/${item.id}`}
                      className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 p-2 rounded hover:bg-blue-200 dark:hover:bg-blue-800"
                      title="Edit"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id, item.imageUrl)}
                      disabled={deleteInProgress}
                      className={`bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 p-2 rounded hover:bg-red-200 dark:hover:bg-red-800 ${
                        deleteInProgress && itemToDelete === item.id ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      title="Delete"
                    >
                      {deleteInProgress && itemToDelete === item.id ? (
                        <div className="animate-spin h-4 w-4 border-2 border-red-700 dark:border-red-300 rounded-full border-t-transparent"></div>
                      ) : (
                        <FaTrash />
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between items-center text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    SEO: {item.seoOptimized ? 'Optimized' : 'Not optimized'}
                  </span>
                  {item.createdAt && (
                    <span className="text-gray-500 dark:text-gray-400">
                      Added: {new Date(item.createdAt.toDate()).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 