'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiPlay, FiArrowRight, FiCode, FiLayers, FiMusic, FiCamera, FiSearch, FiStar, FiFilter } from 'react-icons/fi';
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

// Данные о курсах в стиле Coursera
const courses = [
  {
    id: '1',
    title: 'Современный JavaScript для веб-разработки',
    description: 'Изучите новейшие функции JavaScript и техники для современной веб-разработки.',
    image: '/images/course-js.jpg',
    category: 'programming',
    instructor: 'Алекс Джонсон',
    organization: 'Tech Academy',
    rating: 4.8,
    reviewCount: 4327,
    level: 'Начинающий',
    icon: <FiCode size={24} />
  },
  {
    id: '2',
    title: 'Адаптивный UI дизайн с Tailwind CSS',
    description: 'Освойте принципы адаптивного дизайна с использованием фреймворка Tailwind CSS.',
    image: '/images/course-ui.jpg',
    category: 'design',
    instructor: 'Сара Чен',
    organization: 'Design School',
    rating: 4.7,
    reviewCount: 3201,
    level: 'Средний',
    icon: <FiLayers size={24} />
  },
  {
    id: '3',
    title: 'Основы аудиопроизводства',
    description: 'Начните работу с профессиональными методами и инструментами аудиопроизводства.',
    image: '/images/course-audio.jpg',
    category: 'music',
    instructor: 'Карлос Родригес',
    organization: 'Music Lab',
    rating: 4.6,
    reviewCount: 1842,
    level: 'Начинающий',
    icon: <FiMusic size={24} />
  },
  {
    id: '4',
    title: 'Мастер-класс по цифровой фотографии',
    description: 'Комплексное руководство по созданию потрясающих фотографий в любых условиях.',
    image: '/images/course-photo.jpg',
    category: 'photography',
    instructor: 'Мария Шмидт',
    organization: 'Photo Academy',
    rating: 4.9,
    reviewCount: 2716,
    level: 'Продвинутый',
    icon: <FiCamera size={24} />
  },
  {
    id: '5',
    title: 'Управление бизнес-процессами',
    description: 'Изучите эффективные методы управления и оптимизации бизнес-процессов.',
    image: '/images/course-business.jpg',
    category: 'business',
    instructor: 'Джон Смит',
    organization: 'Business School',
    rating: 4.5,
    reviewCount: 1976,
    level: 'Средний',
    icon: <FiLayers size={24} />
  },
  {
    id: '6',
    title: 'Разработка мобильных приложений с React Native',
    description: 'Создавайте нативные мобильные приложения с использованием React Native.',
    image: '/images/course-react.jpg',
    category: 'programming',
    instructor: 'Дэвид Ли',
    organization: 'Mobile Dev Institute',
    rating: 4.8,
    reviewCount: 3580,
    level: 'Средний',
    icon: <FiCode size={24} />
  },
  {
    id: '7',
    title: 'UX/UI дизайн: от концепции до прототипа',
    description: 'Комплексный курс по созданию пользовательских интерфейсов с фокусом на UX.',
    image: '/images/course-ux.jpg',
    category: 'design',
    instructor: 'Анна Петрова',
    organization: 'UX Academy',
    rating: 4.9,
    reviewCount: 4120,
    level: 'Начинающий',
    icon: <FiLayers size={24} />
  },
  {
    id: '8',
    title: 'Основы маркетинга в цифровой среде',
    description: 'Научитесь эффективным стратегиям цифрового маркетинга для современного бизнеса.',
    image: '/images/course-marketing.jpg',
    category: 'business',
    instructor: 'Елена Сидорова',
    organization: 'Marketing Institute',
    rating: 4.7,
    reviewCount: 2840,
    level: 'Начинающий',
    icon: <FiLayers size={24} />
  }
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Фильтрация курсов по категории и поисковому запросу
  const filteredCourses = courses.filter(course => 
    (activeCategory === 'all' || course.category === activeCategory) &&
    (course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     course.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="pt-16">
      {/* Hero Section - Coursera style */}
      <section className="py-16 bg-primary-light">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-4xl font-bold mb-4 text-gray-900">Учитесь у лучших преподавателей мира</h1>
                <p className="text-lg mb-6 text-gray-700">
                  Доступ к качественным онлайн-курсам от ведущих специалистов и организаций.
                  Приобретайте навыки в удобном для вас темпе.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/courses"
                    className="btn-primary"
                  >
                    Найти курсы
                  </Link>
                  <Link
                    href="/auth/register"
                    className="btn-secondary"
                  >
                    Зарегистрироваться бесплатно
                  </Link>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative w-full max-w-md">
                  <Image
                    src="/images/hero-image.jpg"
                    alt="Студенты"
                    width={500}
                    height={375}
                    className="rounded-lg shadow-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Нам доверяют ведущие компании</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            <div className="grayscale opacity-70 hover:opacity-100 transition-opacity">
              <img src="/images/partner-1.svg" alt="Partner" className="h-8" />
            </div>
            <div className="grayscale opacity-70 hover:opacity-100 transition-opacity">
              <img src="/images/partner-2.svg" alt="Partner" className="h-8" />
            </div>
            <div className="grayscale opacity-70 hover:opacity-100 transition-opacity">
              <img src="/images/partner-3.svg" alt="Partner" className="h-8" />
            </div>
            <div className="grayscale opacity-70 hover:opacity-100 transition-opacity">
              <img src="/images/partner-4.svg" alt="Partner" className="h-8" />
            </div>
            <div className="grayscale opacity-70 hover:opacity-100 transition-opacity">
              <img src="/images/partner-5.svg" alt="Partner" className="h-8" />
            </div>
          </div>
        </div>
      </section>
      
      {/* Courses Section - Coursera Style */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Найдите свой идеальный курс</h2>
              <p className="text-gray-600">Изучайте новые навыки, продвигайтесь по карьерной лестнице с нашими курсами</p>
            </div>
            <div className="mt-4 md:mt-0 w-full md:w-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Поиск курсов..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-64 px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>
          
          {/* Category Filters */}
          <div className="mb-10 overflow-x-auto pb-2">
            <div className="flex space-x-2 min-w-max">
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
          
          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredCourses.map((course) => (
              <motion.div
                key={course.id}
                className="course-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="course-image">
                  <div className="relative h-full">
                    <div className="absolute inset-0 flex items-center justify-center text-primary">
                      {course.icon}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <span className="text-xs font-medium py-1 px-2 bg-white rounded-sm">
                        {categories.find(c => c.id === course.category)?.name}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="course-info">
                  <div className="text-xs text-gray-500 mb-1">{course.organization}</div>
                  <h3 className="course-title mb-1">
                    <Link href={`/courses/${course.id}`} className="hover:text-primary transition-colors">
                      {course.title}
                    </Link>
                  </h3>
                  <div className="text-xs text-gray-500 mb-2">{course.instructor}</div>
                  
                  <div className="course-rating">
                    <div className="rating-stars flex">
                      {Array(5).fill(0).map((_, i) => (
                        <FiStar
                          key={i}
                          className={`${i < Math.floor(course.rating) ? 'fill-current' : 'stroke-current'}`}
                          size={14}
                        />
                      ))}
                    </div>
                    <span className="rating-count">{course.rating} ({course.reviewCount.toLocaleString()})</span>
                  </div>
                  
                  <div className="mt-3 text-xs font-medium text-gray-600">
                    {course.level}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">По вашему запросу курсы не найдены. Попробуйте изменить параметры поиска.</p>
            </div>
          )}
          
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
      
      {/* Advantages Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Почему TrueSpace?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Наша платформа разработана для эффективного обучения с фокусом на качестве контента и комфорте студентов
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center text-primary mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Гибкое обучение</h3>
              <p className="text-gray-600">
                Учитесь в своем темпе, в любое время и в любом месте. Наши курсы доступны 24/7 на всех устройствах.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center text-primary mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 4H8V20H16V4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 8H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 12H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 16H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 16H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Профессиональные инструкторы</h3>
              <p className="text-gray-600">
                Обучайтесь у экспертов в своей области с многолетним практическим опытом и глубокими знаниями.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center text-primary mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 11L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Сертификаты</h3>
              <p className="text-gray-600">
                Получайте сертификаты о прохождении курсов, которые подтверждают ваши навыки и знания в отрасли.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Что говорят наши студенты</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Отзывы от тех, кто уже прошел наши курсы и применяет полученные знания
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="rating-stars flex mr-2">
                  {Array(5).fill(0).map((_, i) => (
                    <FiStar key={i} className="fill-current text-yellow-400" size={16} />
                  ))}
                </div>
                <span className="text-gray-600 text-sm">5.0</span>
              </div>
              <p className="text-gray-600 mb-4">
                "Курс превзошел все мои ожидания. Материал структурирован логично, а объяснения простые и понятные. Я смог применить полученные знания сразу же."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                <div>
                  <h4 className="font-medium">Александр Петров</h4>
                  <p className="text-sm text-gray-500">Курс по JavaScript</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="rating-stars flex mr-2">
                  {Array(5).fill(0).map((_, i) => (
                    <FiStar key={i} className="fill-current text-yellow-400" size={16} />
                  ))}
                </div>
                <span className="text-gray-600 text-sm">5.0</span>
              </div>
              <p className="text-gray-600 mb-4">
                "Благодаря этому курсу я смогла сменить профессию и начать карьеру в UX/UI дизайне. Практические задания особенно полезны."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                <div>
                  <h4 className="font-medium">Екатерина Смирнова</h4>
                  <p className="text-sm text-gray-500">Курс по UX/UI дизайну</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="rating-stars flex mr-2">
                  {Array(5).fill(0).map((_, i) => (
                    <FiStar key={i} className={i < 4 ? "fill-current text-yellow-400" : "text-yellow-400"} size={16} />
                  ))}
                </div>
                <span className="text-gray-600 text-sm">4.0</span>
              </div>
              <p className="text-gray-600 mb-4">
                "Отличные преподаватели и актуальный контент. Единственное, хотелось бы больше практических заданий, но в целом курс очень хороший."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                <div>
                  <h4 className="font-medium">Дмитрий Иванов</h4>
                  <p className="text-sm text-gray-500">Курс по бизнес-процессам</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary-light">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Начните обучение уже сегодня</h2>
            <p className="text-lg mb-8 text-gray-700">
              Присоединяйтесь к тысячам студентов, которые уже изменили свою жизнь с помощью наших курсов
            </p>
            <Link
              href="/auth/register"
              className="btn-primary inline-block"
            >
              Зарегистрироваться бесплатно
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
