'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiPlay, FiArrowRight, FiCode, FiLayers, FiMusic, FiCamera } from 'react-icons/fi';
import Image from 'next/image';

// Sample course data for prototype
const featuredCourses = [
  {
    id: '1',
    title: 'Modern JavaScript for Web Development',
    description: 'Learn the latest JavaScript features and techniques for modern web development.',
    thumbnailUrl: '/images/course-js.jpg',
    category: 'Programming',
    instructor: 'Alex Johnson',
    icon: <FiCode size={24} />
  },
  {
    id: '2',
    title: 'Responsive UI Design with Tailwind CSS',
    description: 'Master responsive design principles using the Tailwind CSS framework.',
    thumbnailUrl: '/images/course-ui.jpg',
    category: 'Design',
    instructor: 'Sarah Chen',
    icon: <FiLayers size={24} />
  },
  {
    id: '3',
    title: 'Audio Production Fundamentals',
    description: 'Get started with professional audio production techniques and tools.',
    thumbnailUrl: '/images/course-audio.jpg',
    category: 'Music',
    instructor: 'Carlos Rodriguez',
    icon: <FiMusic size={24} />
  },
  {
    id: '4',
    title: 'Digital Photography Masterclass',
    description: 'Comprehensive guide to capturing stunning photos in any environment.',
    thumbnailUrl: '/images/course-photo.jpg',
    category: 'Photography',
    instructor: 'Maria Schmidt',
    icon: <FiCamera size={24} />
  }
];

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="min-h-[90vh] flex items-center relative bg-[#121212] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-indigo-900/20 z-0" />
        
        <motion.div 
          className="absolute inset-0 z-0 opacity-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1.5 }}
        >
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/grid.svg')] bg-repeat" />
        </motion.div>
        
        <div className="container mx-auto px-4 z-10 py-16">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="mb-4">
              <span className="inline-block py-1 px-3 text-xs font-medium bg-purple-600/20 text-purple-400 rounded-full">
                Discover Learning
              </span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300"
              variants={itemVariants}
            >
              Expand Your Knowledge with Premium Video Courses
            </motion.h1>
            
            <motion.p 
              className="text-gray-400 text-lg md:text-xl mb-8"
              variants={itemVariants}
            >
              Access high-quality educational content with an elegant, minimalist experience. 
              Unlock courses with promo codes and learn at your own pace.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={itemVariants}
            >
              <Link
                href="/courses"
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md flex items-center justify-center transition-colors"
              >
                Browse Courses <FiArrowRight className="ml-2" />
              </Link>
              <Link
                href="/auth/register"
                className="px-6 py-3 bg-transparent border border-white/20 hover:bg-white/10 text-white font-medium rounded-md flex items-center justify-center transition-colors"
              >
                Sign Up Free
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#121212] to-transparent z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        />
      </section>
      
      {/* Featured Courses Section */}
      <section className="py-20 bg-[#121212]">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Featured Courses</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Discover our most popular courses designed to help you master new skills and advance your career.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                className="bg-[#1c1c1c] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-[#333333]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="relative aspect-video bg-[#252525]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {course.icon}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                    <span className="text-xs font-medium py-1 px-2 bg-purple-600 rounded-full text-white">
                      {course.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-5">
                  <h3 className="text-lg font-semibold mb-2 text-white">
                    {course.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {course.description}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      Instructor: {course.instructor}
                    </span>
                    <Link
                      href={`/courses/${course.id}`}
                      className="flex items-center text-purple-400 hover:text-purple-300 text-sm font-medium"
                    >
                      Watch <FiPlay className="ml-1" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Link
              href="/courses"
              className="inline-flex items-center px-6 py-3 bg-transparent border border-purple-600 text-purple-400 hover:bg-purple-600/10 font-medium rounded-md transition-colors"
            >
              View All Courses <FiArrowRight className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Promo Code Section */}
      <section className="py-20 bg-[#171717]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative aspect-video bg-[#252525] rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center">
                    <FiPlay size={30} className="text-white ml-1" />
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-lg"
            >
              <span className="inline-block py-1 px-3 text-xs font-medium bg-purple-600/20 text-purple-400 rounded-full mb-4">
                Exclusive Access
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Unlock Premium Content with Promo Codes
              </h2>
              <p className="text-gray-400 mb-8">
                TrueSpace offers a unique approach to educational content. Use your promo codes to access our premium courses 
                and learn at your own pace with our beautifully designed platform.
              </p>
              
              <div className="bg-[#1c1c1c] p-6 rounded-lg border border-[#333333]">
                <h3 className="text-xl font-semibold mb-4 text-white">
                  Have a promo code?
                </h3>
                
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Enter your promo code" 
                    className="flex-grow px-4 py-3 bg-[#252525] border border-[#333333] focus:border-purple-500 rounded-md focus:outline-none text-white"
                  />
                  <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md transition-colors">
                    Apply
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
