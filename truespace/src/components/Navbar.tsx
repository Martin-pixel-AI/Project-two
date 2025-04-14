'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import { FiMenu, FiX, FiUser, FiLogOut, FiBookmark, FiSearch } from 'react-icons/fi';

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeInOut" 
      }
    }
  };

  const menuVariants = {
    closed: {
      opacity: 0,
      y: "-100%",
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      y: "0%",
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.header 
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-[#121212]/90 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
      initial="hidden"
      animate="visible"
      variants={navVariants}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" onClick={closeMenu}>
          <div className="flex items-center">
            <span className="text-xl font-bold text-white mr-1">True</span>
            <span className="text-xl font-bold text-purple-500">Space</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            href="/courses" 
            className={`text-sm font-medium transition-colors hover:text-purple-400 ${
              pathname === '/courses' ? 'text-purple-500' : 'text-white'
            }`}
          >
            Courses
          </Link>
          <Link 
            href="/search" 
            className={`text-sm font-medium transition-colors hover:text-purple-400 ${
              pathname === '/search' ? 'text-purple-500' : 'text-white'
            }`}
          >
            <FiSearch className="inline mr-1" />
            Search
          </Link>
          
          {status === 'authenticated' && session?.user ? (
            <>
              <Link 
                href="/dashboard"
                className={`text-sm font-medium transition-colors hover:text-purple-400 ${
                  pathname === '/dashboard' ? 'text-purple-500' : 'text-white'
                }`}
              >
                <FiBookmark className="inline mr-1" />
                Dashboard
              </Link>
              <div className="relative group">
                <button className="flex items-center text-sm font-medium">
                  <span className="mr-2">
                    {session.user.name || 'User'}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        className="rounded-full w-8 h-8 object-cover"
                      />
                    ) : (
                      <FiUser className="text-white" />
                    )}
                  </div>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-[#1c1c1c] rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-white hover:bg-[#333333]"
                  >
                    <FiUser className="inline mr-2" />
                    Profile
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#333333]"
                  >
                    <FiLogOut className="inline mr-2" />
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link 
                href="/auth/signin" 
                className="text-sm font-medium text-white hover:text-purple-400 transition-colors"
              >
                Sign In
              </Link>
              <Link 
                href="/auth/register" 
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <motion.div
        className="md:hidden fixed inset-0 bg-[#121212]/95 backdrop-blur-md z-40 pt-20"
        initial="closed"
        animate={isMenuOpen ? "open" : "closed"}
        variants={menuVariants}
      >
        <div className="container mx-auto px-4 py-4 flex flex-col space-y-6">
          <Link 
            href="/courses" 
            className="text-lg font-medium hover:text-purple-400 transition-colors"
            onClick={closeMenu}
          >
            Courses
          </Link>
          <Link 
            href="/search" 
            className="text-lg font-medium hover:text-purple-400 transition-colors"
            onClick={closeMenu}
          >
            <FiSearch className="inline mr-2" />
            Search
          </Link>
          
          {status === 'authenticated' && session?.user ? (
            <>
              <Link 
                href="/dashboard"
                className="text-lg font-medium hover:text-purple-400 transition-colors"
                onClick={closeMenu}
              >
                <FiBookmark className="inline mr-2" />
                Dashboard
              </Link>
              <Link 
                href="/profile"
                className="text-lg font-medium hover:text-purple-400 transition-colors"
                onClick={closeMenu}
              >
                <FiUser className="inline mr-2" />
                Profile
              </Link>
              <button
                onClick={() => signOut()}
                className="text-lg font-medium hover:text-purple-400 transition-colors text-left"
              >
                <FiLogOut className="inline mr-2" />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link 
                href="/auth/signin" 
                className="text-lg font-medium hover:text-purple-400 transition-colors"
                onClick={closeMenu}
              >
                Sign In
              </Link>
              <Link 
                href="/auth/register" 
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md text-lg font-medium transition-colors w-full text-center"
                onClick={closeMenu}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </motion.header>
  );
} 