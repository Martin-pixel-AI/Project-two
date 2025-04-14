'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { FaPlay, FaChalkboardTeacher, FaBook, FaUsers, FaLock, FaUnlock, FaClock } from 'react-icons/fa';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Video {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  previewUrl?: string;
  duration: number;
  order: number;
  isFree: boolean;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  instructor: {
    name: string;
    bio: string;
    avatar: string;
  };
  category: string;
  level: string;
  imageUrl: string;
  videos: Video[];
  hasAccess: boolean;
}

export default function CoursePage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountedPrice, setDiscountedPrice] = useState(0);

  const courseId = params?.courseId as string;

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/courses/${courseId}`);
        setCourse(data);
        setDiscountedPrice(data.price);
      } catch (err) {
        console.error('Error fetching course:', err);
        setError('Failed to load course details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const applyPromoCode = async () => {
    if (!promoCode.trim()) return;
    
    try {
      const { data } = await axios.post('/api/promo-codes/apply', {
        promoCode,
        courseId
      });
      
      if (data.valid && course) {
        const discount = data.discountPercentage / 100;
        const newPrice = course.price * (1 - discount);
        setDiscountedPrice(newPrice);
        setDiscountApplied(true);
      } else {
        alert('Invalid or expired promo code');
      }
    } catch (err) {
      console.error('Error applying promo code:', err);
      alert('Failed to apply promo code');
    }
  };

  const handlePurchase = async () => {
    if (!session) {
      router.push(`/auth/signin?callbackUrl=/courses/${courseId}`);
      return;
    }

    try {
      setPurchaseLoading(true);
      
      // Create payment or access grant logic here
      const { data } = await axios.post('/api/course-access', {
        courseId,
        promoCode: discountApplied ? promoCode : null
      });
      
      // Reload the course to update access status
      const updatedCourse = await axios.get(`/api/courses/${courseId}`);
      setCourse(updatedCourse.data);
      
      alert('Course purchased successfully!');
    } catch (err) {
      console.error('Error purchasing course:', err);
      alert('Failed to process purchase. Please try again.');
    } finally {
      setPurchaseLoading(false);
    }
  };

  const getTotalDuration = () => {
    if (!course?.videos) return 0;
    return course.videos.reduce((total, video) => total + video.duration, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
            <p>{error || 'Course not found'}</p>
            <button 
              onClick={() => router.push('/dashboard')}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const totalDuration = getTotalDuration();
  const hours = Math.floor(totalDuration / 60);
  const minutes = totalDuration % 60;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">
        {/* Hero Section */}
        <div className="relative w-full h-[300px] bg-gray-900">
          {course.imageUrl && (
            <Image
              src={course.imageUrl}
              alt={course.title}
              fill
              className="object-cover opacity-30"
              sizes="100vw"
            />
          )}
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{course.title}</h1>
              <div className="flex items-center text-white space-x-4 mb-4">
                <span className="flex items-center">
                  <FaChalkboardTeacher className="mr-2" />
                  {course.instructor.name}
                </span>
                <span className="flex items-center">
                  <FaBook className="mr-2" />
                  {course.category}
                </span>
                <span className="flex items-center">
                  <FaUsers className="mr-2" />
                  {course.level}
                </span>
                <span className="flex items-center">
                  <FaClock className="mr-2" />
                  {hours > 0 ? `${hours}h ` : ''}{minutes}m
                </span>
              </div>
              {course.hasAccess && (
                <button
                  onClick={() => {
                    const firstVideo = course.videos[0];
                    if (firstVideo) {
                      router.push(`/courses/${courseId}/videos/${firstVideo._id}`);
                    }
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium flex items-center"
                  disabled={!course.videos.length}
                >
                  <FaPlay className="mr-2" /> Start Learning
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Content */}
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-2xl font-bold mb-4">About This Course</h2>
                <p className="text-gray-700 whitespace-pre-line">{course.description}</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-2xl font-bold mb-4">Instructor</h2>
                <div className="flex items-start">
                  <div className="mr-4">
                    {course.instructor.avatar ? (
                      <Image
                        src={course.instructor.avatar}
                        alt={course.instructor.name}
                        width={80}
                        height={80}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                        <FaChalkboardTeacher className="text-gray-400 text-2xl" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{course.instructor.name}</h3>
                    <p className="text-gray-700 mt-2">{course.instructor.bio}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Course Content</h2>
                <p className="text-gray-600 mb-4">
                  {course.videos.length} videos • {hours > 0 ? `${hours}h ` : ''}{minutes}m total length
                </p>

                <div className="space-y-2">
                  {course.videos.map((video) => (
                    <div 
                      key={video._id} 
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">
                            {video.order}. {video.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')} min
                          </p>
                        </div>
                        
                        {video.isFree || course.hasAccess ? (
                          <Link
                            href={`/courses/${courseId}/videos/${video._id}`}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full flex items-center"
                          >
                            <FaPlay className="mr-1 text-xs" /> Watch
                          </Link>
                        ) : (
                          <span className="flex items-center text-gray-500">
                            <FaLock className="mr-1" /> Locked
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Purchase Card */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-md sticky top-8">
                {course.hasAccess ? (
                  <div className="text-center">
                    <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg flex items-center justify-center">
                      <FaUnlock className="mr-2" /> You have access to this course
                    </div>
                    
                    <button
                      onClick={() => {
                        const firstVideo = course.videos[0];
                        if (firstVideo) {
                          router.push(`/courses/${courseId}/videos/${firstVideo._id}`);
                        }
                      }}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-medium flex items-center justify-center"
                      disabled={!course.videos.length}
                    >
                      <FaPlay className="mr-2" /> Start Learning
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold mb-1">
                        {discountApplied ? (
                          <div className="flex items-center justify-center">
                            <span className="line-through text-gray-500 text-xl mr-2">${course.price}</span>
                            <span>${discountedPrice.toFixed(2)}</span>
                          </div>
                        ) : (
                          <span>${course.price}</span>
                        )}
                      </div>
                      <div className="text-gray-500">One-time payment, lifetime access</div>
                    </div>

                    <button
                      onClick={handlePurchase}
                      disabled={purchaseLoading}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-medium mb-4"
                    >
                      {purchaseLoading ? 'Processing...' : 'Purchase Course'}
                    </button>

                    <div className="mt-6">
                      <p className="text-gray-600 mb-2">Have a promo code?</p>
                      <div className="flex">
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className="flex-grow border border-gray-300 rounded-l-lg px-3 py-2"
                          placeholder="Enter promo code"
                        />
                        <button
                          onClick={applyPromoCode}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-r-lg"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </>
                )}

                <div className="mt-6">
                  <h3 className="font-bold mb-2">This course includes:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-600">
                      <FaPlay className="mr-2 text-blue-500" /> {course.videos.length} on-demand videos
                    </li>
                    <li className="flex items-center text-gray-600">
                      <FaClock className="mr-2 text-blue-500" /> {hours > 0 ? `${hours}h ` : ''}{minutes}m total content
                    </li>
                    <li className="flex items-center text-gray-600">
                      <FaUnlock className="mr-2 text-blue-500" /> Lifetime access
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 