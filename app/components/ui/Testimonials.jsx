'use client';

import { useState, useEffect } from 'react';
import { db } from '@/app/lib/firebase.js';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import Image from 'next/image';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';

// Function to get initials from name
const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Function to get a color based on name
const getColorFromName = (name) => {
  if (!name) return 'bg-gray-400';
  
  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
    'bg-red-500', 'bg-indigo-500', 'bg-pink-500',
    'bg-yellow-500', 'bg-teal-500', 'bg-orange-500'
  ];
  
  // Simple hash function to get consistent color for the same name
  const hash = name.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + acc;
  }, 0);
  
  return colors[hash % colors.length];
};

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setIsLoading(true);
        const testimonialsQuery = query(collection(db, 'testimonials'), orderBy('order', 'asc'));
        const testimonialsSnapshot = await getDocs(testimonialsQuery);
        
        if (testimonialsSnapshot.empty) {
          console.log('No testimonials found');
          setTestimonials([]);
          return;
        }
        
        const testimonialsList = testimonialsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setTestimonials(testimonialsList);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        setError('Failed to load testimonials');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const showTestimonial = (index) => {
    setActiveIndex(index);
  };

  // If no testimonials are found, use some defaults
  useEffect(() => {
    if (!isLoading && testimonials.length === 0 && !error) {
      setTestimonials([
        {
          id: '1',
          name: 'John Doe',
          company: 'ABC Corp',
          position: 'CEO',
          rating: 5,
          content: 'Working with this team was an absolute pleasure. They delivered exactly what we needed, on time and within budget.',
          profileImage: null
        },
        {
          id: '2',
          name: 'Sarah Smith',
          company: 'XYZ Startups',
          position: 'Founder',
          rating: 5,
          content: 'Exceptional work! Their attention to detail and creativity helped us stand out in a competitive market.',
          profileImage: null
        },
        {
          id: '3',
          name: 'Michael Johnson',
          company: 'Tech Innovations',
          position: 'CTO',
          rating: 4,
          content: 'A reliable partner for all our development needs. Their technical expertise is outstanding.',
          profileImage: null
        }
      ]);
    }
  }, [isLoading, testimonials.length, error]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            What Our Clients Say
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
            What Our Clients Say
          </h2>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  const activeTestimonial = testimonials[activeIndex];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          What Our Clients Say
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Don't just take our word for it - hear from some of our satisfied clients
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 relative">
          <div className="absolute top-8 left-8 text-blue-500 dark:text-blue-400 opacity-30">
            <FaQuoteLeft size={32} />
          </div>
          
          <div className="text-center mb-8">
            <div className="h-20 w-20 mx-auto mb-4 relative">
              {activeTestimonial.profileImage ? (
                <Image 
                  src={activeTestimonial.profileImage} 
                  alt={activeTestimonial.name} 
                  className="rounded-full object-cover"
                  fill
                />
              ) : (
                <div 
                  className={`h-full w-full rounded-full flex items-center justify-center text-white text-xl font-bold ${getColorFromName(activeTestimonial.name)}`}
                >
                  {getInitials(activeTestimonial.name)}
                </div>
              )}
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {activeTestimonial.name}
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400">
              {activeTestimonial.position}, {activeTestimonial.company}
            </p>
            
            <div className="flex justify-center mt-2">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={i < activeTestimonial.rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}
                />
              ))}
            </div>
          </div>
          
          <blockquote className="text-center text-gray-700 dark:text-gray-300 italic mb-8">
            "{activeTestimonial.content}"
          </blockquote>
          
          <div className="flex justify-center space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => showTestimonial(index)}
                className={`h-3 w-3 rounded-full ${
                  index === activeIndex 
                    ? 'bg-blue-600 scale-125' 
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                } transition-all duration-300`}
                aria-label={`Show testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 