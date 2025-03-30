'use client';

import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaPaperPlane,
  FaLinkedin,
  FaGithub,
  FaTwitter,
  FaInstagram
} from 'react-icons/fa';
import { db, rtdb } from '@/app/lib/firebase.js';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref, push } from 'firebase/database';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState({
    isSubmitting: false,
    isSubmitted: false,
    error: null
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus({ isSubmitting: true, isSubmitted: false, error: null });
    
    try {
      // Save to Firestore
      const docRef = await addDoc(collection(db, 'messages'), {
        ...formData,
        read: false,
        createdAt: serverTimestamp()
      });

      console.log("Message saved to Firestore with ID:", docRef.id);

      // Also save to Realtime Database for redundancy
      const messageRef = ref(rtdb, 'messages');
      const realtimeRef = await push(messageRef, {
        ...formData,
        read: false,
        createdAt: new Date().toISOString()
      });

      console.log("Message saved to Realtime Database with key:", realtimeRef.key);

      // Reset form after successful submission
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Set success message
      setFormStatus({ isSubmitting: false, isSubmitted: true, error: null });
      
      // Reset success message after some time
      setTimeout(() => {
        setFormStatus(prev => ({ ...prev, isSubmitted: false }));
      }, 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormStatus({ 
        isSubmitting: false, 
        isSubmitted: false, 
        error: 'Failed to send message. Please try again later.' 
      });
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const contactMethods = [
    { 
      icon: <FaEnvelope />, 
      title: 'Email', 
      value: 'hasnainff@gmail.com',
      link: 'mailto:contact@t2hasnain.com',
      color: '#3B82F6'
    },
    { 
      icon: <FaPhone />, 
      title: 'Phone', 
      value: '+44 7745819191',
      link: 'tel:+447745819191',
      color: '#8B5CF6'
    },
    { 
      icon: <FaMapMarkerAlt />, 
      title: 'Location', 
      value: 'Pakistan, karachi',
      link: 'https://maps.google.com/',
      color: '#EC4899'
    }
  ];
  
  const socialLinks = [
    { icon: <FaLinkedin />, url: 'https://linkedin.com/in/t2hasnain', label: 'LinkedIn', color: '#0077B5' },
    { icon: <FaGithub />, url: 'https://github.com/t2hasnain', label: 'GitHub', color: '#333333' },
    { icon: <FaTwitter />, url: 'https://twitter.com/t2hasnain', label: 'Twitter', color: '#1DA1F2' },
    { icon: <FaInstagram />, url: 'https://instagram.com/t2hasnain', label: 'Instagram', color: '#E1306C' }
  ];

  return (
    <section id="contact" className="py-24 bg-white dark:bg-gray-900 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-10 left-10 w-64 h-64 rounded-full bg-blue-500 opacity-5"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, 50, 0],
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="absolute bottom-40 right-20 w-80 h-80 rounded-full bg-purple-500 opacity-5"
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, -30, 0],
          }}
          transition={{ 
            duration: 18, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>

      <motion.div 
        ref={containerRef}
        style={{ opacity }}
        className="container mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.div variants={itemVariants} className="text-center mb-16">
          <motion.span 
            className="text-blue-600 dark:text-blue-400 uppercase tracking-wider font-medium"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Get In Touch
          </motion.span>
          <motion.h2 
            className="text-4xl font-playfair font-bold mt-2 mb-4 dark:text-white"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Contact <span className="text-blue-600 dark:text-blue-400">Me</span>
          </motion.h2>
          <motion.div 
            className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          ></motion.div>
          <motion.p 
            className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Have a project in mind or want to discuss potential opportunities? Get in touch and let's create something amazing together.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div 
            variants={itemVariants}
            className="space-y-10"
          >
            <h3 className="text-2xl font-bold dark:text-white mb-8">Contact Information</h3>
            
            <div className="space-y-6">
              {contactMethods.map((method, index) => (
                <motion.a
                  key={index}
                  href={method.link}
                  className="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-md transition-all duration-300"
                  whileHover={{ 
                    x: 10, 
                    backgroundColor: 'rgba(59, 130, 246, 0.1)'
                  }}
                  variants={itemVariants}
                >
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center mr-4 text-white"
                    style={{ backgroundColor: method.color }}
                  >
                    {method.icon}
                  </div>
                  <div>
                    <h4 className="font-medium dark:text-white">{method.title}</h4>
                    <p className="text-gray-600 dark:text-gray-300">{method.value}</p>
                  </div>
                </motion.a>
              ))}
            </div>

            <div>
              <h4 className="text-lg font-semibold dark:text-white mb-4">Follow Me</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: social.color }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={social.label}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg"
          >
            <h3 className="text-2xl font-bold dark:text-white mb-6">Send Me a Message</h3>
            
            {formStatus.isSubmitted ? (
              <motion.div 
                className="text-center p-8 bg-green-50 dark:bg-green-900/20 rounded-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <motion.div 
                  className="w-16 h-16 mx-auto bg-green-500 text-white rounded-full flex items-center justify-center mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <FaPaperPlane size={24} />
                </motion.div>
                <h4 className="text-xl font-bold text-green-700 dark:text-green-300 mb-2">Message Sent!</h4>
                <p className="text-green-600 dark:text-green-400">Thank you for your message. I'll get back to you as soon as possible.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <motion.div variants={itemVariants}>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Your name"
                    />
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Your email"
                    />
                  </motion.div>
                </div>
                
                <motion.div variants={itemVariants}>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Subject of your message"
                  />
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Your message"
                  ></textarea>
                </motion.div>
                
                {formStatus.error && (
                  <motion.div 
                    className="text-red-500 dark:text-red-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {formStatus.error}
                  </motion.div>
                )}
                
                <motion.button
                  type="submit"
                  disabled={formStatus.isSubmitting}
                  className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-all duration-300 ${
                    formStatus.isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30'
                  }`}
                  whileHover={{ scale: formStatus.isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: formStatus.isSubmitting ? 1 : 0.98 }}
                  variants={itemVariants}
                >
                  {formStatus.isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Sending...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span>Send Message</span>
                      <FaPaperPlane className="ml-2" />
                    </div>
                  )}
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Contact; 