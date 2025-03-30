'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { db, storage } from '@/app/lib/firebase.js';
import { collection, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { FaEdit, FaTrash, FaPlus, FaEye } from 'react-icons/fa';

// Define the BlogPost type
interface BlogPost {
  id: string;
  title: string;
  excerpt?: string;
  content?: string;
  imageUrl?: string;
  coverImage?: string;
  category?: string;
  createdAt: any;
  author?: string;
  tags?: string[];
  seoOptimized?: boolean;
  slug?: string;
}

export default function BlogAdmin() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    setIsLoading(true);
    setError('');

    try {
      const blogRef = collection(db, 'blog');
      const q = query(blogRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const posts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toLocaleDateString() || 'Unknown date'
      })) as BlogPost[];
      
      setBlogPosts(posts);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      setError('Failed to load blog posts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, imageUrl?: string) => {
    if (!confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      return;
    }
    
    setDeletingId(id);
    setError('');
    
    try {
      // Delete the document from Firestore
      await deleteDoc(doc(db, 'blog', id));
      
      // Delete the image from Storage if it exists
      if (imageUrl) {
        try {
          // Extract the file path from the URL
          const fileUrl = new URL(imageUrl);
          const filePath = decodeURIComponent(fileUrl.pathname.split('/o/')[1].split('?')[0]);
          const storageRef = ref(storage, filePath);
          await deleteObject(storageRef);
        } catch (error) {
          console.error('Error deleting image file:', error);
        }
      }
      
      // Update the local state
      setBlogPosts(blogPosts.filter(post => post.id !== id));
    } catch (error) {
      console.error('Error deleting blog post:', error);
      setError('Failed to delete blog post. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Blog Management</h1>
        <Link 
          href="/admin/blog/new"
          className="flex items-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus className="mr-2" />
          New Blog Post
        </Link>
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
      ) : blogPosts.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center shadow-md">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">No Blog Posts Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You haven't created any blog posts yet. Get started by creating your first post.
          </p>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus className="mr-2" />
            Create Your First Blog Post
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700 text-left">
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    SEO
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {blogPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {post.coverImage ? (
                        <div className="h-12 w-20 relative overflow-hidden rounded">
                          <Image 
                            src={post.coverImage} 
                            alt={post.title} 
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-12 w-20 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                          <span className="text-gray-400 dark:text-gray-500 text-xs">No image</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">{post.title}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                        {post.excerpt || post.content?.substring(0, 100) || 'No content'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {post.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {post.createdAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {post.seoOptimized ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Optimized
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                          Not Optimized
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link 
                          href={`/blog/${post.slug}`} 
                          target="_blank"
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          <FaEye size={18} />
                        </Link>
                        <Link 
                          href={`/admin/blog/edit/${post.id}`}
                          className="text-amber-600 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300"
                        >
                          <FaEdit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id, post.coverImage)}
                          disabled={deletingId === post.id}
                          className={`text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 ${
                            deletingId === post.id ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          {deletingId === post.id ? (
                            <div className="animate-spin h-4 w-4 border-2 border-red-500 rounded-full border-t-transparent"></div>
                          ) : (
                            <FaTrash size={18} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 