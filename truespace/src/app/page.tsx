'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight, FiSearch, FiPlay, FiUsers, FiAward } from 'react-icons/fi';
import Image from 'next/image';

// Категории курсов для фильтрации
const categories = [
  { id: 'all', name: 'Все курсы', icon: FiPlay },
  { id: 'programming', name: 'Программирование', icon: FiPlay },
  { id: 'design', name: 'Дизайн', icon: FiPlay },
  { id: 'business', name: 'Бизнес', icon: FiPlay },
  { id: 'music', name: 'Музыка', icon: FiPlay },
  { id: 'photography', name: 'Фотография', icon: FiPlay },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 gradient-bg"></div>
        <div className="container mx-auto px-4 max-w-6xl relative">
          <div className="text-center">
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-8 gradient-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Качественное образование<br />для вашего будущего
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Доступ к лучшим онлайн-курсам от ведущих специалистов.
              Никаких сложностей — просто учитесь и развивайтесь.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link
                href="/courses"
                className="btn-primary"
              >
                Найти курсы
              </Link>
              <Link
                href="/auth/register"
                className="btn-outline"
              >
                Начать бесплатно
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex justify-center gap-8 mb-12"
            >
              <div className="text-center">
                <div className="text-4xl font-bold gradient-text mb-2">50K+</div>
                <div className="text-gray-600">Студентов</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold gradient-text mb-2">100+</div>
                <div className="text-gray-600">Курсов</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold gradient-text mb-2">4.8</div>
                <div className="text-gray-600">Рейтинг</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 gradient-text">Популярные курсы</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Выберите из нашей коллекции тщательно подобранных курсов,
              созданных лучшими экспертами
            </p>
          </div>
          
          {/* Category Filters */}
          <div className="mb-10 overflow-x-auto">
            <div className="flex justify-center gap-2 min-w-max">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                    activeCategory === category.id
                      ? 'bg-primary text-white shadow-lg shadow-primary/25'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <category.icon className="w-4 h-4" />
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="mb-12 max-w-xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск курсов..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 pl-12 rounded-full shadow-lg shadow-gray-100/50 border-none focus:ring-2 focus:ring-primary/30"
              />
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>
          
          {/* Course Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                className="course-card group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="relative h-48 bg-gray-100">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
                <div className="p-8">
                  <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                    Категория
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    Название курса
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Краткое описание курса. Изучите основы и станьте профессионалом.
                  </p>
                  <Link 
                    href="/courses/1" 
                    className="inline-flex items-center text-primary font-medium group-hover:gap-3 transition-all"
                  >
                    Подробнее <FiArrowRight className="ml-2" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link
              href="/courses"
              className="inline-flex items-center text-primary hover:gap-3 transition-all font-medium"
            >
              Смотреть все курсы <FiArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="glass p-12 rounded-[2rem] text-center relative overflow-hidden">
            <div className="absolute inset-0 gradient-bg opacity-30"></div>
            <div className="relative">
              <h2 className="text-4xl font-bold mb-4 gradient-text">Готовы начать обучение?</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                Присоединяйтесь к нашему сообществу и начните свой путь к новым знаниям
              </p>
              <Link
                href="/auth/register"
                className="btn-primary inline-block"
              >
                Начать бесплатно
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
