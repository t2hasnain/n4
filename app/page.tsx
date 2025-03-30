import dynamic from 'next/dynamic';
import Hero from "@/app/components/ui/Hero";
import SkillsAnimation from "@/app/components/ui/SkillsAnimation";
import Footer from "@/app/components/layout/Footer";
import ClientScrollDots from "@/app/components/ui/ClientScrollDots";
import Partners from "@/app/components/ui/Partners";

// Dynamically import non-critical components
const Services = dynamic(() => import("@/app/components/ui/Services"), { ssr: true });
const Portfolio = dynamic(() => import("@/app/components/ui/Portfolio"), { ssr: true });
const Testimonials = dynamic(() => import("@/app/components/ui/Testimonials"), { ssr: true });
const Contact = dynamic(() => import("@/app/components/ui/Contact"), { ssr: true });

export default function Home() {
  // Define the sections for navigation
  const sections = [
    "hero",
    "skills",
    "services",
    "partners",
    "portfolio",
    "testimonials",
    "contact"
  ];

  return (
    <main className="min-h-screen antialiased bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 overflow-hidden">
      {/* Main sections */}
      <div className="relative">
        {/* Hero section - Preloaded */}
        <section id="hero" className="min-h-screen flex items-center pt-20 bg-white dark:bg-gray-900">
          <Hero />
        </section>
        
        {/* Skills section - Preloaded */}
        <section id="skills" className="py-20 bg-white dark:bg-gray-900">
          <SkillsAnimation />
        </section>
        
        {/* Services section - Dynamically loaded */}
        <section id="services" className="py-20 bg-white dark:bg-gray-900">
          <Services />
        </section>
        
        {/* Partners section */}
        <section id="partners" className="py-20 bg-white dark:bg-gray-900">
          <Partners />
        </section>
        
        {/* Portfolio section - Dynamically loaded */}
        <section id="portfolio" className="py-20 bg-white dark:bg-gray-900">
          <Portfolio />
        </section>
        
        {/* Testimonials section - Dynamically loaded */}
        <section id="testimonials" className="py-20 bg-white dark:bg-gray-900">
          <Testimonials />
        </section>
        
        {/* Contact section - Dynamically loaded */}
        <section id="contact" className="py-20 bg-white dark:bg-gray-900">
          <Contact />
        </section>
        
        {/* Navigation dots (only on desktop) - Client-side rendered */}
        <ClientScrollDots sections={sections} />
        </div>
      
      <Footer />
      </main>
  );
}
