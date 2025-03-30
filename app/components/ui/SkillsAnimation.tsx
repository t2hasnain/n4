'use client';

import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  FaReact, 
  FaNodeJs, 
  FaJs, 
  FaHtml5, 
  FaCss3Alt,
  FaDatabase,
  FaPython,
  FaGithub,
  FaAws,
  FaDocker
} from 'react-icons/fa';
import { 
  SiNextdotjs, 
  SiTypescript, 
  SiTailwindcss, 
  SiFirebase, 
  SiMongodb, 
  SiPostgresql,
  SiRedux,
  SiGraphql,
  SiFlutter,
  SiKotlin
} from 'react-icons/si';

// Define technology icon array with colors
const techIcons = [
  { icon: <FaReact size={40} />, color: "#61DAFB", name: "React" },
  { icon: <SiNextdotjs size={40} />, color: "#000000", name: "Next.js" },
  { icon: <FaNodeJs size={40} />, color: "#339933", name: "Node.js" },
  { icon: <SiTypescript size={40} />, color: "#3178C6", name: "TypeScript" },
  { icon: <FaJs size={40} />, color: "#F7DF1E", name: "JavaScript" },
  { icon: <FaHtml5 size={40} />, color: "#E34F26", name: "HTML5" },
  { icon: <FaCss3Alt size={40} />, color: "#1572B6", name: "CSS3" },
  { icon: <SiTailwindcss size={40} />, color: "#06B6D4", name: "Tailwind CSS" },
  { icon: <SiFirebase size={40} />, color: "#FFCA28", name: "Firebase" },
  { icon: <FaDatabase size={40} />, color: "#4479A1", name: "Databases" },
  { icon: <SiMongodb size={40} />, color: "#47A248", name: "MongoDB" },
  { icon: <SiPostgresql size={40} />, color: "#336791", name: "PostgreSQL" },
  { icon: <FaPython size={40} />, color: "#3776AB", name: "Python" },
  { icon: <SiRedux size={40} />, color: "#764ABC", name: "Redux" },
  { icon: <SiGraphql size={40} />, color: "#E10098", name: "GraphQL" },
  { icon: <FaGithub size={40} />, color: "#181717", name: "GitHub" },
  { icon: <FaAws size={40} />, color: "#FF9900", name: "AWS" },
  { icon: <FaDocker size={40} />, color: "#2496ED", name: "Docker" },
  { icon: <SiFlutter size={40} />, color: "#02569B", name: "Flutter" },
  { icon: <SiKotlin size={40} />, color: "#7F52FF", name: "Kotlin" }
];

const skills = [
  {
    title: "Frontend Development",
    description: "Crafting responsive and interactive user interfaces with modern frameworks and libraries."
  },
  {
    title: "Backend Development",
    description: "Building robust server-side applications and RESTful APIs with Node.js and other technologies."
  },
  {
    title: "Database Design",
    description: "Designing efficient database structures for optimal data storage and retrieval."
  },
  {
    title: "Mobile Development",
    description: "Creating cross-platform mobile applications using React Native and Flutter."
  }
];

const SkillsAnimation = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const [hoveredIcon, setHoveredIcon] = useState<number | null>(null);

  return (
    <div className="container mx-auto px-4 py-12" ref={ref} id="skills">
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">My Skills & Expertise</h2>
        <div className="w-24 h-1 bg-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          I specialize in a range of technologies and disciplines to create exceptional digital experiences.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {skills.map((skill, index) => (
          <motion.div
            key={index}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-6"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <h3 className="text-xl font-bold mb-2">{skill.title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{skill.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Tech icons that scroll horizontally */}
      <div className="w-full overflow-hidden py-8">
        <div className="inline-flex flex-nowrap animate-marquee">
          {techIcons.map((tech, index) => (
            <motion.div 
              key={index}
              className="flex flex-col items-center justify-center mx-6 my-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.2, y: -10 }}
              style={{ color: tech.color }}
            >
              {tech.icon}
              <span className="mt-2 text-sm font-medium">{tech.name}</span>
            </motion.div>
          ))}
          
          {/* Duplicate icons for continuous scrolling */}
          {techIcons.map((tech, index) => (
            <motion.div 
              key={`dup-${index}`}
              className="flex flex-col items-center justify-center mx-6 my-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.2, y: -10 }}
              style={{ color: tech.color }}
            >
              {tech.icon}
              <span className="mt-2 text-sm font-medium">{tech.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsAnimation;

// Add this to your globals.css or a new CSS module
// @keyframes marquee {
//   0% {
//     transform: translateX(0);
//   }
//   100% {
//     transform: translateX(-50%);
//   }
// }
// 
// .animate-marquee {
//   animation: marquee 20s linear infinite;
// } 