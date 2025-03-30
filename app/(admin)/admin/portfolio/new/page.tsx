'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db, storage } from '@/app/lib/firebase.js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { FaPlus, FaSave, FaTrash } from 'react-icons/fa';
import Image from 'next/image';

export default function NewPortfolioItem() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    link: '',
    technologies: []
  });
  
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [techInput, setTechInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const categoryOptions = [
    { value: "web", label: "Web Development" },
    { value: "mobile", label: "Mobile App" },
    { value: "design", label: "UI/UX Design" },
    { value: "branding", label: "Branding" },
    { value: "graphic", label: "Graphic Design" },
    { value: "data", label: "Data Science" },
    { value: "ai", label: "Artificial Intelligence" },
    { value: "blockchain", label: "Blockchain" },
    { value: "iot", label: "Internet of Things" },
    { value: "game", label: "Game Development" },
    { value: "other", label: "Other" }
  ];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    console.log("Selected file:", file.name, file.type, file.size);
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPEG, PNG, or WebP)');
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }
    
    setImage(file);
    setError('');
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
  
  const handleAddTech = (e) => {
    e.preventDefault();
    if (techInput.trim() === '') return;
    if (formData.technologies.includes(techInput.trim())) return;
    
    setFormData({
      ...formData,
      technologies: [...formData.technologies, techInput.trim()]
    });
    setTechInput('');
  };
  
  const handleRemoveTech = (tech) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter(t => t !== tech)
    });
  };
  
  const uploadImage = async (file) => {
    try {
      const storageRef = ref(storage, `portfolio/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload progress: ${Math.round(progress)}%`);
            setUploadProgress(progress);
          },
          (error) => {
            console.error('Error during upload:', error);
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              console.log("Upload successful! Download URL:", downloadURL);
              resolve(downloadURL);
            } catch (error) {
              console.error("Error getting download URL:", error);
              reject(error);
            }
          }
        );
      });
    } catch (error) {
      console.error("Error initializing upload:", error);
      throw error;
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);
    
    // Validate form
    if (!formData.title) {
      setError('Title is required');
      setIsSubmitting(false);
      return;
    }
    
    if (!formData.description) {
      setError('Description is required');
      setIsSubmitting(false);
      return;
    }
    
    if (!image) {
      setError('Please upload an image for your portfolio item');
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Upload image
      setIsUploading(true);
      console.log("Starting image upload...");
      const imageUrl = await uploadImage(image);
      setIsUploading(false);
      console.log("Image uploaded successfully");
      
      // Create portfolio document in Firestore
      console.log("Creating Firestore document with data:", {
        ...formData,
        image: imageUrl,
        createdAt: 'serverTimestamp'
      });
      
      const docRef = await addDoc(collection(db, 'portfolio'), {
        ...formData,
        image: imageUrl,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      console.log("Portfolio item added successfully with ID:", docRef.id);
      setSuccess('Portfolio item added successfully!');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        link: '',
        technologies: []
      });
      setImage(null);
      setImagePreview('');
      setIsSubmitting(false);
      
      // Redirect to portfolio list after a short delay
      setTimeout(() => {
        router.push('/admin/portfolio');
      }, 1500);
      
    } catch (error) {
      console.error('Error adding portfolio item:', error);
      setError('Failed to add portfolio item: ' + (error.message || 'Unknown error'));
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Add New Portfolio Item</h1>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Project Image*
            </label>
            <div 
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <div className="relative h-64 w-full">
                  <Image 
                    src={imagePreview} 
                    alt="Preview" 
                    fill 
                    className="object-contain" 
                  />
                  <button 
                    type="button"
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImagePreview('');
                      setImage(null);
                    }}
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div>
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
            
            {/* Category */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="category">
                Category*
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="">Select a category</option>
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Link */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="link">
                Project Link
              </label>
              <input 
                type="url"
                id="link"
                name="link"
                value={formData.link}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="https://"
              />
            </div>
            
            {/* Technologies */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                Technologies
              </label>
              <div className="flex">
                <input 
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTech(e);
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Add a technology"
                />
                <button
                  type="button"
                  onClick={handleAddTech}
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <FaPlus />
                </button>
              </div>
              
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.technologies.map((tech, index) => (
                  <div 
                    key={index} 
                    className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    {tech}
                    <button 
                      type="button"
                      onClick={() => handleRemoveTech(tech)}
                      className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      <FaTrash size={10} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Description */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="description">
              Description*
            </label>
            <textarea 
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              required
            ></textarea>
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => router.push('/admin/portfolio')}
              className="mr-4 px-4 py-2 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  {isUploading ? (
                    <>
                      <div className="animate-spin mr-2 h-5 w-5 border-2 border-white rounded-full border-t-transparent"></div>
                      <span>Uploading {Math.round(uploadProgress)}%</span>
                    </>
                  ) : (
                    <>
                      <div className="animate-spin mr-2 h-5 w-5 border-2 border-white rounded-full border-t-transparent"></div>
                      <span>Saving...</span>
                    </>
                  )}
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  <span>Save Portfolio Item</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 