'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  FaLaptopCode, 
  FaPalette, 
  FaDatabase, 
  FaMobileAlt, 
  FaSearchengin, 
  FaChartLine 
} from 'react-icons/fa';

const services = [
  {
    icon: <FaLaptopCode className="text-5xl text-blue-500" />,
    title: "Web Development",
    description: "Custom websites built with modern frameworks like React, Next.js, and tailored to your business needs."
  },
  {
    icon: <FaPalette className="text-5xl text-purple-500" />,
    title: "Graphic Design",
    description: "Stunning visuals that capture your brand's essence and speak to your target audience."
  },
  {
    icon: <FaDatabase className="text-5xl text-green-500" />,
    title: "Data Management",
    description: "Organize and optimize your data with efficient database solutions and seamless integrations."
  },
  {
    icon: <FaMobileAlt className="text-5xl text-red-500" />,
    title: "Mobile Development",
    description: "Cross-platform mobile apps that provide smooth experiences across all devices."
  },
  {
    icon: <FaSearchengin className="text-5xl text-yellow-500" />,
    title: "SEO Optimization",
    description: "Boost your site's visibility with targeted SEO strategies that drive organic traffic."
  },
  {
    icon: <FaChartLine className="text-5xl text-indigo-500" />,
    title: "Analytics & Reporting",
    description: "Gain valuable insights with comprehensive analytics and detailed reporting."
  }
];

const Services = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const serviceVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      }
    }),
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="container mx-auto px-4" ref={ref}>
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">My Services</h2>
        <div className="w-24 h-1 bg-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          I offer a comprehensive range of services to help your business thrive in the digital landscape.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <motion.div
            key={index}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-8 hover:border-transparent transition-all duration-300"
            variants={serviceVariants}
            custom={index}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            whileHover="hover"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="mb-5 text-center">
              {service.icon}
            </div>
            <h3 className="text-xl font-bold mb-3 text-center">{service.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-center">{service.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Services; 