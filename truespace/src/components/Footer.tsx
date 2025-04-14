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
        duration: 0.5,
        ease: "easeInOut" 
      }
    }
  };

  return (
    <motion.footer 
      className="bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800 py-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={footerVariants}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="text-xl font-bold text-gray-900 dark:text-white mr-1">True</span>
              <span className="text-xl font-bold text-primary">Space</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              A modern educational platform for video courses with a beautiful, minimalist design.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary transition-colors"
              >
                <FiGithub size={20} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary transition-colors"
              >
                <FiTwitter size={20} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary transition-colors"
              >
                <FiInstagram size={20} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary transition-colors"
              >
                <FiLinkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-gray-900 dark:text-white font-medium mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/courses" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition-colors">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition-colors">
                  Search
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-gray-900 dark:text-white font-medium mb-4">Account</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/auth/signin" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition-colors">
                  Register
                </Link>
              </li>
              <li>
                <Link href="/auth/forgot-password" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition-colors">
                  Forgot Password
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-gray-900 dark:text-white font-medium mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            © {currentYear} TrueSpace. All rights reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  );
} 