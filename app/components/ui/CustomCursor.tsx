'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Only track mouse position on desktop
    if (!isMobile) {
      const mouseMove = (e: MouseEvent) => {
        setMousePosition({
          x: e.clientX,
          y: e.clientY
        });
      };
  
      window.addEventListener('mousemove', mouseMove);
      
      return () => {
        window.removeEventListener('mousemove', mouseMove);
        window.removeEventListener('resize', checkMobile);
      };
    } else {
      return () => {
        window.removeEventListener('resize', checkMobile);
      };
    }
  }, [isMobile]);

  // Don't render cursor on mobile
  if (isMobile) {
    return null;
  }

  return (
    <motion.div
      className="fixed top-0 left-0 w-6 h-6 rounded-full border-2 border-indigo-500 dark:border-indigo-400 z-50 pointer-events-none mix-blend-difference"
      animate={{
        x: mousePosition.x - 12,
        y: mousePosition.y - 12
      }}
      transition={{
        type: 'spring',
        damping: 25,
        stiffness: 500,
        mass: 0.3
      }}
    />
  );
};

export default CustomCursor; 