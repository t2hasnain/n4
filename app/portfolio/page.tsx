'use client';

import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  FaSearch, 
  FaCode, 
  FaPalette, 
  FaMobileAlt,
  FaGlobe,
  FaGithub,
  FaExternalLinkAlt
} from 'react-icons/fa';

const Portfolio = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);

  // Smooth cursor movement
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [cursorX, cursorY]);

  const portfolioItems = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      category: 'web',
      image: '/images/portfolio/portfolio-1.jpg',
      description: 'A modern e-commerce platform with advanced features and seamless user experience.',
      technologies: ['React', 'Node.js', 'MongoDB'],
      links: {
        github: 'https://github.com/t2hasnain/ecommerce',
        live: 'https://ecommerce.t2hasnain.com'
      }
    },
    {
      id: 2,
      title: 'Mobile Banking App',
      category: 'app',
      image: '/images/portfolio/portfolio-2.jpg',
      description: 'Secure and user-friendly mobile banking application for iOS and Android.',
      technologies: ['React Native', 'Firebase', 'Redux'],
      links: {
        github: 'https://github.com/t2hasnain/banking-app',
        live: 'https://banking.t2hasnain.com'
      }
    },
    {
      id: 3,
      title: 'Brand Identity Design',
      category: 'design',
      image: '/images/portfolio/portfolio-3.jpg',
      description: 'Complete brand identity package including logo, typography, and color scheme.',
      technologies: ['Figma', 'Adobe Illustrator', 'Photoshop'],
      links: {
        github: 'https://github.com/t2hasnain/brand-design',
        live: 'https://brand.t2hasnain.com'
      }
    },
    {
      id: 4,
      title: 'Real Estate Website',
      category: 'web',
      image: '/images/portfolio/portfolio-4.jpg',
      description: 'Property listing and management platform with advanced search capabilities.',
      technologies: ['Next.js', 'Prisma', 'PostgreSQL'],
      links: {
        github: 'https://github.com/t2hasnain/real-estate',
        live: 'https://realestate.t2hasnain.com'
      }
    },
    {
      id: 5,
      title: 'Fitness Tracking App',
      category: 'app',
      image: '/images/portfolio/portfolio-5.jpg',
      description: 'Cross-platform fitness tracking application with real-time monitoring.',
      technologies: ['Flutter', 'Firebase', 'GraphQL'],
      links: {
        github: 'https://github.com/t2hasnain/fitness-app',
        live: 'https://fitness.t2hasnain.com'
      }
    },
    {
      id: 6,
      title: 'UI Component Library',
      category: 'design',
      image: '/images/portfolio/portfolio-6.jpg',
      description: 'Reusable UI component library with comprehensive documentation.',
      technologies: ['React', 'TypeScript', 'Storybook'],
      links: {
        github: 'https://github.com/t2hasnain/ui-library',
        live: 'https://ui.t2hasnain.com'
      }
    }
  ];

  const categories = [
    { id: 'all', label: 'All', icon: <FaGlobe /> },
    { id: 'web', label: 'Web', icon: <FaCode /> },
    { id: 'app', label: 'App', icon: <FaMobileAlt /> },
    { id: 'design', label: 'Design', icon: <FaPalette /> }
  ];

  const [activeCategory, setActiveCategory] = useState('all');

  const filteredItems = activeCategory === 'all'
    ? portfolioItems
    : portfolioItems.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-20">
      {/* Custom Cursor */}
      <motion.div
        ref={cursorRef}
        className="fixed w-8 h-8 bg-blue-500/20 rounded-full pointer-events-none z-50 mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          scale: isHovering ? 1.5 : 1,
          opacity: isHovering ? 1 : 0.5
        }}
      />

      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <motion.div
          ref={containerRef}
          style={{ y, opacity }}
          className="container mx-auto px-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-6 dark:text-white">
            My Portfolio
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A collection of my best work and projects.
          </p>
        </motion.div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-full flex items-center space-x-2 transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-600'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>{category.icon}</span>
                <span>{category.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                whileHover={{ y: -5 }}
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                    <a
                      href={item.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-blue-400 transition-colors duration-300"
                    >
                      <FaGithub size={24} />
                    </a>
                    <a
                      href={item.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-blue-400 transition-colors duration-300"
                    >
                      <FaExternalLinkAlt size={24} />
                    </a>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 dark:text-white">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{item.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Portfolio; 