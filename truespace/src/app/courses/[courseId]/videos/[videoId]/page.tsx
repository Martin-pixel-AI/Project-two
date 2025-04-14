'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FaArrowLeft, FaPlay, FaPause, FaExpand, FaCompress, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

interface Video {
  _id: string;
  title: string;
  description?: string;
  videoUrl: string;
}

interface Course {
  _id: string;
  title: string;
  videos: Video[];
}

export default function VideoPlayer({ params }: { params: { courseId: string; videoId: string } }) {
  const { courseId, videoId } = params;
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [video, setVideo] = useState<Video | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [completed, setCompleted] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  
  // Progress tracking
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const lastSavedTime = useRef<number>(0);
  
  // Check access and fetch video data
  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        // Check if user has access
        const accessResponse = await fetch(`/api/user/courses/access?courseId=${courseId}`);
        if (!accessResponse.ok) {
          const { hasAccess, message } = await accessResponse.json();
          if (!hasAccess) {
            setError(message || 'You do not have access to this course');
            setLoading(false);
            return;
          }
        }
        
        // Fetch video details
        const videoResponse = await fetch(`/api/courses/${courseId}/videos/${videoId}`);
        if (!videoResponse.ok) {
          throw new Error('Failed to fetch video details');
        }
        
        const videoData = await videoResponse.json();
        setVideo(videoData);
        
        // Fetch course details to get the list of videos
        const courseResponse = await fetch(`/api/courses/${courseId}`);
        if (!courseResponse.ok) {
          throw new Error('Failed to fetch course details');
        }
        
        const courseData = await courseResponse.json();
        setCourse(courseData);
        
        // Track video view
        await fetch('/api/user/videos/view', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ videoId, courseId }),
        });
        
        // Fetch video progress
        const progressResponse = await fetch(`/api/user/videos/progress?videoId=${videoId}&courseId=${courseId}`);
        if (progressResponse.ok) {
          const progressData = await progressResponse.json();
          
          // Set video current time if available
          if (progressData.currentTime && videoRef.current) {
            videoRef.current.currentTime = progressData.currentTime;
            lastSavedTime.current = progressData.currentTime;
          }
          
          setCompleted(progressData.completed || false);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load video');
      } finally {
        setLoading(false);
      }
    };

    if (status !== 'loading') {
      fetchVideoData();
    }
    
    // Cleanup
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [courseId, videoId, status]);

  // Video player controls
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleTimeUpdate = () => {
      setCurrentTime(videoElement.currentTime);
    };

    const handleDurationChange = () => {
      setDuration(videoElement.duration);
    };

    const handleEnded = () => {
      setPlaying(false);
      saveProgress(videoElement.duration, videoElement.duration, true);
      setCompleted(true);
    };

    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('durationchange', handleDurationChange);
    videoElement.addEventListener('ended', handleEnded);

    return () => {
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement.removeEventListener('durationchange', handleDurationChange);
      videoElement.removeEventListener('ended', handleEnded);
    };
  }, [videoRef.current]);
  
  // Setup progress tracking
  useEffect(() => {
    // Only track progress if video is loaded and user is authenticated
    if (videoRef.current && video && session?.user) {
      // Save progress every 5 seconds if it's changed by more than 3 seconds
      progressInterval.current = setInterval(() => {
        if (videoRef.current && Math.abs(videoRef.current.currentTime - lastSavedTime.current) > 3) {
          saveProgress(videoRef.current.currentTime, videoRef.current.duration);
          lastSavedTime.current = videoRef.current.currentTime;
        }
      }, 5000);
      
      return () => {
        clearInterval(progressInterval.current as NodeJS.Timeout);
        
        // Save progress on unmount
        if (videoRef.current) {
          saveProgress(videoRef.current.currentTime, videoRef.current.duration);
        }
      };
    }
  }, [video, session]);
  
  const saveProgress = async (currentTime: number, duration: number, completed = false) => {
    if (!session?.user) return;
    
    try {
      await fetch('/api/user/videos/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoId,
          courseId,
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

  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    
    setPlaying(!playing);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    
    const newTime = parseFloat(e.target.value);
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    
    const newVolume = parseFloat(e.target.value);
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    
    const newMutedState = !isMuted;
    videoRef.current.muted = newMutedState;
    setIsMuted(newMutedState);
  };

  const toggleFullscreen = () => {
    if (!videoContainerRef.current) return;
    
    if (!isFullscreen) {
      if (videoContainerRef.current.requestFullscreen) {
        videoContainerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    
    setIsFullscreen(!isFullscreen);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error || 'Video not found'}</span>
        </div>
        <div className="mt-4">
          <Link href={`/courses/${courseId}`} className="text-primary hover:underline flex items-center">
            <FaArrowLeft className="mr-2" /> Back to Course
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link href={`/courses/${courseId}`} className="text-primary hover:underline flex items-center">
          <FaArrowLeft className="mr-2" /> Back to Course
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-4">{video.title}</h1>
      
      {/* Progress indicator */}
      {completed && (
        <div className="mb-2 text-green-600 font-medium flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Completed</span>
        </div>
      )}
      
      {/* Video Player */}
      <div className="bg-black rounded-lg overflow-hidden mb-8" ref={videoContainerRef}>
        <div className="relative">
          <video
            ref={videoRef}
            src={video.videoUrl}
            className="w-full aspect-video"
            onClick={togglePlay}
          />
          
          {/* Video Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            {/* Progress Bar */}
            <div className="flex items-center mb-2">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-gray-400 rounded-full appearance-none cursor-pointer"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button onClick={togglePlay} className="text-white">
                  {playing ? <FaPause /> : <FaPlay />}
                </button>
                
                <div className="flex items-center space-x-2">
                  <button onClick={toggleMute} className="text-white">
                    {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-16 h-1 bg-gray-400 rounded-full appearance-none cursor-pointer"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
                <button onClick={toggleFullscreen} className="text-white">
                  {isFullscreen ? <FaCompress /> : <FaExpand />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Video Description */}
      {video.description && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-700">{video.description}</p>
        </div>
      )}
      
      {/* Other Videos in Course */}
      {course && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">More from this course</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {course.videos.map((v) => (
                <li 
                  key={v._id} 
                  className={`p-4 hover:bg-gray-50 ${v._id === videoId ? 'bg-gray-50' : ''}`}
                >
                  <Link href={`/courses/${courseId}/videos/${v._id}`} className="flex items-center justify-between">
                    <div className="flex items-center">
                      {v._id === videoId ? (
                        <span className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full mr-4">
                          <FaPlay size={10} />
                        </span>
                      ) : (
                        <span className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full mr-4">
                          <FaPlay size={10} />
                        </span>
                      )}
                      <span className={v._id === videoId ? 'font-medium' : ''}>{v.title}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
} 