'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import { FiMenu, FiX, FiUser, FiLogOut, FiBookmark, FiSearch, FiChevronDown } from 'react-icons/fi';

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
        ease: "easeInOut" 
      }
    }
  };

  const menuVariants = {
    closed: {
      opacity: 0,
      y: "-100%",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      y: "0%",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.header 
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-sm dark:bg-gray-900" : "bg-white dark:bg-gray-900"
      }`}
      initial="hidden"
      animate="visible"
      variants={navVariants}
    >
      <div className="container mx-auto px-4 md:px-6 py-3 flex justify-between items-center">
        <Link href="/" onClick={closeMenu} className="flex items-center">
          <span className="text-xl font-bold text-gray-900 dark:text-white mr-1">True</span>
          <span className="text-xl font-bold text-primary">Space</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link 
            href="/courses" 
            className={`nav-link ${pathname === '/courses' ? 'nav-link-active' : ''}`}
          >
            Courses
          </Link>
          <Link 
            href="/search" 
            className={`nav-link ${pathname === '/search' ? 'nav-link-active' : ''}`}
          >
            <FiSearch className="inline mr-1" size={16} />
            Search
          </Link>
          
          {status === "authenticated" ? (
            <>
              <Link 
                href="/dashboard"
                className={`nav-link ${pathname === '/dashboard' ? 'nav-link-active' : ''}`}
              >
                <FiBookmark className="inline mr-1" size={16} />
                Dashboard
              </Link>
              <div className="relative ml-2">
                <button 
                  onClick={toggleDropdown}
                  className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition-colors py-2 px-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <span className="mr-2 hidden sm:inline">
                    {session?.user?.name || 'User'}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-primary-lighter dark:bg-primary-dark flex items-center justify-center">
                    {session?.user?.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        className="rounded-full w-8 h-8 object-cover"
                      />
                    ) : (
                      <FiUser className="text-primary dark:text-primary-light" />
                    )}
                  </div>
                  <FiChevronDown className="ml-1" size={16} />
                </button>
                
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <FiUser className="inline mr-2" size={16} />
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        signOut();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <FiLogOut className="inline mr-2" size={16} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link 
                href="/auth/signin" 
                className="nav-link"
              >
                Sign In
              </Link>
              <Link 
                href="/auth/register" 
                className="btn-primary ml-2"
              >
                Register
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-700 dark:text-gray-300 focus:outline-none"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <motion.div
        className="md:hidden fixed inset-0 bg-white dark:bg-gray-900 z-40 pt-20"
        initial="closed"
        animate={isMenuOpen ? "open" : "closed"}
        variants={menuVariants}
      >
        <div className="container mx-auto px-4 py-4 flex flex-col space-y-6">
          <Link 
            href="/courses" 
            className="text-lg font-medium text-gray-900 dark:text-white hover:text-primary transition-colors"
            onClick={closeMenu}
          >
            Courses
          </Link>
          <Link 
            href="/search" 
            className="text-lg font-medium text-gray-900 dark:text-white hover:text-primary transition-colors"
            onClick={closeMenu}
          >
            <FiSearch className="inline mr-2" />
            Search
          </Link>
          
          {status === "authenticated" ? (
            <>
              <Link 
                href="/dashboard"
                className="text-lg font-medium text-gray-900 dark:text-white hover:text-primary transition-colors"
                onClick={closeMenu}
              >
                <FiBookmark className="inline mr-2" />
                Dashboard
              </Link>
              <Link 
                href="/profile"
                className="text-lg font-medium text-gray-900 dark:text-white hover:text-primary transition-colors"
                onClick={closeMenu}
              >
                <FiUser className="inline mr-2" />
                Profile
              </Link>
              <button
                onClick={() => signOut()}
                className="text-lg font-medium text-gray-900 dark:text-white hover:text-primary transition-colors text-left"
              >
                <FiLogOut className="inline mr-2" />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link 
                href="/auth/signin" 
                className="text-lg font-medium text-gray-900 dark:text-white hover:text-primary transition-colors"
                onClick={closeMenu}
              >
                Sign In
              </Link>
              <Link 
                href="/auth/register" 
                className="btn-primary w-full justify-center mt-4"
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