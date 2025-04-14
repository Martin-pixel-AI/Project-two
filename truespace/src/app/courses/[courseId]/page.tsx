'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, LockIcon, PlayIcon, ArrowLeft } from 'lucide-react';

interface Video {
  _id: string;
  title: string;
  description: string;
  duration: number;
  isFree: boolean;
  thumbnail: string;
  videoUrl: string;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  instructor: string;
  thumbnail: string;
  createdAt: string;
  videos: Video[];
}

interface VideoProgress {
  currentTime: number;
  duration: number;
  completed: boolean;
}

export default function CourseDetails({ params }: { params: { courseId: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [videoProgress, setVideoProgress] = useState<Record<string, VideoProgress>>({});

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/courses/${params.courseId}`);
        if (res.ok) {
          const data = await res.json();
          setCourse(data);
          
          // Check if user has access to this course
          if (session?.user) {
            const accessRes = await fetch(`/api/user/courses/check-access?courseId=${params.courseId}`);
            if (accessRes.ok) {
              const accessData = await accessRes.json();
              setHasAccess(accessData.hasAccess);
            }
            
            // Fetch progress for all videos
            await Promise.all(data.videos.map(async (video: Video) => {
              const progressRes = await fetch(`/api/user/videos/progress?videoId=${video._id}&courseId=${params.courseId}`);
              if (progressRes.ok) {
                const progressData = await progressRes.json();
                setVideoProgress(prev => ({
                  ...prev,
                  [video._id]: progressData
                }));
              }
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };

    if (status !== 'loading') {
      fetchCourse();
    }
  }, [params.courseId, session, status]);

  const handlePurchase = async () => {
    if (!session) {
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent(`/courses/${params.courseId}`));
      return;
    }
    
    // Redirect to checkout or handle purchase logic
    router.push(`/checkout?courseId=${params.courseId}`);
  };

  if (loading) {
    return (
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <div className="h-12 w-1/2 mb-4 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-64 w-full mb-6 bg-gray-200 animate-pulse rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="h-8 w-1/3 mb-4 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-24 w-full mb-6 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-8 w-1/4 mb-4 bg-gray-200 animate-pulse rounded"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 w-full bg-gray-200 animate-pulse rounded"></div>
              ))}
            </div>
          </div>
          <div>
            <div className="h-64 w-full bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">Course not found</h1>
        <p>The course you are looking for does not exist or has been removed.</p>
        <button 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => router.push('/courses')}
        >
          Back to Courses
        </button>
      </div>
    );
  }

  // Calculate overall progress
  let completedVideos = 0;
  course.videos.forEach(video => {
    if (videoProgress[video._id]?.completed) {
      completedVideos++;
    }
  });
  const overallProgress = course.videos.length > 0 
    ? Math.round((completedVideos / course.videos.length) * 100) 
    : 0;

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">{course.title}</h1>
      
      <div className="relative aspect-video rounded-xl overflow-hidden mb-8">
        <Image 
          src={course.thumbnail || '/placeholder-course.jpg'} 
          alt={course.title}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">About this course</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">{course.description}</p>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Your progress</h3>
              <span className="text-sm font-medium">{overallProgress}% complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${overallProgress}%` }}
              ></div>
            </div>
          </div>
          
          <div className="my-6 border-t border-gray-200 pt-6"></div>
          
          <h2 className="text-2xl font-semibold mb-4">Course content</h2>
          <div className="space-y-4">
            {course.videos.map((video) => {
              const progress = videoProgress[video._id];
              const progressPercent = progress && progress.duration > 0 
                ? Math.min(Math.round((progress.currentTime / progress.duration) * 100), 100)
                : 0;
              
              return (
                <div key={video._id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="relative w-full md:w-40 h-32">
                      <Image 
                        src={video.thumbnail || '/placeholder-video.jpg'} 
                        alt={video.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium mb-1">{video.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{video.description}</p>
                          
                          <div className="flex items-center mt-2 space-x-4">
                            <span className="text-xs text-gray-500">{Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}</span>
                            
                            {progress && (
                              <div className="flex items-center">
                                <div className="w-16 h-1 bg-gray-200 rounded-full mr-2">
                                  <div 
                                    className="bg-blue-600 h-1 rounded-full" 
                                    style={{ width: `${progressPercent}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs">{progressPercent}%</span>
                              </div>
                            )}
                            
                            {progress?.completed && (
                              <span className="flex items-center text-xs text-green-500">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Completed
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="ml-4">
                          {!hasAccess && !video.isFree ? (
                            <span className="flex items-center text-sm text-amber-500">
                              <LockIcon className="w-4 h-4 mr-1" />
                              Premium
                            </span>
                          ) : (
                            <button 
                              className="inline-flex items-center px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                              onClick={() => router.push(`/courses/${params.courseId}/videos/${video._id}`)}
                            >
                              <PlayIcon className="w-4 h-4 mr-1" />
                              {progress?.currentTime > 0 && !progress?.completed ? 'Continue' : 'Watch'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div>
          <div className="sticky top-24 bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4">Course Details</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Instructor</h4>
                <p className="text-gray-600 dark:text-gray-400">{course.instructor}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1">Created</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {new Date(course.createdAt).toLocaleDateString()}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1">Videos</h4>
                <p className="text-gray-600 dark:text-gray-400">{course.videos.length}</p>
              </div>
              
              {hasAccess ? (
                <div className="bg-green-50 p-3 rounded-md">
                  <p className="text-green-600 font-medium flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    You have access to this course
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-bold mb-2">${course.price.toFixed(2)}</p>
                  <button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
                    onClick={handlePurchase}
                  >
                    Get Access
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 