'use client';

import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  FaCalendar, 
  FaUser, 
  FaTags, 
  FaArrowRight,
  FaSearch,
  FaCode,
  FaPalette,
  FaMobileAlt,
  FaDatabase,
  FaServer
} from 'react-icons/fa';

const Blog = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  const blogPosts = [
    {
      id: 1,
      title: 'Getting Started with Next.js 13',
      excerpt: 'Learn about the new features and improvements in Next.js 13 and how to use them effectively.',
      image: '/images/blog/blog-1.jpg',
      date: '2024-03-15',
      author: 'T2Hasnain',
      category: 'Web Development',
      tags: ['Next.js', 'React', 'JavaScript'],
      readTime: '5 min read'
    },
    {
      id: 2,
      title: 'The Future of UI Design',
      excerpt: 'Explore the latest trends and predictions in UI design for 2024 and beyond.',
      image: '/images/blog/blog-2.jpg',
      date: '2024-03-10',
      author: 'T2Hasnain',
      category: 'Design',
      tags: ['UI/UX', 'Design Trends', 'Web Design'],
      readTime: '4 min read'
    },
    {
      id: 3,
      title: 'Building Cross-Platform Apps with Flutter',
      excerpt: 'A comprehensive guide to building beautiful and performant cross-platform applications.',
      image: '/images/blog/blog-3.jpg',
      date: '2024-03-05',
      author: 'T2Hasnain',
      category: 'Mobile Development',
      tags: ['Flutter', 'Mobile Apps', 'Cross-Platform'],
      readTime: '6 min read'
    },
    {
      id: 4,
      title: 'Database Optimization Techniques',
      excerpt: 'Learn how to optimize your database performance and improve application speed.',
      image: '/images/blog/blog-4.jpg',
      date: '2024-02-28',
      author: 'T2Hasnain',
      category: 'Backend Development',
      tags: ['Database', 'Performance', 'Optimization'],
      readTime: '7 min read'
    },
    {
      id: 5,
      title: 'The Art of API Design',
      excerpt: 'Best practices and principles for designing robust and scalable APIs.',
      image: '/images/blog/blog-5.jpg',
      date: '2024-02-20',
      author: 'T2Hasnain',
      category: 'Backend Development',
      tags: ['API', 'Design', 'Best Practices'],
      readTime: '5 min read'
    },
    {
      id: 6,
      title: 'Responsive Design Fundamentals',
      excerpt: 'Master the basics of responsive design and create beautiful mobile-first websites.',
      image: '/images/blog/blog-6.jpg',
      date: '2024-02-15',
      author: 'T2Hasnain',
      category: 'Web Development',
      tags: ['Responsive Design', 'CSS', 'Web Design'],
      readTime: '4 min read'
    }
  ];

  const categories = [
    { id: 'all', label: 'All', icon: <FaCode /> },
    { id: 'web', label: 'Web Development', icon: <FaCode /> },
    { id: 'design', label: 'Design', icon: <FaPalette /> },
    { id: 'mobile', label: 'Mobile Development', icon: <FaMobileAlt /> },
    { id: 'database', label: 'Database', icon: <FaDatabase /> },
    { id: 'backend', label: 'Backend', icon: <FaServer /> }
  ];

  const [activeCategory, setActiveCategory] = useState('all');

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || 
                          post.category.toLowerCase().includes(activeCategory);
    return matchesSearch && matchesCategory;
  });

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
            Blog
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Insights, tutorials, and thoughts on web development and design.
          </p>
        </motion.div>
      </section>

      {/* Search and Categories */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-3 rounded-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
              <FaSearch className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
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

      {/* Blog Posts Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                whileHover={{ y: -5 }}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span className="flex items-center">
                      <FaCalendar className="mr-1" />
                      {post.date}
                    </span>
                    <span className="flex items-center">
                      <FaUser className="mr-1" />
                      {post.author}
                    </span>
                    <span>{post.readTime}</span>
                  </div>
                  <h2 className="text-xl font-bold mb-3 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/blog/${post.id}`}
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-300"
                  >
                    Read More
                    <FaArrowRight className="ml-2" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog; 