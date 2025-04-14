'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight, FiSearch } from 'react-icons/fi';
import Image from 'next/image';

// Категории курсов для фильтрации
const categories = [
  { id: 'all', name: 'Все курсы' },
  { id: 'programming', name: 'Программирование' },
  { id: 'design', name: 'Дизайн' },
  { id: 'business', name: 'Бизнес' },
  { id: 'music', name: 'Музыка' },
  { id: 'photography', name: 'Фотография' },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen">
      {/* Hero Section - Минималистичный стиль Feather */}
      <section className="py-24 md:py-32 bg-[#f8f9fa]">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center">
            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 text-gray-900 leading-tight"
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
                className="btn-primary py-3 px-8 text-base font-medium rounded-md"
              >
                Найти курсы
              </Link>
              <Link
                href="/auth/register"
                className="btn-outline py-3 px-8 text-base font-medium rounded-md"
              >
                Начать бесплатно
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex justify-center"
            >
              <div className="flex items-center justify-center flex-wrap gap-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gray-200" />
                ))}
              </div>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-gray-500 mt-4"
            >
              Присоединяйтесь к 50,000+ студентов и начните обучение сегодня
            </motion.p>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Популярные курсы</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Выберите из нашей коллекции тщательно подобранных курсов,
              созданных лучшими экспертами
            </p>
          </div>
          
          {/* Category Filters */}
          <div className="mb-10 overflow-x-auto pb-2">
            <div className="flex justify-center space-x-2 min-w-max">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === category.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="mb-10 max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск курсов..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>
          
          {/* Placeholder для курсов (минималистичный) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="h-40 bg-gray-100"></div>
                <div className="p-6">
                  <div className="text-sm text-primary font-medium mb-2">Категория</div>
                  <h3 className="text-xl font-semibold mb-2">Название курса</h3>
                  <p className="text-gray-600 mb-4">Краткое описание курса. Изучите основы и станьте профессионалом.</p>
                  <Link href="/courses/1" className="text-primary font-medium flex items-center">
                    Подробнее <FiArrowRight className="ml-2" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link
              href="/courses"
              className="inline-flex items-center text-primary hover:underline font-medium"
            >
              Смотреть все курсы <FiArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-[#f8f9fa]">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Готовы начать обучение?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Присоединяйтесь к нашему сообществу и начните свой путь к новым знаниям
            </p>
            <Link
              href="/auth/register"
              className="btn-primary py-3 px-8 text-base font-medium rounded-md inline-block"
            >
              Начать бесплатно
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
