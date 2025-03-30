'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { 
  FaCode, 
  FaPalette, 
  FaMobileAlt, 
  FaDatabase, 
  FaServer, 
  FaWordpressSimple,
  FaSearch,
  FaChartLine,
  FaShieldAlt,
  FaRocket,
  FaCogs,
  FaUsers
} from 'react-icons/fa';

const Services = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);

  const services = [
    {
      icon: <FaCode className="text-4xl text-blue-500" />,
      title: 'Web Development',
      description: 'Custom websites and web applications built with modern technologies and best practices.',
      features: ['Responsive Design', 'Performance Optimization', 'SEO Friendly']
    },
    {
      icon: <FaPalette className="text-4xl text-purple-500" />,
      title: 'UI/UX Design',
      description: 'Beautiful and intuitive user interfaces that enhance user experience and engagement.',
      features: ['User Research', 'Wireframing', 'Prototyping']
    },
    {
      icon: <FaMobileAlt className="text-4xl text-pink-500" />,
      title: 'Mobile Development',
      description: 'Native and cross-platform mobile applications for iOS and Android platforms.',
      features: ['iOS Development', 'Android Development', 'Cross-platform Solutions']
    },
    {
      icon: <FaDatabase className="text-4xl text-green-500" />,
      title: 'Database Management',
      description: 'Efficient data organization, processing, and analytics solutions for your business.',
      features: ['Data Modeling', 'Query Optimization', 'Data Security']
    },
    {
      icon: <FaServer className="text-4xl text-orange-500" />,
      title: 'Backend Development',
      description: 'Robust and scalable backend solutions to power your applications.',
      features: ['API Development', 'Server Management', 'Cloud Integration']
    },
    {
      icon: <FaWordpressSimple className="text-4xl text-blue-400" />,
      title: 'WordPress Development',
      description: 'Custom WordPress themes, plugins, and content management solutions.',
      features: ['Theme Development', 'Plugin Development', 'Site Optimization']
    }
  ];

  const process = [
    {
      icon: <FaSearch className="text-4xl text-blue-500" />,
      title: 'Discovery',
      description: 'Understanding your requirements and project goals'
    },
    {
      icon: <FaChartLine className="text-4xl text-purple-500" />,
      title: 'Planning',
      description: 'Creating a detailed roadmap for your project'
    },
    {
      icon: <FaCogs className="text-4xl text-pink-500" />,
      title: 'Development',
      description: 'Building your solution with precision and care'
    },
    {
      icon: <FaShieldAlt className="text-4xl text-green-500" />,
      title: 'Testing',
      description: 'Ensuring quality and performance'
    },
    {
      icon: <FaRocket className="text-4xl text-orange-500" />,
      title: 'Launch',
      description: 'Deploying your solution to the world'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-20">
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
            My Services
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Comprehensive solutions to help your business thrive in the digital world.
          </p>
        </motion.div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4 dark:text-white">
              What I Offer
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6" />
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              A wide range of services to meet your digital needs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ y: -5 }}
              >
                <div className="mb-6">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 dark:text-white">{service.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center text-gray-600 dark:text-gray-300">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4 dark:text-white">
              My Process
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6" />
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              A systematic approach to delivering exceptional results.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {process.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-block p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 dark:text-white">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-6 dark:text-white">
              Ready to Start Your Project?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
              Let's work together to bring your ideas to life.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-300 inline-flex items-center"
            >
              Get Started
              <FaUsers className="ml-2" />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Services; 