'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FiSearch, FiFilter, FiChevronDown, FiChevronUp, FiStar } from 'react-icons/fi';

// A client component that uses useSearchParams
function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [levels, setLevels] = useState<string[]>(['Beginner', 'Intermediate', 'Advanced']);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  const toggleLevel = (level: string) => {
    setSelectedLevels(prev => 
      prev.includes(level)
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  };
  
  // Fetch initial results based on URL params
  useEffect(() => {
    if (initialQuery) {
      performSearch();
    }
  }, []);
  
  const performSearch = async () => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }
    
    setSearching(true);
    
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('q', searchTerm);
      
      if (selectedCategories.length > 0) {
        selectedCategories.forEach(cat => {
          queryParams.append('categories', cat);
        });
      }
      
      if (selectedLevels.length > 0) {
        selectedLevels.forEach(level => {
          queryParams.append('levels', level);
        });
      }
      
      const res = await fetch(`/api/courses/search?${queryParams}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data);
        
        // Update URL with search parameters
        const newUrl = `/search?${queryParams.toString()}`;
        window.history.pushState({ path: newUrl }, '', newUrl);
      }
    } catch (error) {
      console.error('Error searching courses:', error);
    } finally {
      setSearching(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch();
  };
  
  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data.map((cat: any) => cat.name));
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
    performSearch();
  }, [selectedCategories, selectedLevels]);
  
  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Search Courses</h1>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for courses..."
              className="w-full p-3 border border-gray-300 rounded-lg pl-10"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button 
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Search
          </button>
          <button
            type="button"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center gap-2 border border-gray-300 px-4 py-3 rounded-lg hover:bg-gray-100"
          >
            <FiFilter />
            Filters
            {filtersOpen ? <FiChevronUp /> : <FiChevronDown />}
          </button>
        </div>
        
        {filtersOpen && (
          <div className="mt-4 p-4 border border-gray-200 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedCategories.includes(category)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                      onClick={() => toggleCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Level</h3>
                <div className="flex flex-wrap gap-2">
                  {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                    <button
                      key={level}
                      type="button"
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedLevels.includes(level)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                      onClick={() => toggleLevel(level)}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
      
      {searching ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4 animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4 w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-4">
          {results.map((course) => (
            <Link
              key={course._id}
              href={`/courses/${course._id}`}
              className="block border border-gray-200 hover:border-blue-400 rounded-lg overflow-hidden transition-all hover:shadow-md"
            >
              <div className="p-4 flex flex-col md:flex-row gap-4">
                <div className="relative h-40 md:w-60 rounded-lg overflow-hidden">
                  <Image
                    src={course.thumbnail || '/placeholder-course.jpg'}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
                  <p className="text-gray-600 mb-2 line-clamp-2">{course.description}</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {course.categories?.map((cat: string) => (
                      <span key={cat} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                        {cat}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-blue-600 font-semibold">
                      {course.price > 0 ? `$${course.price.toFixed(2)}` : 'Free'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {course.totalLessons || course.videos?.length || 0} lessons
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : searchTerm ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No courses found</h2>
          <p className="text-gray-600">
            We couldn't find any courses matching "{searchTerm}". Try different keywords or filters.
          </p>
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Search for courses</h2>
          <p className="text-gray-600">
            Enter keywords to find courses on various topics.
          </p>
        </div>
      )}
    </div>
  );
}

// Default export with Suspense boundary
export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container max-w-6xl mx-auto py-8 px-4 animate-pulse">
      <div className="h-10 bg-gray-200 mb-6 max-w-xs rounded"></div>
      <div className="h-12 bg-gray-200 mb-8 w-full rounded"></div>
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-40 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>}>
      <SearchContent />
    </Suspense>
  );
} 