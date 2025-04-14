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

  return (
    <header 
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-sm" : "bg-white"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 py-4 max-w-6xl">
        <div className="flex justify-between items-center">
          <Link href="/" onClick={closeMenu} className="flex items-center">
            <span className="text-xl font-bold text-gray-900 mr-1">True</span>
            <span className="text-xl font-bold text-primary">Space</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <div className="flex space-x-6">
              <Link 
                href="/courses" 
                className={`text-sm font-medium transition-colors hover:text-primary ${pathname === '/courses' ? 'text-primary' : 'text-gray-600'}`}
              >
                Курсы
              </Link>
              <Link 
                href="/search" 
                className={`text-sm font-medium transition-colors hover:text-primary ${pathname === '/search' ? 'text-primary' : 'text-gray-600'}`}
              >
                Поиск
              </Link>
              <Link 
                href="/blog" 
                className={`text-sm font-medium transition-colors hover:text-primary ${pathname === '/blog' ? 'text-primary' : 'text-gray-600'}`}
              >
                Блог
              </Link>
              <Link 
                href="/pricing" 
                className={`text-sm font-medium transition-colors hover:text-primary ${pathname === '/pricing' ? 'text-primary' : 'text-gray-600'}`}
              >
                Цены
              </Link>
            </div>
            
            {status === 'authenticated' && session ? (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center text-sm font-medium text-gray-700 focus:outline-none"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  <span className="mr-1">{session.user?.name || 'Пользователь'}</span>
                  <FiChevronDown className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} size={16} />
                </button>
                
                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-100">
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <FiBookmark className="inline mr-2" size={16} />
                      Мои курсы
                    </Link>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <FiUser className="inline mr-2" size={16} />
                      Профиль
                    </Link>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        signOut();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <FiLogOut className="inline mr-2" size={16} />
                      Выйти
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  href="/auth/signin" 
                  className="text-sm font-medium text-gray-700 hover:text-primary"
                >
                  Войти
                </Link>
                <Link 
                  href="/auth/register" 
                  className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium transition-colors hover:bg-primary-dark"
                >
                  Регистрация
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div 
          className="md:hidden absolute top-full left-0 w-full bg-white shadow-md z-40"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/courses" 
                className="text-base font-medium text-gray-700 hover:text-primary"
                onClick={closeMenu}
              >
                Курсы
              </Link>
              <Link 
                href="/search" 
                className="text-base font-medium text-gray-700 hover:text-primary"
                onClick={closeMenu}
              >
                Поиск
              </Link>
              <Link 
                href="/blog" 
                className="text-base font-medium text-gray-700 hover:text-primary"
                onClick={closeMenu}
              >
                Блог
              </Link>
              <Link 
                href="/pricing" 
                className="text-base font-medium text-gray-700 hover:text-primary"
                onClick={closeMenu}
              >
                Цены
              </Link>
              
              <div className="pt-4 border-t border-gray-100">
                {status === 'authenticated' && session ? (
                  <>
                    <Link 
                      href="/dashboard"
                      className="block py-2 text-base font-medium text-gray-700 hover:text-primary"
                      onClick={closeMenu}
                    >
                      Мои курсы
                    </Link>
                    <Link 
                      href="/profile"
                      className="block py-2 text-base font-medium text-gray-700 hover:text-primary"
                      onClick={closeMenu}
                    >
                      Профиль
                    </Link>
                    <button
                      onClick={() => {
                        closeMenu();
                        signOut();
                      }}
                      className="block py-2 text-base font-medium text-gray-700 hover:text-primary text-left w-full"
                    >
                      Выйти
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-3">
                    <Link 
                      href="/auth/signin" 
                      className="py-2 text-base font-medium text-gray-700 hover:text-primary"
                      onClick={closeMenu}
                    >
                      Войти
                    </Link>
                    <Link 
                      href="/auth/register" 
                      className="px-4 py-2 bg-primary text-white rounded-md text-base font-medium transition-colors hover:bg-primary-dark text-center"
                      onClick={closeMenu}
                    >
                      Регистрация
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
} 