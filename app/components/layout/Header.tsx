'use client';

import { useState, useEffect, useCallback, Fragment } from "react";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import ThemeToggle from "../ui/ThemeToggle";
import { usePathname } from "next/navigation";
import Image from "next/image";

type NavLink = {
  label: string;
  href: string;
};

const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  // Function to check if we're on the homepage
  const isHomePage = pathname === "/";

  // Function to handle scroll event
  const handleScroll = useCallback(() => {
    if (window.scrollY > 10) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  }, []);

  // Function to handle window resize
  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  // Effect for scroll and resize events
  useEffect(() => {
    handleScroll();
    handleResize();
    
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [handleScroll, handleResize]);

  // Function to handle smooth scroll for hash links
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute("href");
    
    // Only apply smooth scrolling on the homepage for hash links
    if (isHomePage && href && href.startsWith("/#")) {
      e.preventDefault();
      const targetId = href.replace("/", "");
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.getBoundingClientRect().top + window.scrollY - 100,
          behavior: "smooth",
        });
        
        // Close mobile menu if open
        setIsOpen(false);
        
        // Update URL without scrolling
        window.history.pushState({}, "", href);
      }
    } else {
      // Close mobile menu for other links
      setIsOpen(false);
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "py-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-lg" 
          : "py-6 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          <div className="font-bold text-2xl text-indigo-600 dark:text-indigo-400 flex items-center">
            <span className="mr-2">T2Hasnain</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={handleNavClick}
              className={`nav-link ${
                pathname === link.href || (pathname === "/" && link.href.startsWith("/#"))
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
              } font-medium transition-colors duration-200`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 dark:text-gray-300 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <FiX className="w-6 h-6" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg"
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={handleNavClick}
                    className={`nav-link py-2 ${
                      pathname === link.href || (pathname === "/" && link.href.startsWith("/#"))
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                    } font-medium transition-colors duration-200`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
} 