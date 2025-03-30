'use client';

import { useState, useEffect } from 'react';
import { db } from '@/app/lib/firebase.js';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useTheme } from 'next-themes';

export default function Partners() {
  const [partners, setPartners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setIsLoading(true);
        const partnersQuery = query(collection(db, 'partners'), orderBy('order', 'asc'));
        const partnersSnapshot = await getDocs(partnersQuery);
        
        if (partnersSnapshot.empty) {
          console.log('No partners found');
          setPartners([]);
          return;
        }
        
        const partnersList = partnersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setPartners(partnersList);
      } catch (error) {
        console.error('Error fetching partners:', error);
        setError('Failed to load partners');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartners();
  }, []);

  if (isLoading) {
    return (
      <div className="my-12 flex justify-center">
        <div className=" h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-12 text-center text-red-500">
        {error}
      </div>
    );
  }

  if (partners.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Trusted Partners
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Proud to work with these amazing companies
          </p>
        </div>
        
        <div className="relative overflow-hidden">
          <div className="flex animate-marquee pointer-events-none">
            {partners.map(partner => (
              <div 
                key={partner.id} 
                className="w-40 mx-8 h-24 flex-shrink-0 flex items-center justify-center"
              >
                <span className="text-lg font-medium text-gray-800 dark:text-gray-200">
                  {partner.name}
                </span>
              </div>
            ))}
            
            {/* Duplicate for seamless looping */}
            {partners.map(partner => (
              <div 
                key={`dup-${partner.id}`} 
                className="w-40 mx-8 h-24 flex-shrink-0 flex items-center justify-center"
              >
                <span className="text-lg font-medium text-gray-800 dark:text-gray-200">
                  {partner.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
          width: fit-content;
        }
      `}</style>
    </section>
  );
} 