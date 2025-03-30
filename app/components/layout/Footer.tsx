'use client';

import Link from 'next/link';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">T2Hasnain</h3>
            <p className="text-gray-400 mb-4">Professional freelancer offering graphic design, web development, and digital services.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-indigo-400 transition-colors">
                <FaFacebookF />
              </a>
              <a href="#" className="text-white hover:text-indigo-400 transition-colors">
                <FaTwitter />
              </a>
              <a href="#" className="text-white hover:text-indigo-400 transition-colors">
                <FaInstagram />
              </a>
              <a href="#" className="text-white hover:text-indigo-400 transition-colors">
                <FaLinkedinIn />
              </a>
              <a href="#" className="text-white hover:text-indigo-400 transition-colors">
                <FaGithub />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-bold mb-4">Services</h3>
            <ul className="space-y-2">
              <li><Link href="/services/graphic-design" className="text-gray-400 hover:text-white transition-colors">Graphic Design</Link></li>
              <li><Link href="/services/web-development" className="text-gray-400 hover:text-white transition-colors">Web Development</Link></li>
              <li><Link href="/services/app-development" className="text-gray-400 hover:text-white transition-colors">App Development</Link></li>
              <li><Link href="/services/data-management" className="text-gray-400 hover:text-white transition-colors">Data Management</Link></li>
              <li><Link href="/services/logo-design" className="text-gray-400 hover:text-white transition-colors">Logo Design</Link></li>
              <li><Link href="/services/social-media" className="text-gray-400 hover:text-white transition-colors">Social Media Management</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
              <li><Link href="/portfolio" className="text-gray-400 hover:text-white transition-colors">Portfolio</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <p className="text-gray-400 mb-2">Email: contact@t2hasnain.com</p>
            <p className="text-gray-400 mb-4">Phone: +1 (123) 456-7890</p>
            <Link 
              href="/contact" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} T2Hasnain. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 