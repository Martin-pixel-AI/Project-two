'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Pause, Volume2, VolumeX, Maximize, ArrowLeft, Clock } from 'lucide-react';

// Define YouTube API types
declare global {
  interface Window {
    YT: YT;
    onYouTubeIframeAPIReady: () => void;
  }
}

// YouTube namespace declaration
declare namespace YT {
  class Player {
    constructor(
      elementId: string,
      config: {
        videoId: string;
        playerVars?: {
          autoplay?: number;
          controls?: number;
          disablekb?: number;
          fs?: number;
          rel?: number;
          modestbranding?: number;
          start?: number;
        };
        events?: {
          onReady?: (event: { target: Player }) => void;
          onStateChange?: (event: { data: number; target: Player }) => void;
          onError?: (event: { data: number }) => void;
        };
      }
    );
    
    playVideo(): void;
    pauseVideo(): void;
    mute(): void;
    unMute(): void;
    setVolume(volume: number): void;
    getCurrentTime(): number;
    getDuration(): number;
    seekTo(seconds: number, allowSeekAhead?: boolean): void;
    destroy(): void;
  }
  
  const PlayerState: {
    PLAYING: number;
    PAUSED: number;
    ENDED: number;
  };
}

interface Video {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  duration: number;
  isFree: boolean;
  youtubeId?: string;
}

interface Course {
  _id: string;
  title: string;
}

interface VideoProgress {
  videoId: string;
  courseId: string;
  currentTime: number;
  duration: number;
  completed: boolean;
}

