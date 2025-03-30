'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db, storage } from '@/app/lib/firebase.js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { FaUpload, FaSave, FaTimes, FaTag } from 'react-icons/fa';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// Simple fallback editor component
interface PlainTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  modules?: any;
  className?: string;
}

const PlainTextEditor = (props: PlainTextEditorProps) => (
  <textarea
    value={props.value || ''}
    onChange={(e) => props.onChange && props.onChange(e.target.value)}
    className={`w-full h-64 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${props.className || ''}`}
    placeholder="Write your content here..."
  />
);

// Dynamically import the editor to avoid SSR issues
const ReactQuill = dynamic(
  async () => {
    try {
      const { default: RQ } = await import('react-quill');
      // Return a wrapper component that matches the expected props
      return function CompatibleQuill(props: any) {
        return <RQ {...props} />;
      };
    } catch (error) {
      console.error("Failed to load ReactQuill:", error);
      return PlainTextEditor;
    }
  },
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-64 p-3 border rounded bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }
);

import 'react-quill/dist/quill.snow.css';

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'color': [] }, { 'background': [] }],
    ['link', 'image', 'video'],
    ['clean']
  ],
};

export default function NewBlogPost() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editorLoaded, setEditorLoaded] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    author: '',
    tags: [] as string[],
    // SEO fields
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    seoOptimized: false
  });
  
  const [featureImage, setFeatureImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [tagInput, setTagInput] = useState<string>('');

  useEffect(() => {
    setEditorLoaded(true);
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleContentChange = (content: string) => {
    setFormData({
      ...formData,
      content
    });
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }
    
    setFeatureImage(file);
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result && typeof reader.result === 'string') {
        setImagePreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };
  
  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (tagInput.trim() === '') return;
    if (formData.tags.includes(tagInput.trim())) return;
    
    setFormData({
      ...formData,
      tags: [...formData.tags, tagInput.trim()]
    });
    setTagInput('');
  };
  
  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };
  
  const uploadImage = async (file: File) => {
    if (!file) return null;
    
    try {
      const storageRef = ref(storage, `blog/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      return new Promise<string>((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
            console.log(`Upload progress: ${Math.round(progress)}%`);
          },
          (error) => {
            console.error('Error uploading image:', error);
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              console.log("Image uploaded successfully, URL:", downloadURL);
              resolve(downloadURL);
            } catch (error) {
              console.error("Error getting download URL:", error);
              reject(error);
            }
          }
        );
      });
    } catch (error) {
      console.error("Error starting upload:", error);
      throw error;
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    if (!formData.title || !formData.content) {
      setError('Title and content are required');
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Upload image if provided
      let imageUrl = null;
      if (featureImage) {
        setIsUploading(true);
        console.log("Starting feature image upload...");
        imageUrl = await uploadImage(featureImage);
        console.log("Feature image upload complete:", imageUrl);
        setIsUploading(false);
      }
      
      // Create document in Firestore
      console.log("Adding blog post to Firestore...");
      const blogRef = collection(db, 'blog');
      const docRef = await addDoc(blogRef, {
        ...formData,
        featureImage: imageUrl,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        published: false // Default to draft
      });
      
      console.log("Blog post added successfully with ID:", docRef.id);
      
      // Redirect to blog management page
      router.push('/admin/blog');
      
    } catch (error) {
      console.error('Error adding blog post:', error);
      setError('Failed to add blog post. Please try again.');
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Create New Blog Post</h1>
        <button
          onClick={() => router.push('/admin/blog')}
          className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="title">
                Title*
              </label>
              <input 
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="excerpt">
                Excerpt
              </label>
              <textarea 
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="A brief summary of your post"
              ></textarea>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                Content*
              </label>
              <div className="bg-white">
                {editorLoaded && (
                  <ReactQuill 
                    value={formData.content} 
                    onChange={handleContentChange} 
                    modules={modules}
                    className="dark:text-gray-900 h-[320px] mb-12"
                  />
                )}
              </div>
            </div>
          </div>
          
          <div className="md:col-span-1">
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                Feature Image
              </label>
              <div 
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <div className="relative h-48 w-full">
                    <Image 
                      src={imagePreview} 
                      alt="Preview"
                      fill
                      className="object-cover rounded-md" 
                    />
                    <button 
                      type="button"
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImagePreview('');
                        setFeatureImage(null);
                      }}
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ) : (
                  <div className="h-48 flex flex-col items-center justify-center">
                    <FaUpload className="text-gray-400 dark:text-gray-500 text-3xl mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">Click to upload an image</p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">PNG, JPG, WEBP (max 5MB)</p>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="author">
                Author
              </label>
              <input 
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                Tags
              </label>
              <div className="flex">
                <input 
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Add a tag"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <FaTag />
                </button>
              </div>
              
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <div 
                    key={index} 
                    className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    {tag}
                    <button 
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      <FaTimes size={10} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
              <h3 className="text-gray-700 dark:text-gray-300 text-sm font-bold mb-4">SEO Settings</h3>
              
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2" htmlFor="metaTitle">
                  Meta Title
                </label>
                <input 
                  type="text"
                  id="metaTitle"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2" htmlFor="metaDescription">
                  Meta Description
                </label>
                <textarea 
                  id="metaDescription"
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                ></textarea>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2" htmlFor="keywords">
                  Keywords
                </label>
                <input 
                  type="text"
                  id="keywords"
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
              
              <div className="flex items-center mb-4">
                <input 
                  type="checkbox"
                  id="seoOptimized"
                  name="seoOptimized"
                  checked={formData.seoOptimized}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-gray-700 dark:text-gray-300 text-sm" htmlFor="seoOptimized">
                  Mark as SEO Optimized
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={() => router.push('/admin/blog')}
            className="mr-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className={`flex items-center bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors ${
              (isSubmitting || isUploading) ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting || isUploading ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                {isUploading ? `Uploading ${Math.round(uploadProgress)}%` : 'Saving...'}
              </>
            ) : (
              <>
                <FaSave className="mr-2" />
                Save as Draft
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 