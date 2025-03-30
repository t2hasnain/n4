'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowDown } from 'react-icons/fa';

const Hero = () => {
  const scrollToNextSection = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black">
      {/* Background Animation Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-blue-300 to-purple-400 dark:from-blue-600 dark:to-purple-700 opacity-30 dark:opacity-40 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 180, 270, 360],
            x: [0, 50, 0, -50, 0],
            y: [0, -50, 0, 50, 0]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
        <motion.div 
          className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 dark:from-blue-700 dark:to-indigo-800 opacity-20 dark:opacity-30 blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -90, -180, -270, -360],
            x: [0, -30, 0, 30, 0],
            y: [0, 30, 0, -30, 0]
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
      </div>

      {/* Content Container */}
      <div className="container mx-auto px-4 z-10 flex flex-col lg:flex-row items-center justify-between">
        {/* Text Content */}
        <motion.div 
          className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl font-playfair font-bold mb-6 gradient-text"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Crafting Digital Experiences That Inspire
          </motion.h1>
          
          <motion.div 
            className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto lg:mx-0 mb-6"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
          
          <motion.p 
            className="text-gray-600 dark:text-gray-300 text-lg mb-8 max-w-xl mx-auto lg:mx-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            I design and develop modern websites and applications
            that help businesses grow and connect with their audience.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Link href="/portfolio">
              <motion.button 
                className="btn-primary py-3 px-8 rounded-full text-white dark:text-white bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View My Work
              </motion.button>
            </Link>
            <Link href="/contact">
              <motion.button 
                className="btn-secondary py-3 px-8 rounded-full text-white dark:text-white bg-gray-800 dark:bg-gray-800 hover:bg-gray-900 dark:hover:bg-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get In Touch
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
        
        {/* Image/Illustration */}
        <motion.div 
          className="lg:w-1/2 relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="w-full max-w-lg mx-auto relative">
            <motion.div 
              className="absolute -top-6 -left-6 w-24 h-24 bg-blue-500 rounded-lg opacity-20 dark:opacity-30"
              animate={{ 
                rotate: [0, 10, 0, -10, 0],
                scale: [1, 1.1, 1, 0.9, 1]
              }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div 
              className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-500 rounded-full opacity-20 dark:opacity-30"
              animate={{ 
                rotate: [0, -20, 0, 20, 0],
                scale: [1, 0.9, 1, 1.1, 1]
              }}
              transition={{ duration: 10, repeat: Infinity }}
            />
            {/* New MAN.png image */}
            <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image 
                src="/images/MAN.png" 
                alt="Professional developer" 
                fill
                className="object-cover object-center"
                priority
              />
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.5, 
          delay: 1.2
        }}
        onClick={scrollToNextSection}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        >
          <FaArrowDown className="text-gray-600 dark:text-gray-400 text-2xl" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero; 