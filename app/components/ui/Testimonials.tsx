'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FaQuoteLeft, FaStar, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    position: 'Marketing Director at TechCorp',
    avatar: '/images/testimonials/female.jpg',
    content: 'Working with T2Hasnain was an absolute pleasure. The design exceeded our expectations and their communication throughout the project was outstanding. Looking forward to working together again!',
    rating: 5,
  },
  {
    id: 2,
    name: 'Michael Chen',
    position: 'Founder of StartupHub',
    avatar: '/images/testimonials/man.jpg',
    content: 'I was impressed by the attention to detail and creative approach. Our website now looks modern, professional, and perfectly reflects our brand identity. Highly recommended!',
    rating: 5,
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    position: 'E-commerce Manager',
    avatar: '/images/testimonials/avatar-3.jpg',
    content: 'The SEO optimization done by T2Hasnain has significantly improved our search rankings. We\'ve seen a 200% increase in organic traffic within just 3 months. Exceptional work!',
    rating: 5,
  },
  {
    id: 4,
    name: 'David Williams',
    position: 'CEO of FitnessPro',
    avatar: '/images/testimonials/avatar-4.jpg',
    content: 'Our mobile app development project was completed on time and within budget. The attention to user experience has resulted in outstanding customer feedback. Extremely satisfied with the results.',
    rating: 4,
  },
  {
    id: 5,
    name: 'Jessica Parker',
    position: 'Art Director',
    avatar: '/images/testimonials/avatar-5.jpg',
    content: 'The branding package delivered was comprehensive and thoughtfully designed. From logo to color scheme, everything represents our company vision perfectly. A true professional!',
    rating: 5,
  }
];

// Generate deterministic positions and properties for animated dots
// These will be consistent between server and client
const generateDotProperties = (count) => {
  // Using a fixed pattern instead of random values
  return Array.from({ length: count }, (_, i) => {
    // Use the index to create different but deterministic values
    const index = i + 1;
    const normalizedIndex = index / count;
    
    // Create spiral-like distribution
    const angle = normalizedIndex * Math.PI * 8;
    const radius = normalizedIndex * 80;
    const x = 50 + Math.cos(angle) * radius * 0.5;
    const y = 50 + Math.sin(angle) * radius * 0.5;
    
    // Size varies by position in sequence
    const size = 2 + (i % 5) * 1.5;
    
    // Opacity varies in a pattern
    const baseOpacity = 0.1 + (i % 3) * 0.08;
    
    // Animation values
    const animX = 10 + (i % 7) * 5;
    const animY = 10 + (i % 5) * 8;
    const duration = 10 + (i % 10) * 2;
    
    return {
      top: `${y}%`,
      left: `${x}%`,
      width: `${size}px`,
      height: `${size + (i % 2)}px`,
      opacity: baseOpacity,
      animX,
      animY,
      animOpacity1: baseOpacity,
      animOpacity2: baseOpacity + 0.15,
      animOpacity3: baseOpacity,
      duration
    };
  });
};

// Pre-generate dots with consistent properties
const dotProperties = generateDotProperties(20);

