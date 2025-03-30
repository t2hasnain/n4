'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { db } from '@/app/lib/firebase.js';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

// Fallback partner logos in case of loading issues
const fallbackPartners = [
  { name: 'Fasteox', logo: '/images/partners/fasteox.png', id: 1 },
  { name: 'Google', logo: '/images/partners/google.png', id: 2 },
  { name: 'Microsoft', logo: '/images/partners/microsoft.png', id: 3 },
  { name: 'Amazon', logo: '/images/partners/amazon.png', id: 4 },
  { name: 'Facebook', logo: '/images/partners/facebook.png', id: 5 },
  { name: 'Apple', logo: '/images/partners/apple.png', id: 6 },
  { name: 'IBM', logo: '/images/partners/ibm.png', id: 7 },
  { name: 'Salesforce', logo: '/images/partners/salesforce.png', id: 8 },
  { name: 'Oracle', logo: '/images/partners/oracle.png', id: 9 },
];

// Placeholder colored boxes for logos (used if actual images are not available)
const placeholderColors = [
  'bg-transparent',
];

const Partners = () => {
  const [pausedId, ] = useState<number | null>(null);
  const [partners, setPartners] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        console.log("Fetching partners from Firestore...");
        const partnersRef = collection(db, 'partners');
        const q = query(partnersRef, orderBy('createdAt', 'asc'));
        const partnersSnapshot = await getDocs(q);
        
        if (partnersSnapshot.empty) {
          console.log("No partners found, using fallback");
          setPartners(fallbackPartners);
        } else {
          const partnersList = partnersSnapshot.docs.map((doc, index) => ({
            id: doc.id,
            ...doc.data(),
            // Add a numeric ID for animation purposes if not present
            numericId: doc.data().numericId || index + 1
          }));
          console.log("Fetched partners:", partnersList);
          setPartners(partnersList);
        }
      } catch (error) {
        console.error("Error fetching partners:", error);
        setError("Failed to load partners");
        setPartners(fallbackPartners);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartners();
  }, []);

  if (isLoading) {
    return (
      <div className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted Partners</h2>
          <div className="w-24 h-1 bg-blue-500 mx-auto mb-8"></div>
          <div className="flex justify-center">
            <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 mb-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted Partners</h2>
          <div className="w-24 h-1 bg-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Working with leading companies to deliver exceptional results.
          </p>
        </div>
      </div>

      {/* Partners logos with marquee effect */}
      <div className="overflow-hidden relative mb-8">
        <div className={`flex items-center space-x-16 ${pausedId === null ? 'animate-partner-marquee' : ''}`}>
          {partners.map(partner => {
            const index = (partner.numericId || partner.id) % placeholderColors.length;
            const placeholderColor = placeholderColors[index];
            
            return (
              <motion.div
                key={partner.id}
                className={`flex-shrink-0 mx-5 ${pausedId === partner.numericId ? 'scale-110' : ''} transition-all duration-300`}
                whileHover={{ scale: 1.1 }}
                onMouseEnter={() => setPausedId(partner.numericId || partner.id)}
                onMouseLeave={() => setPausedId(null)}
              >
                {/* Use actual logo image or fallback to placeholder */}
                <div className="h-20 w-40 flex items-center justify-center">
                  <div className="relative h-full w-full">
                    <Image 
                      src={partner.logo} 
                      alt={partner.name} 
                      fill 
                      className="object-contain"
                      onError={(e) => {
                        // Fallback to placeholder on image load error
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.classList.add(placeholderColor);
                        target.parentElement!.innerHTML = partner.name;
                      }}
                    />
                  </div>
                </div>
                <p className="text-center mt-2 text-sm font-medium">{partner.name}</p>
              </motion.div>
            );
          })}

          {/* Duplicate partners to create seamless loop */}
          {partners.map(partner => {
            const index = (partner.numericId || partner.id) % placeholderColors.length;
            const placeholderColor = placeholderColors[index];
            
            return (
              <motion.div
                key={`dup-${partner.id}`}
                className={`flex-shrink-0 mx-5 ${pausedId === partner.numericId ? 'scale-110' : ''} transition-all duration-300`}
                whileHover={{ scale: 1.1 }}
                onMouseEnter={() => setPausedId(partner.numericId || partner.id)}
                onMouseLeave={() => setPausedId(null)}
              >
                <div className="h-20 w-40 flex items-center justify-center">
                  <div className="relative h-full w-full">
                    <Image 
                      src={partner.logo} 
                      alt={partner.name} 
                      fill 
                      className="object-contain"
                      onError={(e) => {
                        // Fallback to placeholder on image load error
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.classList.add(placeholderColor);
                        target.parentElement!.innerHTML = partner.name;
                      }}
                    />
                  </div>
                </div>
                <p className="text-center mt-2 text-sm font-medium">{partner.name}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Partners; 