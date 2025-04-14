'use client';

import Link from 'next/link';
import { FiGithub, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white py-16 border-t border-gray-100">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <Link href="/" className="flex items-center mb-5">
              <span className="text-xl font-bold text-gray-900 mr-1">True</span>
              <span className="text-xl font-bold text-primary">Space</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Современная образовательная платформа с минималистичным дизайном для эффективного обучения.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-800 transition-colors"
                aria-label="GitHub"
              >
                <FiGithub size={20} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-800 transition-colors"
                aria-label="Twitter"
              >
                <FiTwitter size={20} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-800 transition-colors"
                aria-label="LinkedIn"
              >
                <FiLinkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-5">Платформа</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/courses" className="text-gray-500 hover:text-primary text-sm">
                  Курсы
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-500 hover:text-primary text-sm">
                  Блог
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-500 hover:text-primary text-sm">
                  Цены
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-500 hover:text-primary text-sm">
                  О нас
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-5">Поддержка</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/contact" className="text-gray-500 hover:text-primary text-sm">
                  Связаться с нами
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-500 hover:text-primary text-sm">
                  Часто задаваемые вопросы
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-500 hover:text-primary text-sm">
                  Политика конфиденциальности
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-500 hover:text-primary text-sm">
                  Условия использования
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 mb-4 md:mb-0">
            © {currentYear} TrueSpace. Все права защищены.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-primary text-sm">
              Конфиденциальность
            </a>
            <a href="#" className="text-gray-400 hover:text-primary text-sm">
              Правовая информация
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
} 