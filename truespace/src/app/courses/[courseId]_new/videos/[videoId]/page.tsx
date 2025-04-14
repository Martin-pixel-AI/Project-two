'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface Video {
  _id: string;
  title: string;
  description: string;
  duration: number;
  videoUrl: string;
  isFree: boolean;
}

interface Course {
  _id: string;
  title: string;
  videos: Video[];
}

export default function VideoPlayer({ params }: { params: { id: string; videoId: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [video, setVideo] = useState<Video | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [nextVideo, setNextVideo] = useState<Video | null>(null);
  
  // Progress tracking
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const lastSavedTime = useRef<number>(0);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check authentication first
        if (status === 'loading') return;
        if (status === 'unauthenticated') {
          router.push(`/auth/signin?callbackUrl=${encodeURIComponent(`/courses/${params.id}/videos/${params.videoId}`)}`);
          return;
        }
        
        // Fetch video details
        const videoRes = await fetch(`/api/videos/${params.videoId}`);
        if (!videoRes.ok) {
          throw new Error('Video not found');
        }
        const videoData = await videoRes.json();
        setVideo(videoData);
        
        // Fetch course details to get next video
        const courseRes = await fetch(`/api/courses/${params.id}`);
        if (courseRes.ok) {
          const courseData = await courseRes.json();
          setCourse(courseData);
          
          // Find the next video
          const currentIndex = courseData.videos.findIndex((v: Video) => v._id === params.videoId);
          if (currentIndex !== -1 && currentIndex < courseData.videos.length - 1) {
            setNextVideo(courseData.videos[currentIndex + 1]);
          }
        }
        
        // Check if user has access
        const accessRes = await fetch(`/api/user/courses/check-access?courseId=${params.id}`);
        if (accessRes.ok) {
          const accessData = await accessRes.json();
          setHasAccess(accessData.hasAccess || videoData.isFree);
          
          // If user has access, get the video progress
          if (accessData.hasAccess || videoData.isFree) {
            const progressRes = await fetch(`/api/user/videos/progress?videoId=${params.videoId}&courseId=${params.id}`);
            if (progressRes.ok) {
              const progressData = await progressRes.json();
              
              // Set video current time if available
              if (progressData.currentTime && videoRef.current) {
                videoRef.current.currentTime = progressData.currentTime;
                lastSavedTime.current = progressData.currentTime;
              }
              
              setCompleted(progressData.completed || false);
            }
          }
        } else {
          // If not accessible and not free, redirect
          if (!videoData.isFree) {
            router.push(`/courses/${params.id}`);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Cleanup
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [params.id, params.videoId, router, status]);
  
  useEffect(() => {
    // Setup progress tracking
    if (videoRef.current && video && hasAccess) {
      // Save progress every 5 seconds if it's changed by more than 3 seconds
      progressInterval.current = setInterval(async () => {
        if (videoRef.current && Math.abs(videoRef.current.currentTime - lastSavedTime.current) > 3) {
          await saveProgress(videoRef.current.currentTime, videoRef.current.duration);
          lastSavedTime.current = videoRef.current.currentTime;
        }
      }, 5000);
      
      // Event listener for video ended
      const handleEnded = async () => {
        if (videoRef.current) {
          await saveProgress(videoRef.current.duration, videoRef.current.duration, true);
          setCompleted(true);
        }
      };
      
      videoRef.current.addEventListener('ended', handleEnded);
      
      return () => {
        clearInterval(progressInterval.current as NodeJS.Timeout);
        videoRef.current?.removeEventListener('ended', handleEnded);
        
        // Save progress on unmount
        if (videoRef.current) {
          saveProgress(videoRef.current.currentTime, videoRef.current.duration);
        }
      };
    }
  }, [video, hasAccess]);
  
  const saveProgress = async (currentTime: number, duration: number, completed = false) => {
    try {
      await fetch('/api/user/videos/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoId: params.videoId,
          courseId: params.id,
          currentTime,
          duration,
          completed: completed || (duration > 0 && currentTime / duration > 0.95)
        }),
      });
      
      // Update completed state if needed
      if (completed || (duration > 0 && currentTime / duration > 0.95)) {
        setCompleted(true);
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };
  
  const handleNextVideo = () => {
    if (nextVideo) {
      router.push(`/courses/${params.id}/videos/${nextVideo._id}`);
    } else {
      router.push(`/courses/${params.id}`);
    }
  };
  
  if (loading) {
    return (
      <div className="container max-w-5xl mx-auto py-8 px-4">
        <div className="mb-6">
          <Button variant="ghost" size="sm" className="mb-6" disabled>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to course
          </Button>
          <Skeleton className="h-10 w-2/3 mb-4" />
        </div>
        <Skeleton className="aspect-video w-full mb-8" />
        <Skeleton className="h-8 w-1/3 mb-4" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }
  
  if (!video) {
    return (
      <div className="container max-w-5xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">Video not found</h1>
        <p>The video you are looking for does not exist or has been removed.</p>
        <Button className="mt-4" asChild>
          <Link href={`/courses/${params.id}`}>Back to Course</Link>
        </Button>
      </div>
    );
  }
  
  if (!hasAccess && !video.isFree) {
    return (
      <div className="container max-w-5xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">Access Restricted</h1>
        <p>You need to purchase this course to access this video.</p>
        <Button className="mt-4" asChild>
          <Link href={`/courses/${params.id}`}>Go to Course</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Button variant="ghost" size="sm" className="mb-6" asChild>
          <Link href={`/courses/${params.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to course
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">{video.title}</h1>
      </div>
      
      <div className="aspect-video bg-black mb-8 relative rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          src={video.videoUrl}
          className="w-full h-full"
          controls
          playsInline
        />
        
        {completed && (
          <div className="absolute top-4 right-4 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full px-3 py-1 text-sm font-medium flex items-center">
            <CheckCircle className="mr-1 h-4 w-4" /> Completed
          </div>
        )}
      </div>
      
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">About this video</h2>
        <p className="text-gray-700 dark:text-gray-300">{video.description}</p>
      </Card>
      
      <div className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href={`/courses/${params.id}`}>
            Back to Course
          </Link>
        </Button>
        
        {nextVideo ? (
          <Button onClick={handleNextVideo}>
            Next Lesson
          </Button>
        ) : (
          <Button onClick={handleNextVideo} disabled={!completed}>
            {completed ? 'Finish Course' : 'Complete this video to finish'}
          </Button>
        )}
      </div>
    </div>
  );
} 