'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiSearch, FiFilter, FiX, FiChevronRight, FiStar, FiClock } from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  instructor: {
    name: string;
  };
  category: string;
  level: string;
  imageUrl: string;
  videos: { _id: string }[];
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';
  
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [results, setResults] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [levels, setLevels] = useState<string[]>(['Beginner', 'Intermediate', 'Advanced']);
  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);
  const [filteredLevels, setFilteredLevels] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/api/categories');
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    
    fetchCategories();
  }, []);
  
  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);
  
  const performSearch = async (query: string) => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      params.append('q', query);
      
      if (filteredCategories.length > 0) {
        filteredCategories.forEach(category => {
          params.append('categories', category);
        });
      }
      
      if (filteredLevels.length > 0) {
        filteredLevels.forEach(level => {
          params.append('levels', level);
        });
      }
      
      const { data } = await axios.get(`/api/courses/search?${params.toString()}`);
      setResults(data);
    } catch (err) {
      console.error('Error searching courses:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update URL with search params
    const params = new URLSearchParams();
    if (searchTerm) params.set('q', searchTerm);
    
    router.push(`/search?${params.toString()}`);
    performSearch(searchTerm);
  };
  
  const toggleCategory = (category: string) => {
    setFilteredCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  const toggleLevel = (level: string) => {
    setFilteredLevels(prev => 
      prev.includes(level)
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  };
  
  const clearFilters = () => {
    setFilteredCategories([]);
    setFilteredLevels([]);
  };
  
  useEffect(() => {
    if (filteredCategories.length > 0 || filteredLevels.length > 0) {
      performSearch(searchTerm);
    }
  }, [filteredCategories, filteredLevels]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Search Courses</h1>
            <p className="text-gray-600">Find the perfect course to enhance your skills</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Filters - Mobile Toggle */}
            <div className="md:hidden mb-4">
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm"
              >
                <span className="flex items-center">
                  <FiFilter className="mr-2" />
                  Filters {(filteredCategories.length > 0 || filteredLevels.length > 0) && 
                    `(${filteredCategories.length + filteredLevels.length})`}
                </span>
                <FiChevronRight className={`transition-transform ${filtersOpen ? 'rotate-90' : ''}`} />
              </button>
            </div>
            
            {/* Filters Sidebar */}
            <div className={`w-full md:w-64 md:block ${filtersOpen ? 'block' : 'hidden'}`}>
              <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  {(filteredCategories.length > 0 || filteredLevels.length > 0) && (
                    <button 
                      onClick={clearFilters}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Categories</h3>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <div key={category} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`category-${category}`}
                          checked={filteredCategories.includes(category)}
                          onChange={() => toggleCategory(category)}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <label htmlFor={`category-${category}`} className="ml-2 text-gray-700">
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Level</h3>
                  <div className="space-y-2">
                    {levels.map(level => (
                      <div key={level} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`level-${level}`}
                          checked={filteredLevels.includes(level)}
                          onChange={() => toggleLevel(level)}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <label htmlFor={`level-${level}`} className="ml-2 text-gray-700">
                          {level}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Search Results */}
            <div className="flex-1">
              <div className="mb-6">
                <form onSubmit={handleSearch} className="flex">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiSearch className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search for courses..."
                      className="pl-10 pr-4 py-3 w-full rounded-l-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {searchTerm && (
                      <button
                        type="button"
                        onClick={() => setSearchTerm('')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <FiX className="text-gray-400 hover:text-gray-600" />
                      </button>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-r-lg font-medium"
                  >
                    Search
                  </button>
                </form>
              </div>
              
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : results.length > 0 ? (
                <div>
                  <p className="text-gray-600 mb-4">{results.length} courses found</p>
                  <div className="space-y-6">
                    {results.map(course => (
                      <Link 
                        href={`/courses/${course._id}`} 
                        key={course._id}
                        className="block bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col sm:flex-row">
                          <div 
                            className="w-full sm:w-48 h-48 sm:h-auto bg-gray-200 relative"
                            style={{
                              backgroundImage: `url(${course.imageUrl})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center'
                            }}
                          ></div>
                          <div className="p-5 flex-1">
                            <div className="flex justify-between mb-2">
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                                {course.category}
                              </span>
                              <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">
                                {course.level}
                              </span>
                            </div>
                            <h2 className="text-xl font-bold mb-2">{course.title}</h2>
                            <p className="text-gray-600 mb-3 line-clamp-2">{course.description}</p>
                            <div className="mt-auto flex justify-between items-center">
                              <span className="text-gray-600 text-sm">By {course.instructor.name}</span>
                              <div className="flex items-center">
                                <FiClock className="text-gray-500 mr-1" />
                                <span className="text-gray-600 text-sm mr-4">{course.videos.length} videos</span>
                                <span className="font-bold text-blue-600">${course.price}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : searchTerm ? (
                <div className="py-12 text-center">
                  <p className="text-gray-600 mb-2">No courses found for "{searchTerm}"</p>
                  <p className="text-gray-500">Try different keywords or filters</p>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-gray-600">Enter keywords to search for courses</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 