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
      className="bg-[#121212] border-t border-[#333333] py-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={footerVariants}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="text-xl font-bold text-white mr-1">True</span>
              <span className="text-xl font-bold text-purple-500">Space</span>
            </div>
            <p className="text-[#6b7280] text-sm">
              A modern educational platform for video courses with a beautiful, minimalist design.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#6b7280] hover:text-white transition-colors"
              >
                <FiGithub size={20} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#6b7280] hover:text-white transition-colors"
              >
                <FiTwitter size={20} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#6b7280] hover:text-white transition-colors"
              >
                <FiInstagram size={20} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#6b7280] hover:text-white transition-colors"
              >
                <FiLinkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/courses" className="text-[#6b7280] hover:text-white transition-colors">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-[#6b7280] hover:text-white transition-colors">
                  Search
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-[#6b7280] hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-4">Account</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/auth/signin" className="text-[#6b7280] hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="text-[#6b7280] hover:text-white transition-colors">
                  Register
                </Link>
              </li>
              <li>
                <Link href="/auth/forgot-password" className="text-[#6b7280] hover:text-white transition-colors">
                  Forgot Password
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-[#6b7280] hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-[#6b7280] hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-[#6b7280] hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-[#333333] text-center">
          <p className="text-[#6b7280] text-sm">
            © {currentYear} TrueSpace. All rights reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  );
} 