export default function VideoPlayer({ params }: { params: { courseId: string; videoId: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [video, setVideo] = useState<Video | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState<VideoProgress | null>(null);
  const [completed, setCompleted] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const youtubePlayerRef = useRef<YT.Player | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load YouTube API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }
  }, []);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        // Check authentication first
        if (status === 'loading') return;
        
        // Fetch video data
        const videoRes = await fetch(`/api/videos/${params.videoId}`);
        if (!videoRes.ok) {
          throw new Error('Failed to fetch video');
        }
        
        const videoData = await videoRes.json();
        setVideo(videoData);
        
        // Fetch course data
        const courseRes = await fetch(`/api/courses/${params.courseId}`);
        if (!courseRes.ok) {
          throw new Error('Failed to fetch course');
        }
        
        const courseData = await courseRes.json();
        setCourse(courseData);
        
        // Check if user has access
        if (session?.user) {
          // Check if video is free or user has access to the course
          if (videoData.isFree) {
            setHasAccess(true);
          } else {
            const accessRes = await fetch(`/api/user/courses/check-access?courseId=${params.courseId}`);
            if (accessRes.ok) {
              const accessData = await accessRes.json();
              setHasAccess(accessData.hasAccess);
            }
          }
          
          // Fetch video progress
          const progressRes = await fetch(`/api/user/videos/progress?videoId=${params.videoId}&courseId=${params.courseId}`);
          if (progressRes.ok) {
            const progressData = await progressRes.json();
            setProgress(progressData);
            
            // Set initial currentTime from saved progress
            if (progressData && progressData.currentTime > 0) {
              setCurrentTime(progressData.currentTime);
            }
          }
        } else {
          // Not logged in, check if the video is free
          setHasAccess(videoData.isFree);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load video data');
      } finally {
        setLoading(false);
      }
    };

    fetchVideoData();
  }, [params.videoId, params.courseId, session, status]);

  // Initialize YouTube player when video data is loaded
  useEffect(() => {
    if (!video?.youtubeId || !window.YT || !window.YT.Player) return;
    
    const initYouTubePlayer = () => {
      youtubePlayerRef.current = new YT.Player('youtube-player', {
        videoId: video.youtubeId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          rel: 0,
          modestbranding: 1,
          start: Math.floor(currentTime)
        },
        events: {
          onReady: (event) => {
            event.target.setVolume(volume * 100);
            if (muted) event.target.mute();
            setDuration(event.target.getDuration());
            fetchVideoProgress();
          },
          onStateChange: (event) => {
            setPlaying(event.data === YT.PlayerState.PLAYING);
            
            if (event.data === YT.PlayerState.PLAYING) {
              startProgressTracking();
            } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
              stopProgressTracking();
            }
            
            if (event.data === YT.PlayerState.ENDED) {
              saveProgressToAPI(true);
            }
          },
          onError: () => {
            setError('Error loading YouTube video');
          }
        }
      });
    };

    if (window.YT.Player) {
      initYouTubePlayer();
    } else {
      window.onYouTubeIframeAPIReady = initYouTubePlayer;
    }

    return () => {
      if (youtubePlayerRef.current) {
        youtubePlayerRef.current.destroy();
      }
    };
  }, [video?.youtubeId, currentTime, volume, muted]);

  // Set up event listeners for direct video playback
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || video?.youtubeId) return;

    const handleTimeUpdate = () => {
      setCurrentTime(videoElement.currentTime);
    };

    const handleDurationChange = () => {
      setDuration(videoElement.duration);
    };

    const handlePlay = () => {
      setPlaying(true);
      startProgressTracking();
    };

    const handlePause = () => {
      setPlaying(false);
      stopProgressTracking();
    };

    const handleEnded = () => {
      setPlaying(false);
      stopProgressTracking();
      saveProgressToAPI(true);
    };

    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('durationchange', handleDurationChange);
    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);
    videoElement.addEventListener('ended', handleEnded);

    // Set initial time from saved progress
    if (progress && progress.currentTime > 0) {
      videoElement.currentTime = progress.currentTime;
    }

    return () => {
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement.removeEventListener('durationchange', handleDurationChange);
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
      videoElement.removeEventListener('ended', handleEnded);
    };
  }, [video, progress]);

  const startProgressTracking = () => {
    // Clear any existing interval
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    // Track progress every second
    progressIntervalRef.current = setInterval(() => {
      if (video?.youtubeId && youtubePlayerRef.current) {
        const currentTime = youtubePlayerRef.current.getCurrentTime();
        setCurrentTime(currentTime);
      }
      
      // Save progress periodically (every 10 seconds)
      if (currentTime % 10 < 1) {
        saveProgressToAPI();
      }
    }, 1000);
  };

  const stopProgressTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const saveProgressToAPI = async (completed = false) => {
    if (!session?.user || !video) return;
    
    // Clear any pending save
    if (progressSaveTimeoutRef.current) {
      clearTimeout(progressSaveTimeoutRef.current);
    }
    
    // Debounce the save operation
    progressSaveTimeoutRef.current = setTimeout(async () => {
      try {
        // Check if video is at least 95% complete or explicitly marked as completed
        const isCompleted = completed || (duration > 0 && currentTime / duration >= 0.95);
        
        // Save progress to API
        await fetch('/api/user/videos/progress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            videoId: video._id,
            courseId: params.courseId,
            currentTime,
            duration,
            completed: isCompleted
          })
        });
        
        // Update local progress state
        setProgress({
          videoId: video._id,
          courseId: params.courseId,
          currentTime,
          duration,
          completed: isCompleted
        } as VideoProgress);
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    }, 500);
  };

  const handlePlayPause = () => {
    if (video?.youtubeId && youtubePlayerRef.current) {
      if (playing) {
        youtubePlayerRef.current.pauseVideo();
      } else {
        youtubePlayerRef.current.playVideo();
      }
    } else if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    
    if (video?.youtubeId && youtubePlayerRef.current) {
      youtubePlayerRef.current.setVolume(newVolume * 100);
      if (newVolume === 0) {
        youtubePlayerRef.current.mute();
        setMuted(true);
      } else if (muted) {
        youtubePlayerRef.current.unMute();
        setMuted(false);
      }
    } else if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
      setMuted(newVolume === 0);
    }
  };

  const handleMuteToggle = () => {
    const newMuted = !muted;
    setMuted(newMuted);
    
    if (video?.youtubeId && youtubePlayerRef.current) {
      if (newMuted) {
        youtubePlayerRef.current.mute();
      } else {
        youtubePlayerRef.current.unMute();
      }
    } else if (videoRef.current) {
      videoRef.current.muted = newMuted;
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    
    if (video?.youtubeId && youtubePlayerRef.current) {
      youtubePlayerRef.current.seekTo(seekTime, true);
    } else if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
    }
  };

  const handleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Function to fetch video progress
  const fetchVideoProgress = async () => {
    try {
      // Explicitly cast to string to fix TypeScript error
      const videoId = params.videoId as string;
      const courseId = params.courseId as string;
      
      if (!videoId || !courseId) {
        console.error('Missing videoId or courseId parameters');
        return;
      }
      
      const response = await fetch(`/api/user/videos/progress?videoId=${videoId}&courseId=${courseId}`);
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error fetching video progress:', errorData);
        return;
      }
      
      const progressData = await response.json();
      
      // Only set initial position if we have progress and the video hasn't been watched completely
      if (progressData.currentTime > 0 && !progressData.completed) {
        setCurrentTime(progressData.currentTime);
        if (youtubePlayerRef.current && youtubePlayerRef.current.seekTo) {
          youtubePlayerRef.current.seekTo(progressData.currentTime, true);
        }
      }
      
      setCompleted(progressData.completed || false);
    } catch (error) {
      console.error('Failed to fetch video progress:', error);
    }
  };
  
  // Function to save video progress
  const saveVideoProgress = async (time: number, videoDuration: number, isCompleted: boolean = false) => {
    try {
      const response = await fetch('/api/user/videos/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoId: params.videoId,
          courseId: params.courseId,
          currentTime: time,
          duration: videoDuration,
          completed: isCompleted
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error saving video progress:', errorData);
      }
    } catch (error) {
      console.error('Failed to save video progress:', error);
    }
  };
  
  // Function to handle progress updates with debounce
  const handleProgressUpdate = (time: number) => {
    setCurrentTime(time);
    
    // Clear any existing timeout
    if (progressUpdateTimeoutRef.current) {
      clearTimeout(progressUpdateTimeoutRef.current);
    }
    
    // Set a new timeout to save progress after 2 seconds of no updates
    progressUpdateTimeoutRef.current = setTimeout(() => {
      // Only save progress if we have duration and are not at the end
      if (duration > 0 && time < duration - 1) {
        saveVideoProgress(time, duration);
      }
    }, 2000);
  };

  if (loading) {
    return (
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <div className="h-8 w-1/3 mb-4 bg-gray-200 animate-pulse rounded"></div>
        <div className="aspect-video mb-4 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-8 w-1/4 mb-2 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-24 w-full mb-6 bg-gray-200 animate-pulse rounded"></div>
      </div>
    );
  }

  if (error || !video || !course) {
    return (
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p>{error || 'Video not found'}</p>
        <button 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
          onClick={() => router.push(`/courses/${params.courseId}`)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Course
        </button>
      </div>
    );
  }

  if (!hasAccess && !video.isFree) {
    return (
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">{video.title}</h1>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-amber-800 mb-2">Premium Content</h2>
          <p className="text-amber-700 mb-4">
            This video is part of the premium content for this course. Purchase the course to get access to all videos.
          </p>
          <button 
            className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
            onClick={() => router.push(`/courses/${params.courseId}`)}
          >
            View Course Details
          </button>
        </div>
        
        <h2 className="text-xl font-semibold mb-3">Video Description</h2>
        <p className="text-gray-700 dark:text-gray-300">{video.description}</p>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="flex items-center mb-4 space-x-2">
        <button 
          className="p-1 hover:bg-gray-200 rounded-full"
          onClick={() => router.push(`/courses/${params.courseId}`)}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold">{video.title}</h1>
      </div>
      
      <div 
        ref={containerRef}
        className="relative aspect-video bg-black rounded-lg overflow-hidden mb-6"
      >
        {video.youtubeId ? (
          <div id="youtube-player" className="w-full h-full"></div>
        ) : (
          <video
            ref={videoRef}
            src={video.videoUrl}
            poster={video.thumbnail}
            className="w-full h-full"
            playsInline
          />
        )}
        
        {/* Video Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
          <div className="flex items-center mb-2">
            <button 
              onClick={handlePlayPause}
              className="mr-4 p-1 hover:bg-white hover:bg-opacity-20 rounded-full"
            >
              {playing ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" />
              )}
            </button>
            
            <input 
              type="range" 
              min="0" 
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="flex-grow h-2 bg-gray-600 rounded-full appearance-none"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(currentTime / (duration || 1)) * 100}%, #4b5563 ${(currentTime / (duration || 1)) * 100}%, #4b5563 100%)`
              }}
            />
            
            <span className="ml-4 text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button 
                onClick={handleMuteToggle}
                className="mr-2 p-1 hover:bg-white hover:bg-opacity-20 rounded-full"
              >
                {muted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
              
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-24 h-2 bg-gray-600 rounded-full appearance-none"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume * 100}%, #4b5563 ${volume * 100}%, #4b5563 100%)`
                }}
              />
            </div>
            
            <button 
              onClick={handleFullscreen}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full"
            >
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Course: {course.title}</h2>
        <div className="flex items-center text-sm text-gray-600">
          <span>{formatTime(duration)} • </span>
          {progress?.completed ? (
            <span className="ml-2 text-green-600">Completed</span>
          ) : (
            progress && (
              <span className="ml-2">
                Progress: {Math.round((currentTime / duration) * 100)}%
              </span>
            )
          )}
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-3">Description</h2>
        <p className="text-gray-700 dark:text-gray-300">{video.description}</p>
      </div>
    </div>
  );
} 