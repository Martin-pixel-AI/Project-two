'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiEdit, FiTrash, FiPlus, FiUsers, FiVideo, FiTag, FiBox } from 'react-icons/fi';
import axios from 'axios';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('courses');
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [videos, setVideos] = useState([]);
  const [users, setUsers] = useState([]);
  const [promoCodes, setPromoCodes] = useState([]);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'admin') {
      fetchData();
    }
  }, [status, session, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let response;
      
      switch (activeTab) {
        case 'courses':
          response = await axios.get('/api/admin/courses');
          setCourses(response.data);
          break;
        case 'videos':
          response = await axios.get('/api/admin/videos');
          setVideos(response.data);
          break;
        case 'users':
          response = await axios.get('/api/admin/users');
          setUsers(response.data);
          break;
        case 'promocodes':
          response = await axios.get('/api/admin/promocodes');
          setPromoCodes(response.data);
          break;
      }
      
      setLoading(false);
    } catch (error) {
      console.error(`Error fetching ${activeTab}:`, error);
      setLoading(false);
    }
  };

  // Placeholder data for UI development
  const placeholderCourses = [
    {
      _id: '1',
      title: 'JavaScript Basics',
      category: 'Programming',
      instructor: 'John Doe',
      videos: [1, 2, 3],
      createdAt: '2023-06-15T12:00:00Z',
    },
    {
      _id: '2',
      title: 'Advanced CSS Techniques',
      category: 'Web Design',
      instructor: 'Sarah Smith',
      videos: [1, 2],
      createdAt: '2023-07-20T10:30:00Z',
    },
  ];

  const placeholderUsers = [
    {
      _id: '1',
      name: 'User One',
      email: 'user1@example.com',
      role: 'user',
      createdAt: '2023-05-10T09:15:00Z',
    },
    {
      _id: '2',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      createdAt: '2023-04-05T14:20:00Z',
    },
  ];

  const placeholderPromoCodes = [
    {
      _id: '1',
      code: 'SPRING2023',
      courseId: '1',
      maxUses: 100,
      usedCount: 45,
      isActive: true,
      expiresAt: '2023-12-31T23:59:59Z',
    },
    {
      _id: '2',
      code: 'SUMMER50',
      courseId: '2',
      maxUses: 50,
      usedCount: 12,
      isActive: true,
      expiresAt: '2023-09-30T23:59:59Z',
    },
  ];

  // Use placeholder data if real data is empty and not loading
  const displayedCourses = courses.length > 0 ? courses : placeholderCourses;
  const displayedUsers = users.length > 0 ? users : placeholderUsers;
  const displayedPromoCodes = promoCodes.length > 0 ? promoCodes : placeholderPromoCodes;

  // Simple date formatter
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-[#121212] pt-28 pb-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">
              Manage your educational platform content
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <div className="flex space-x-4">
              <Link
                href="/admin/courses/new"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md transition-colors flex items-center"
              >
                <FiPlus className="mr-2" />
                New Course
              </Link>
              <Link
                href="/admin/promocodes/new"
                className="px-4 py-2 bg-[#1c1c1c] hover:bg-[#252525] text-white font-medium rounded-md transition-colors border border-[#333333] flex items-center"
              >
                <FiTag className="mr-2" />
                New Promo Code
              </Link>
            </div>
          </div>
        </div>
        
        <div className="border-b border-[#333333] mb-6">
          <nav className="flex flex-wrap space-x-1 md:space-x-8">
            <button
              onClick={() => setActiveTab('courses')}
              className={`py-4 px-3 text-sm font-medium border-b-2 ${
                activeTab === 'courses'
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              <FiBox className="inline mr-2" />
              Courses
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`py-4 px-3 text-sm font-medium border-b-2 ${
                activeTab === 'videos'
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              <FiVideo className="inline mr-2" />
              Videos
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-3 text-sm font-medium border-b-2 ${
                activeTab === 'users'
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              <FiUsers className="inline mr-2" />
              Users
            </button>
            <button
              onClick={() => setActiveTab('promocodes')}
              className={`py-4 px-3 text-sm font-medium border-b-2 ${
                activeTab === 'promocodes'
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              <FiTag className="inline mr-2" />
              Promo Codes
            </button>
          </nav>
        </div>
        
        {/* Content Area */}
        <div className="bg-[#1c1c1c] rounded-lg border border-[#333333] overflow-hidden">
          {loading ? (
            <div className="py-20 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
              <p className="mt-4 text-gray-400">Loading data...</p>
            </div>
          ) : (
            <>
              {activeTab === 'courses' && (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-full divide-y divide-[#333333]">
                    <thead className="bg-[#252525]">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Title</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Instructor</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Videos</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Created</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#333333]">
                      {displayedCourses.map((course: any) => (
                        <tr key={course._id} className="hover:bg-[#252525]">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{course.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{course.category}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{course.instructor}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{course.videos?.length || 0}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatDate(course.createdAt)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link href={`/admin/courses/${course._id}/edit`} className="text-indigo-400 hover:text-indigo-300 mr-4">
                              <FiEdit className="inline" />
                            </Link>
                            <button className="text-red-400 hover:text-red-300">
                              <FiTrash className="inline" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {activeTab === 'users' && (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-full divide-y divide-[#333333]">
                    <thead className="bg-[#252525]">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Joined</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#333333]">
                      {displayedUsers.map((user: any) => (
                        <tr key={user._id} className="hover:bg-[#252525]">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{user.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              user.role === 'admin' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatDate(user.createdAt)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link href={`/admin/users/${user._id}/edit`} className="text-indigo-400 hover:text-indigo-300 mr-4">
                              <FiEdit className="inline" />
                            </Link>
                            <button className="text-red-400 hover:text-red-300">
                              <FiTrash className="inline" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {activeTab === 'promocodes' && (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-full divide-y divide-[#333333]">
                    <thead className="bg-[#252525]">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Code</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Course</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Usage</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Expires</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#333333]">
                      {displayedPromoCodes.map((code: any) => (
                        <tr key={code._id} className="hover:bg-[#252525]">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-white">{code.code}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{code.courseId}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {code.usedCount} / {code.maxUses || '∞'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              code.isActive ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                            }`}>
                              {code.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {code.expiresAt ? formatDate(code.expiresAt) : 'Never'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link href={`/admin/promocodes/${code._id}/edit`} className="text-indigo-400 hover:text-indigo-300 mr-4">
                              <FiEdit className="inline" />
                            </Link>
                            <button className="text-red-400 hover:text-red-300">
                              <FiTrash className="inline" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {activeTab === 'videos' && (
                <div className="p-8 text-center">
                  <FiVideo size={48} className="mx-auto text-gray-600 mb-4" />
                  <h3 className="text-xl font-medium text-white mb-2">Video Management</h3>
                  <p className="text-gray-400 mb-6">
                    Videos are managed through course editing. Please select a course to manage its videos.
                  </p>
                  <button
                    onClick={() => setActiveTab('courses')}
                    className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md transition-colors"
                  >
                    View Courses
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
} 