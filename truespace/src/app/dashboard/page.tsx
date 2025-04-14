'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiPlay, FiBookmark, FiClock, FiSearch } from 'react-icons/fi';
import axios from 'axios';
import ContinueWatching from '@/components/ContinueWatching';

interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  category: string;
  instructor: string;
  createdAt: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [savedCourses, setSavedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('enrolled');
  const [promoCode, setPromoCode] = useState('');
  const [applyingCode, setApplyingCode] = useState(false);
  const [codeError, setCodeError] = useState('');
  const [codeSuccess, setCodeSuccess] = useState('');

  useEffect(() => {
    if (status === 'authenticated') {
      fetchUserCourses();
    }
  }, [status]);

  const fetchUserCourses = async () => {
    try {
      setLoading(true);
      
      // Fetch enrolled courses (courses user has access to)
      const enrolledResponse = await axios.get('/api/user/courses/enrolled');
      setEnrolledCourses(enrolledResponse.data);
      
      // Fetch saved/bookmarked courses
      const savedResponse = await axios.get('/api/user/courses/saved');
      setSavedCourses(savedResponse.data);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setLoading(false);
    }
  };

  const handleApplyPromoCode = async () => {
    if (!promoCode.trim()) return;
    
    try {
      setApplyingCode(true);
      setCodeError('');
      setCodeSuccess('');
      
      const response = await axios.post('/api/promocodes/apply', { code: promoCode });
      
      setCodeSuccess('Promo code applied successfully! You now have access to the course.');
      setPromoCode('');
      
      // Refresh courses list to show newly accessible course
      fetchUserCourses();
      
      setApplyingCode(false);
    } catch (error: any) {
      setCodeError(error.response?.data?.error || 'Failed to apply promo code');
      setApplyingCode(false);
    }
  };

  // For demo purposes - placeholder data if no real data is available yet
  const placeholderCourses = [
    {
      _id: '1',
      title: 'Getting Started with JavaScript',
      description: 'Learn the fundamentals of JavaScript programming.',
      thumbnailUrl: '/images/course-js.jpg',
      category: 'Programming',
      instructor: 'Alex Johnson',
      createdAt: new Date().toISOString(),
    },
    {
      _id: '2',
      title: 'Introduction to UI Design',
      description: 'Master the basics of user interface design.',
      thumbnailUrl: '/images/course-ui.jpg',
      category: 'Design',
      instructor: 'Sarah Chen',
      createdAt: new Date().toISOString(),
    },
  ];

  // Use placeholder data if no real data and not loading
  const displayedEnrolledCourses = enrolledCourses.length > 0 ? enrolledCourses : placeholderCourses;
  const displayedSavedCourses = savedCourses.length > 0 ? savedCourses : [];

  return (
    <div className="min-h-screen bg-[#121212] pt-28 pb-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Your Dashboard</h1>
            <p className="text-gray-400">
              Welcome back, {session?.user?.name || 'User'}
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 w-full md:w-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter promo code"
                  className="w-full sm:w-64 px-4 py-2 bg-[#252525] border border-[#333333] focus:border-purple-500 rounded-md focus:outline-none text-white"
                />
              </div>
              <button
                onClick={handleApplyPromoCode}
                disabled={applyingCode || !promoCode.trim()}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md transition-colors disabled:opacity-50"
              >
                {applyingCode ? 'Applying...' : 'Apply Code'}
              </button>
            </div>
            
            {codeError && (
              <p className="mt-2 text-red-400 text-sm">{codeError}</p>
            )}
            
            {codeSuccess && (
              <p className="mt-2 text-green-400 text-sm">{codeSuccess}</p>
            )}
          </div>
        </div>
        
        <div className="mb-12">
          <ContinueWatching />
        </div>
        
        <div className="mb-8">
          <div className="border-b border-[#333333] mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('enrolled')}
                className={`py-4 px-1 text-sm font-medium border-b-2 ${
                  activeTab === 'enrolled'
                    ? 'border-purple-500 text-purple-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                <FiPlay className="inline mr-2" />
                My Courses
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`py-4 px-1 text-sm font-medium border-b-2 ${
                  activeTab === 'saved'
                    ? 'border-purple-500 text-purple-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                <FiBookmark className="inline mr-2" />
                Saved Courses
              </button>
            </nav>
          </div>
          
          {loading ? (
            <div className="py-20 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
              <p className="mt-4 text-gray-400">Loading your courses...</p>
            </div>
          ) : activeTab === 'enrolled' ? (
            <>
              {displayedEnrolledCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedEnrolledCourses.map((course, index) => (
                    <motion.div
                      key={course._id}
                      className="bg-[#1c1c1c] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-[#333333]"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                      <div className="relative aspect-video bg-[#252525]">
                        {/* Placeholder for course thumbnail */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 bg-purple-600/50 rounded-full flex items-center justify-center">
                            <FiPlay size={20} className="text-white ml-1" />
                          </div>
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
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                          {course.description}
                        </p>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500 flex items-center">
                            <FiClock className="mr-1" /> {new Date(course.createdAt).toLocaleDateString()}
                          </span>
                          <Link
                            href={`/courses/${course._id}`}
                            className="flex items-center text-purple-400 hover:text-purple-300 text-sm font-medium"
                          >
                            Continue <FiPlay className="ml-1" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center bg-[#1c1c1c] rounded-lg border border-[#333333]">
                  <FiSearch size={48} className="mx-auto text-gray-600 mb-4" />
                  <h3 className="text-xl font-medium text-white mb-2">No courses yet</h3>
                  <p className="text-gray-400 mb-6">
                    Use a promo code to unlock courses or browse our collection
                  </p>
                  <Link
                    href="/courses"
                    className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md transition-colors"
                  >
                    Browse Courses
                  </Link>
                </div>
              )}
            </>
          ) : (
            <>
              {displayedSavedCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedSavedCourses.map((course, index) => (
                    <motion.div
                      key={course._id}
                      className="bg-[#1c1c1c] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-[#333333]"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                      {/* Same course card layout as above */}
                      <div className="relative aspect-video bg-[#252525]">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 bg-purple-600/50 rounded-full flex items-center justify-center">
                            <FiPlay size={20} className="text-white ml-1" />
                          </div>
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
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                          {course.description}
                        </p>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">
                            Instructor: {course.instructor}
                          </span>
                          <Link
                            href={`/courses/${course._id}`}
                            className="flex items-center text-purple-400 hover:text-purple-300 text-sm font-medium"
                          >
                            View <FiPlay className="ml-1" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center bg-[#1c1c1c] rounded-lg border border-[#333333]">
                  <FiBookmark size={48} className="mx-auto text-gray-600 mb-4" />
                  <h3 className="text-xl font-medium text-white mb-2">No saved courses</h3>
                  <p className="text-gray-400 mb-6">
                    Save courses for later by clicking the bookmark icon on courses you're interested in
                  </p>
                  <Link
                    href="/courses"
                    className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md transition-colors"
                  >
                    Browse Courses
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
} 