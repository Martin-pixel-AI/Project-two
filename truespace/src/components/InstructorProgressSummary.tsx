'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface VideoStat {
  videoId: string;
  title: string;
  viewCount: number;
  completionRate: number;
  avgWatchTimeSeconds: number;
  avgWatchPercentage: number;
}

interface StudentStat {
  userId: string;
  name: string;
  email: string;
  videosStarted: number;
  videosCompleted: number;
  completionRate: number;
  courseCompleted: boolean;
  lastActivity: number | null;
}

interface ProgressSummary {
  courseId: string;
  courseTitle: string;
  summary: {
    totalStudents: number;
    totalVideos: number;
    courseCompletionRate: number;
    studentsWithAnyProgress: number;
    avgVideoCompletionRate: number;
  };
  videoStats: VideoStat[];
  studentStats: StudentStat[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function InstructorProgressSummary({ courseId }: { courseId: string }) {
  const { data: session } = useSession();
  const [summary, setSummary] = useState<ProgressSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgressSummary = async () => {
      if (!session?.user) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/instructor/progress-summary?courseId=${courseId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch progress summary');
        }

        const data = await response.json();
        setSummary(data);
      } catch (error) {
        console.error('Error fetching progress summary:', error);
        setError('Could not load progress data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProgressSummary();
  }, [courseId, session]);

  if (loading) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <p>No progress data available for this course.</p>
      </div>
    );
  }

  // Format data for charts
  const completionPieData = [
    { name: 'Completed', value: summary.summary.courseCompletionRate * 100 },
    { name: 'Incomplete', value: 100 - (summary.summary.courseCompletionRate * 100) }
  ];

  const videoCompletionData = summary.videoStats.map(stat => ({
    name: stat.title.length > 20 ? `${stat.title.substring(0, 20)}...` : stat.title,
    viewRate: Math.round((stat.viewCount / summary.summary.totalStudents) * 100),
    completionRate: Math.round(stat.completionRate * 100),
    avgWatchPercent: Math.round(stat.avgWatchPercentage * 100)
  }));

  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return 'Never';
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="space-y-8">
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Course Summary: {summary.courseTitle}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="text-sm text-gray-600 dark:text-gray-400">Total Students</h3>
            <p className="text-2xl font-bold">{summary.summary.totalStudents}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h3 className="text-sm text-gray-600 dark:text-gray-400">Students With Progress</h3>
            <p className="text-2xl font-bold">{summary.summary.studentsWithAnyProgress}</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <h3 className="text-sm text-gray-600 dark:text-gray-400">Average Completion Rate</h3>
            <p className="text-2xl font-bold">{Math.round(summary.summary.avgVideoCompletionRate * 100)}%</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Course Completion</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={completionPieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {completionPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${Math.round(Number(value))}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Video Engagement</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={videoCompletionData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis unit="%" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="viewRate" name="View Rate" fill="#0088FE" />
                  <Bar dataKey="completionRate" name="Completion Rate" fill="#00C49F" />
                  <Bar dataKey="avgWatchPercent" name="Avg Watch %" fill="#FFBB28" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Student Progress</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Videos Started</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Videos Completed</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Completion %</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Course Completed</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Activity</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {summary.studentStats.map((student) => (
                <tr key={student.userId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium">{student.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{student.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{student.videosStarted}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{student.videosCompleted}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{Math.round(student.completionRate * 100)}%</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.courseCompleted ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        Completed
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                        In Progress
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{formatDate(student.lastActivity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 