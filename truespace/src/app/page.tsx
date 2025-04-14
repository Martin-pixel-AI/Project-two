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
      <section className="min-h-[90vh] flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-light/10 to-transparent z-0" />
        
        <motion.div 
          className="absolute inset-0 z-0 opacity-10 dark:opacity-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1.5 }}
        >
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/grid.svg')] bg-repeat" />
        </motion.div>
        
        <div className="container mx-auto px-4 z-10 py-16">
          <motion.div 
            className="max-w-2xl mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="mb-4">
              <span className="inline-block py-1 px-3 text-xs font-medium text-primary bg-primary-light/20 dark:bg-primary-dark/30 dark:text-primary-light rounded-full">
                Discover Learning
              </span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300"
              variants={itemVariants}
            >
              Expand Your Knowledge
            </motion.h1>
            
            <motion.p 
              className="text-gray-600 dark:text-gray-400 text-lg md:text-xl mb-8"
              variants={itemVariants}
            >
              Access high-quality educational content with an elegant, minimalist experience. 
              Unlock courses and learn at your own pace.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={itemVariants}
            >
              <Link
                href="/courses"
                className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg flex items-center justify-center transition-colors shadow-sm hover:shadow"
              >
                Browse Courses <FiArrowRight className="ml-2" />
              </Link>
              <Link
                href="/auth/register"
                className="px-6 py-3 bg-white dark:bg-transparent border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-900 dark:text-white font-medium rounded-lg flex items-center justify-center transition-colors shadow-sm hover:shadow"
              >
                Sign Up Free
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Featured Courses Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4">Featured Courses</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover our most popular courses designed to help you master new skills.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover-lift border border-gray-100 dark:border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="relative aspect-video bg-gray-100 dark:bg-gray-700/50">
                  <div className="absolute inset-0 flex items-center justify-center text-primary dark:text-primary-light">
                    {course.icon}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/20 to-transparent">
                    <span className="text-xs font-medium py-1 px-2 bg-primary-light dark:bg-primary-dark text-primary-dark dark:text-primary-light rounded-full">
                      {course.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-5">
                  <h3 className="text-lg font-semibold mb-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-500">
                      Instructor: {course.instructor}
                    </span>
                    <Link
                      href={`/courses/${course.id}`}
                      className="flex items-center text-primary hover:text-primary-dark dark:text-primary-light text-sm font-medium"
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
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/courses"
              className="inline-flex items-center text-primary dark:text-primary-light hover:text-primary-dark dark:hover:text-white font-medium"
            >
              View all courses <FiArrowRight className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Features Section - more clean and minimal */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4">Why Choose TrueSpace?</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Our platform is designed with simplicity and focus in mind, helping you achieve your learning goals.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Just use clean, minimal feature cards with icons instead of complex graphics */}
            <motion.div
              className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="w-12 h-12 bg-primary-light/20 dark:bg-primary-dark/20 rounded-lg flex items-center justify-center text-primary dark:text-primary-light mb-4">
                <FiPlay size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">High-quality Content</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Courses created by industry experts, optimized for effective learning.
              </p>
            </motion.div>
            
            <motion.div
              className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-12 h-12 bg-primary-light/20 dark:bg-primary-dark/20 rounded-lg flex items-center justify-center text-primary dark:text-primary-light mb-4">
                <FiLayers size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Clean Viewing Experience</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Minimalist interface focused on the content, without distractions.
              </p>
            </motion.div>
            
            <motion.div
              className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="w-12 h-12 bg-primary-light/20 dark:bg-primary-dark/20 rounded-lg flex items-center justify-center text-primary dark:text-primary-light mb-4">
                <FiCode size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Learn at Your Own Pace</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Access courses anytime, track your progress, and learn on your schedule.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section - simplified */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Join thousands of students already learning on TrueSpace.
            </p>
            <Link
              href="/auth/register"
              className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg inline-flex items-center transition-colors shadow-sm"
            >
              Get Started <FiArrowRight className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
