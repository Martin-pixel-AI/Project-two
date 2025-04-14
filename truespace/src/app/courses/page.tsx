'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

// Component to show progress indicators on course videos
function VideoProgressIndicator({ videoId, courseId }: { videoId: string, courseId: string }) {
  const [progress, setProgress] = useState<{ currentTime: number, duration: number, completed: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchProgress = async () => {
      if (!session?.user) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/user/videos/progress?videoId=${videoId}&courseId=${courseId}`);
        if (response.ok) {
          const data = await response.json();
          setProgress(data);
        }
      } catch (error) {
        console.error('Error fetching video progress:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [videoId, courseId, session]);

  if (loading || !progress || !session?.user) return null;

  if (progress.completed) {
    return (
      <div className="absolute top-0 right-0 m-2 bg-green-500 text-white text-xs px-2 py-1 rounded-md">
        Completed
      </div>
    );
  } else if (progress.currentTime > 0) {
    const percentComplete = Math.round((progress.currentTime / progress.duration) * 100);
    return (
      <>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
          <div 
            className="h-full bg-blue-500" 
            style={{ width: `${percentComplete}%` }}
          />
        </div>
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-md">
          {percentComplete}%
        </div>
      </>
    );
  }

  return null;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  imageUrl?: string;
  instructor?: {
    name: string;
    _id: string;
  };
  level: string;
  videos?: Array<{
    _id: string;
    title: string;
  }>;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch('/api/courses/search');
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchCourses();
  }, []);
  
  if (loading) {
    return <div>Loading courses...</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Courses</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Link href={`/courses/${course._id}`} key={course._id}>
            <div className="border rounded-lg overflow-hidden hover:shadow-md transition">
              <div className="relative aspect-video">
                <Image
                  src={course.imageUrl || '/placeholder-course.jpg'}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
                {/* Add for first video in course */}
                {course.videos && course.videos.length > 0 && (
                  <VideoProgressIndicator 
                    videoId={course.videos[0]._id} 
                    courseId={course._id} 
                  />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg truncate">{course.title}</h3>
                <p className="text-gray-600 text-sm">
                  {course.instructor?.name || 'Unknown Instructor'}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-blue-600 font-medium">
                    {course.videos?.length || 0} videos
                  </span>
                  <span className="text-gray-700">{course.level}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 