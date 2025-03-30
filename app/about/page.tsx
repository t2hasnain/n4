'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { 
  FaCode, 
  FaPalette, 
  FaMobileAlt, 
  FaDatabase, 
  FaServer, 
  FaRocket,
  FaUsers,
  FaAward,
  FaHandshake
} from 'react-icons/fa';

const About = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);

  const skills = [
    { icon: <FaCode className="text-4xl text-blue-500" />, name: 'Web Development' },
    { icon: <FaPalette className="text-4xl text-purple-500" />, name: 'UI/UX Design' },
    { icon: <FaMobileAlt className="text-4xl text-pink-500" />, name: 'Mobile Development' },
    { icon: <FaDatabase className="text-4xl text-green-500" />, name: 'Database Management' },
    { icon: <FaServer className="text-4xl text-orange-500" />, name: 'Backend Development' },
    { icon: <FaRocket className="text-4xl text-red-500" />, name: 'Performance Optimization' },
  ];

  const achievements = [
    { icon: <FaUsers className="text-4xl text-blue-500" />, title: '100+ Happy Clients', description: 'Satisfied customers worldwide' },
    { icon: <FaAward className="text-4xl text-yellow-500" />, title: '15+ Awards', description: 'Recognition for excellence' },
    { icon: <FaHandshake className="text-4xl text-green-500" />, title: '5+ Years Experience', description: 'Industry expertise' },
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
            About Me
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Passionate developer and designer crafting digital experiences that make a difference.
          </p>
        </motion.div>
      </section>

      {/* Skills Section */}
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
              My Skills
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6" />
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              A comprehensive set of skills to bring your ideas to life.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    {skill.icon}
                  </div>
                  <h3 className="text-xl font-bold dark:text-white">{skill.name}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
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
              Achievements
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6" />
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Milestones that mark my journey in the industry.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-block p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                  {achievement.icon}
                </div>
                <h3 className="text-2xl font-bold mb-2 dark:text-white">{achievement.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{achievement.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4 dark:text-white">
                My Story
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="prose dark:prose-invert max-w-none"
            >
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                With over 5 years of experience in the industry, I've dedicated my career to creating
                exceptional digital experiences. My journey began with a passion for design and
                technology, which led me to specialize in full-stack development and UI/UX design.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                I believe in continuous learning and staying at the forefront of technology trends.
                This commitment to growth has enabled me to deliver innovative solutions that help
                businesses achieve their goals.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                When I'm not coding or designing, you can find me exploring new technologies,
                contributing to open-source projects, or sharing my knowledge through technical
                writing and mentoring.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About; 