'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Clock } from 'lucide-react';

interface VideoProgress {
  _id: string;
  videoId: string;
  courseId: string;
  videoTitle: string;
  courseName: string;
  thumbnail: string;
  currentTime: number;
  duration: number;
  completed: boolean;
  lastUpdated: Date;
}

export default function ContinueWatching() {
  const { data: session, status } = useSession();
  const [inProgressVideos, setInProgressVideos] = useState<VideoProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInProgressVideos = async () => {
      if (status === 'loading') return;
      if (!session?.user) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/user/videos/in-progress');
        if (!response.ok) {
          throw new Error('Failed to fetch in-progress videos');
        }

        const data = await response.json();
        setInProgressVideos(data);
      } catch (error) {
        console.error('Error fetching in-progress videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInProgressVideos();
  }, [session, status]);

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Continue Watching</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden animate-pulse">
              <div className="aspect-video bg-gray-200 dark:bg-gray-700"></div>
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (inProgressVideos.length === 0) {
    return null; // Don't show the section if there are no videos in progress
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Continue Watching</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {inProgressVideos.map((video) => (
          <Link 
            key={video._id}
            href={`/courses/${video.courseId}/videos/${video.videoId}`}
            className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="relative aspect-video">
              <Image
                src={video.thumbnail || '/placeholder-thumbnail.jpg'}
                alt={video.videoTitle}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                  <Play className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-300 dark:bg-gray-600">
                <div 
                  className="h-full bg-blue-600" 
                  style={{ width: `${(video.currentTime / video.duration) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="p-3">
              <h3 className="font-medium truncate">{video.videoTitle}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{video.courseName}</p>
              <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                <Clock className="w-3 h-3 mr-1" />
                <span>{formatTime(video.currentTime)} / {formatTime(video.duration)}</span>
                <span className="ml-auto">{Math.round((video.currentTime / video.duration) * 100)}%</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 