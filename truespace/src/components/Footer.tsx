'use client';

import Link from 'next/link';
import { FiGithub, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
        ease: "easeInOut" 
      }
    }
  };

  return (
    <motion.footer 
      className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-10"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={footerVariants}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-gray-900 dark:text-white mr-1">True</span>
              <span className="text-xl font-bold text-primary">Space</span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              A modern educational platform for video courses with a beautiful, minimalist design.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <FiGithub size={18} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <FiTwitter size={18} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <FiInstagram size={18} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <FiLinkedin size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold mb-4 text-sm">Courses</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/courses" className="footer-link">
                  All Courses
                </Link>
              </li>
              <li>
                <Link href="/search" className="footer-link">
                  Search Courses
                </Link>
              </li>
              <li>
                <Link href="/categories" className="footer-link">
                  Categories
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold mb-4 text-sm">Account</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/dashboard" className="footer-link">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/profile" className="footer-link">
                  Profile
                </Link>
              </li>
              <li>
                <Link href="/auth/signin" className="footer-link">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="footer-link">
                  Register
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold mb-4 text-sm">About</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="footer-link">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="footer-link">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="footer-link">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="footer-link">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            © {currentYear} TrueSpace Learning. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-6">
              <li>
                <Link href="/cookies" className="text-gray-500 dark:text-gray-400 hover:text-primary text-xs">
                  Cookie Settings
                </Link>
              </li>
              <li>
                <Link href="/accessibility" className="text-gray-500 dark:text-gray-400 hover:text-primary text-xs">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </motion.footer>
  );
} 