const Testimonials = () => {
  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 0.5, 1], [100, 0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    if (autoplay) {
      timeoutRef.current = setTimeout(() => {
        setActive((prevActive) => (prevActive + 1) % testimonials.length);
      }, 5000);
    }

    return () => {
      resetTimeout();
    };
  }, [active, autoplay]);

  const handleDotClick = (index: number) => {
    setActive(index);
    setAutoplay(false);
    // Resume autoplay after user interaction
    setTimeout(() => setAutoplay(true), 10000);
  };

  const handleNext = () => {
    setActive((prevActive) => (prevActive + 1) % testimonials.length);
    setAutoplay(false);
    setTimeout(() => setAutoplay(true), 10000);
  };

  const handlePrev = () => {
    setActive((prevActive) => (prevActive - 1 + testimonials.length) % testimonials.length);
    setAutoplay(false);
    setTimeout(() => setAutoplay(true), 10000);
  };

  const testimonialVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.5,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.5,
      transition: {
        duration: 0.5
      }
    })
  };

  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection: number) => {
    const newPage = active + newDirection;
    if (newPage >= 0 && newPage < testimonials.length) {
      setPage([newPage, newDirection]);
      setActive(newPage);
    }
  };

  return (
    <section id="testimonials" className="py-24 bg-gray-50 dark:bg-gray-800 overflow-hidden">
      <motion.div 
        ref={containerRef}
        style={{ y, opacity }}
        className="container mx-auto px-4"
      >
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-playfair font-bold mb-4 dark:text-white">What Clients Say</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6"></div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Don't just take my word for it - hear what my clients have to say about our work together.
          </p>
        </motion.div>

        <motion.div 
          className="relative max-w-4xl mx-auto py-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {/* Background elements */}
          <motion.div 
            className="absolute top-1/4 left-0 w-20 h-20 rounded-full bg-blue-500/10 -z-10"
            animate={{ 
              scale: [1, 1.2, 1],
              x: [0, -10, 0],
              y: [0, 10, 0],
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-10 w-16 h-16 rounded-full bg-purple-500/10 -z-10"
            animate={{ 
              scale: [1, 1.3, 1],
              x: [0, 15, 0],
              y: [0, -15, 0],
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <motion.div 
            className="absolute top-1/2 right-1/4 w-12 h-12 rounded-full bg-green-500/10 -z-10"
            animate={{ 
              scale: [1, 1.5, 1],
              x: [0, 10, 0],
              y: [0, -10, 0],
            }}
            transition={{ 
              duration: 7, 
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />

          {/* Testimonial card */}
          <div className="relative h-[400px] sm:h-[350px] flex items-center justify-center">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={active}
                custom={direction}
                variants={testimonialVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute w-full bg-white dark:bg-gray-700 rounded-2xl shadow-xl p-8 sm:p-10"
                style={{ maxWidth: "100%" }}
              >
                <FaQuoteLeft className="text-blue-500/20 text-6xl absolute top-8 left-8" />
                
                <div className="flex flex-col sm:flex-row items-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 relative mb-4 sm:mb-0 sm:mr-6">
                    <Image
                      src={testimonials[active].avatar}
                      alt={testimonials[active].name}
                      fill
                      className="rounded-full object-cover border-4 border-blue-500/20"
                    />
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-xl font-bold dark:text-white">{testimonials[active].name}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{testimonials[active].position}</p>
                    <div className="flex justify-center sm:justify-start mt-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          className={`${i < testimonials[active].rating ? 'text-yellow-400' : 'text-gray-300'} text-lg mr-1`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                <p className="mt-6 text-gray-600 dark:text-gray-300 leading-relaxed text-center sm:text-left">
                  "{testimonials[active].content}"
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <button 
              onClick={handlePrev}
              className="bg-white dark:bg-gray-700 shadow-md rounded-full p-3 text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-600 transition-all duration-300"
              aria-label="Previous testimonial"
            >
              <FaArrowLeft />
            </button>
            
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`w-3 h-3 rounded-full ${active === index ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                  whileHover={{ scale: 1.5 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ scale: 1 }}
                  animate={{ 
                    scale: active === index ? [1, 1.2, 1] : 1,
                    backgroundColor: active === index ? '#3B82F6' : '#D1D5DB'
                  }}
                  transition={active === index ? {
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: 'reverse'
                  } : {}}
                />
              ))}
            </div>
            
            <button 
              onClick={handleNext}
              className="bg-white dark:bg-gray-700 shadow-md rounded-full p-3 text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-600 transition-all duration-300"
              aria-label="Next testimonial"
            >
              <FaArrowRight />
            </button>
          </div>
        </motion.div>
        
        {/* Animated dots in background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {dotProperties.map((props, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-blue-500"
              style={{
                top: props.top,
                left: props.left,
                width: props.width,
                height: props.height,
                opacity: props.opacity,
              }}
              animate={{
                y: [0, props.animY],
                x: [0, props.animX],
                opacity: [props.animOpacity1, props.animOpacity2, props.animOpacity3],
              }}
              transition={{
                duration: props.duration,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* "C" logo for Contact section */}
      <motion.div 
        className="fixed bottom-10 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-lg z-20 cursor-pointer"
        onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        whileHover={{ scale: 1.1, boxShadow: '0 0 15px rgba(59, 130, 246, 0.6)' }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.span 
          className="text-3xl font-bold text-white" 
          animate={{ 
            textShadow: ['0 0 5px rgba(255,255,255,0.5)', '0 0 20px rgba(255,255,255,0.8)', '0 0 5px rgba(255,255,255,0.5)']
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          C
        </motion.span>
      </motion.div>
    </section>
  );
};

export default Testimonials;