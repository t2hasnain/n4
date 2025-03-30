'use client';

import React, { useState, useEffect, useMemo } from "react";
import { motion, useScroll } from "framer-motion";

type ScrollDotsProps = {
  sections: string[];
};

export default function ScrollDots({ sections }: ScrollDotsProps) {
  const [activeSection, setActiveSection] = useState<string>(sections[0]);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Precompute dot scales for animation
  const dotScales = useMemo(() => {
    return sections.map(section => ({
      section,
      scale: section === activeSection ? 1.5 : 1
    }));
  }, [sections, activeSection]);

  // Create a line opacity transform hook that is always created
  const { scrollY } = useScroll();

  // Function to determine whether to show the connection line
  const showConnectionLine = useMemo(() => activeSection !== sections[0], [activeSection, sections]);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add resize listener
    window.addEventListener("resize", checkMobile);
    
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Handle scroll to update the active section
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && scrollPosition >= section.offsetTop) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    // Call once on mount
    handleScroll();
    
    // Add scroll listener
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [sections]);

  // Don't render on mobile
  if (isMobile) {
    return null;
  }

  // Scroll to section when a dot is clicked
  const handleDotClick = (section: string) => {
    const element = document.getElementById(section);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="fixed right-10 top-1/2 transform -translate-y-1/2 z-40 hidden md:block">
      <div className="flex flex-col items-center space-y-6 relative">
        {/* Connection line */}
        {showConnectionLine && (
          <motion.div
            className="absolute w-px h-full bg-gray-300 dark:bg-gray-700 z-0"
            style={{ opacity: 0.7 }}
          />
        )}

        {/* Dots */}
        {sections.map((section, index) => (
          <motion.button
            key={section}
            className={`w-3 h-3 rounded-full z-10 ${
              section === activeSection
                ? "bg-indigo-600 dark:bg-indigo-400"
                : "bg-gray-300 dark:bg-gray-700"
            }`}
            animate={{ scale: dotScales[index].scale }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={() => handleDotClick(section)}
            aria-label={`Scroll to ${section} section`}
          />
        ))}
      </div>
    </div>
  );
} 