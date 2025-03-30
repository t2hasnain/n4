'use client';

import { useState, useEffect } from 'react';
import { db, storage } from '@/app/lib/firebase.js';
import { collection, getDocs, doc, deleteDoc, updateDoc, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaSort } from 'react-icons/fa';
import Image from 'next/image';

interface Partner {
  id: string;
  name: string;
  logoUrl?: string;
  website?: string;
  order: number;
}

export default function PartnersAdmin() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [currentPartner, setCurrentPartner] = useState<Partner | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    order: 0
  });
  
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  useEffect(() => {
    fetchPartners();
  }, []);
  
  const fetchPartners = async () => {
    try {
      setIsLoading(true);
      const partnersQuery = query(collection(db, 'partners'), orderBy('order', 'asc'));
      const partnersSnapshot = await getDocs(partnersQuery);
      
      const partnersList = partnersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Partner[];
      
      setPartners(partnersList);
    } catch (error) {
      console.error('Error fetching partners:', error);
      setError('Failed to load partners. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseInt(value) : value
    });
  };
  
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Logo size should be less than 2MB');
      return;
    }
    
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const uploadLogo = async (file: File) => {
    if (!file) return null;
    
    try {
      const storageRef = ref(storage, `partners/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      return new Promise<string>((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            console.error('Error uploading logo:', error);
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
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
  
  const handleDelete = async (partner: Partner) => {
    if (!confirm(`Are you sure you want to delete the partner "${partner.name}"?`)) return;
    
    try {
      await deleteDoc(doc(db, 'partners', partner.id));
      
      // If there's a logo, delete it from storage
      if (partner.logoUrl) {
        try {
          // Extract the file path from the URL
          const fileUrl = new URL(partner.logoUrl);
          const filePath = decodeURIComponent(fileUrl.pathname.split('/o/')[1].split('?')[0]);
          const storageRef = ref(storage, filePath);
          await deleteObject(storageRef);
        } catch (error) {
          console.error('Error deleting logo file:', error);
        }
      }
      
      // Update the local state
      setPartners(partners.filter(p => p.id !== partner.id));
    } catch (error) {
      console.error('Error deleting partner:', error);
      setError('Failed to delete partner. Please try again.');
    }
  };
  
  const handleEditClick = (partner: Partner) => {
    setFormMode('edit');
    setCurrentPartner(partner);
    setFormData({
      name: partner.name,
      website: partner.website || '',
      order: partner.order
    });
    setLogoPreview(partner.logoUrl || '');
    setShowForm(true);
  };
  
  const handleAddClick = () => {
    setFormMode('add');
    setCurrentPartner(null);
    setFormData({
      name: '',
      website: '',
      order: partners.length > 0 ? Math.max(...partners.map(p => p.order)) + 1 : 0
    });
    setLogoPreview('');
    setLogoFile(null);
    setShowForm(true);
  };
  
  const handleCancel = () => {
    setShowForm(false);
    setError('');
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    if (!formData.name) {
      setError('Partner name is required');
      setIsSubmitting(false);
      return;
    }
    
    try {
      let logoUrl = currentPartner?.logoUrl || null;
      
      // Upload logo if a new one is selected
      if (logoFile) {
        console.log("Uploading new logo...");
        logoUrl = await uploadLogo(logoFile);
        console.log("Logo uploaded successfully:", logoUrl);
      }
      
      if (formMode === 'add') {
        // Add new partner
        console.log("Adding new partner...");
        await addDoc(collection(db, 'partners'), {
          name: formData.name,
          website: formData.website || null,
          logoUrl: logoUrl,
          order: formData.order,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        console.log("Partner added successfully");
      } else if (formMode === 'edit' && currentPartner) {
        // Update existing partner
        console.log("Updating partner...");
        await updateDoc(doc(db, 'partners', currentPartner.id), {
          name: formData.name,
          website: formData.website || null,
          logoUrl: logoUrl,
          order: formData.order,
          updatedAt: serverTimestamp()
        });
        console.log("Partner updated successfully");
      }
      
      // Refresh the partners list and reset form
      fetchPartners();
      setShowForm(false);
      setLogoFile(null);
      setLogoPreview('');
      
    } catch (error) {
      console.error('Error saving partner:', error);
      setError('Failed to save partner. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const movePartner = async (partner: Partner, direction: 'up' | 'down') => {
    const index = partners.findIndex(p => p.id === partner.id);
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === partners.length - 1)
    ) {
      return;
    }
    
    const newPartners = [...partners];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const targetPartner = newPartners[targetIndex];
    
    // Swap the order values
    const tempOrder = partner.order;
    
    try {
      // Update in Firestore
      await updateDoc(doc(db, 'partners', partner.id), {
        order: targetPartner.order,
        updatedAt: serverTimestamp()
      });
      
      await updateDoc(doc(db, 'partners', targetPartner.id), {
        order: tempOrder,
        updatedAt: serverTimestamp()
      });
      
      // Update local state to reflect the changes
      newPartners[index].order = targetPartner.order;
      newPartners[targetIndex].order = tempOrder;
      
      // Re-sort the array
      newPartners.sort((a, b) => a.order - b.order);
      setPartners(newPartners);
      
    } catch (error) {
      console.error('Error reordering partners:', error);
      setError('Failed to reorder partners. Please try again.');
    }
  };
  
  return (
    <div className="min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Trusted Partners</h1>
        
        {!showForm && (
          <button
            onClick={handleAddClick}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <FaPlus className="mr-2" /> Add Partner
          </button>
        )}
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold dark:text-white">
              {formMode === 'add' ? 'Add New Partner' : 'Edit Partner'}
            </h2>
            <button
              onClick={handleCancel}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <FaTimes size={18} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2" htmlFor="name">
                  Partner Name*
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2" htmlFor="website">
                  Website URL
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="https://"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2" htmlFor="order">
                  Display Order
                </label>
                <input
                  type="number"
                  id="order"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                  Logo
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-24 h-24 border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    {logoPreview ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={logoPreview}
                          alt="Logo Preview"
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs text-center">No logo</span>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <input
                      type="file"
                      id="logo"
                      className="hidden"
                      accept="image/*"
                      onChange={handleLogoChange}
                    />
                    <label
                      htmlFor="logo"
                      className="block w-full px-4 py-2 bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200 rounded-md cursor-pointer text-center hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                    >
                      {logoPreview ? 'Change Logo' : 'Upload Logo'}
                    </label>
                    {logoPreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setLogoPreview('');
                          setLogoFile(null);
                        }}
                        className="mt-2 w-full px-4 py-2 bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 rounded-md hover:bg-red-200 dark:hover:bg-red-800/30 transition-colors text-sm"
                      >
                        Remove Logo
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2"></div>
                    {logoFile && uploadProgress < 100 ? `Uploading ${Math.round(uploadProgress)}%` : 'Saving...'}
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" />
                    Save Partner
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      ) : partners.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">No partners have been added yet.</p>
          <button
            onClick={handleAddClick}
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
          >
            <FaPlus className="mr-2" /> Add Your First Partner
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-750">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Order
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Logo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Website
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {partners.map((partner, index) => (
                <tr key={partner.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-2">
                      <span>{partner.order}</span>
                      <div className="flex flex-col">
                        <button
                          onClick={() => movePartner(partner, 'up')}
                          disabled={index === 0}
                          className={`text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 ${
                            index === 0 ? 'opacity-30 cursor-not-allowed' : ''
                          }`}
                        >
                          <FaSort size={12} />
                        </button>
                        <button
                          onClick={() => movePartner(partner, 'down')}
                          disabled={index === partners.length - 1}
                          className={`text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 ${
                            index === partners.length - 1 ? 'opacity-30 cursor-not-allowed' : ''
                          }`}
                        >
                          <FaSort size={12} className="transform rotate-180" />
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      {partner.logoUrl ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={partner.logoUrl}
                            alt={partner.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs text-center">No logo</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{partner.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {partner.website ? (
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {partner.website}
                      </a>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditClick(partner)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-4"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(partner)}
                      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 