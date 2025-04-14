'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Lock, Play } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { formatDistanceToNow } from 'date-fns';

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
        <Skeleton className="h-12 w-1/2 mb-4" />
        <Skeleton className="h-64 w-full mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Skeleton className="h-8 w-1/3 mb-4" />
            <Skeleton className="h-24 w-full mb-6" />
            <Skeleton className="h-8 w-1/4 mb-4" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          </div>
          <div>
            <Skeleton className="h-64 w-full" />
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
        <Button className="mt-4" asChild>
          <Link href="/courses">Back to Courses</Link>
        </Button>
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
            <Progress value={overallProgress} className="h-2" />
          </div>
          
          <Separator className="my-6" />
          
          <h2 className="text-2xl font-semibold mb-4">Course content</h2>
          <div className="space-y-4">
            {course.videos.map((video) => {
              const progress = videoProgress[video._id];
              const progressPercent = progress && progress.duration > 0 
                ? Math.min(Math.round((progress.currentTime / progress.duration) * 100), 100)
                : 0;
              
              return (
                <Card key={video._id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="relative w-full md:w-40 h-32">
                      <Image 
                        src={video.thumbnail || '/placeholder-video.jpg'} 
                        alt={video.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="flex-1 p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg mb-1">{video.title}</CardTitle>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{video.description}</p>
                        </div>
                        {progress?.completed ? (
                          <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-1 rounded-full">
                            <Check size={18} />
                          </div>
                        ) : null}
                      </div>
                      
                      <div className="mt-3">
                        {progress ? (
                          <div className="space-y-1">
                            <Progress value={progressPercent} className="h-1" />
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>{Math.floor(progress.currentTime / 60)}:{Math.floor(progress.currentTime % 60).toString().padStart(2, '0')}</span>
                              <span>{Math.floor(progress.duration / 60)}:{Math.floor(progress.duration % 60).toString().padStart(2, '0')}</span>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 flex items-center justify-center">
                      {hasAccess || video.isFree ? (
                        <Button asChild variant="outline" size="sm" className="w-full md:w-auto">
                          <Link href={`/courses/${params.courseId}/videos/${video._id}`}>
                            <Play size={16} className="mr-2" /> Watch
                          </Link>
                        </Button>
                      ) : (
                        <Button disabled variant="outline" size="sm" className="w-full md:w-auto">
                          <Lock size={16} className="mr-2" /> Locked
                        </Button>
                      )}
                    </CardFooter>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
        
        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Instructor</p>
                <p className="font-medium">{course.instructor}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Created</p>
                <p className="font-medium">
                  {formatDistanceToNow(new Date(course.createdAt), { addSuffix: true })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Videos</p>
                <p className="font-medium">{course.videos.length} lessons</p>
              </div>
              
              {!hasAccess && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Price</p>
                    <p className="text-2xl font-bold">${course.price.toFixed(2)}</p>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={handlePurchase}
                  >
                    Get Access
                  </Button>
                  <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                    Secure payment via Stripe
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 