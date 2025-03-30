"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaSmile, FaClipboardCheck, FaHourglassHalf, FaThumbsUp } from "react-icons/fa";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

const statsItems = [
  {
    icon: <FaSmile className="text-4xl text-indigo-500" />,
    count: 120,
    label: "Happy Clients"
  },
  {
    icon: <FaClipboardCheck className="text-4xl text-indigo-500" />,
    count: 150,
    label: "Projects Completed"
  },
  {
    icon: <FaHourglassHalf className="text-4xl text-indigo-500" />,
    count: 5,
    label: "Years Experience"
  },
  {
    icon: <FaThumbsUp className="text-4xl text-indigo-500" />,
    count: 100,
    label: "Satisfaction Rate %"
  }
];

export default function ClientStats() {
  return (
    <div className="container mx-auto px-4">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
        className="text-center mb-16"
      >
        <motion.h2 
          variants={itemVariants}
          className="text-3xl md:text-4xl font-bold mb-4"
        >
          Our Track Record
        </motion.h2>
        <motion.p 
          variants={itemVariants}
          className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
        >
          We take pride in the success of our clients and the quality of our work. 
          Here's what we've accomplished so far.
        </motion.p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
      >
        {statsItems.map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex justify-center mb-4">
              {item.icon}
            </div>
            <motion.h3 
              className="text-4xl font-bold mb-2 text-indigo-600 dark:text-indigo-400"
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ 
                opacity: 1, 
                scale: 1,
                transition: { 
                  duration: 0.5,
                  delay: 0.2 + (index * 0.1) 
                }
              }}
              viewport={{ once: true }}
            >
              {item.count}
              {item.label.includes("Rate") && '%'}
            </motion.h3>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              {item.label}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
} 