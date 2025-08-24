import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  onClear: () => void;
  placeholder?: string;
  initialValue?: string;
  debounceMs?: number;
  isAuthenticated?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onClear,
  placeholder = 'Search books, authors, or genres...',
  initialValue = '',
  debounceMs = 300,
  isAuthenticated = false,
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialValue);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs]);

  // Trigger search when debounced term changes
  useEffect(() => {
    if (debouncedSearchTerm.length >= 3) {
      onSearch(debouncedSearchTerm);
    } else if (debouncedSearchTerm.length === 0) {
      onClear();
    }
  }, [debouncedSearchTerm, onSearch, onClear]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleClear = () => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    onClear();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.length >= 3) {
      onSearch(searchTerm);
    }
  };

  const handleAIRecommendations = () => {
    if (isAuthenticated) {
      navigate('/recommendations');
    }
  };

  return (
    <div className="relative max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          {/* Search Icon */}
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Search Input */}
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder={placeholder}
            className={`block w-full pl-10 ${isAuthenticated ? 'pr-20' : 'pr-12'} py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900`}
            aria-label="Search books"
          />

          {/* AI Recommendations Button */}
          {isAuthenticated && (
            <button
              type="button"
              onClick={handleAIRecommendations}
              className="absolute inset-y-0 right-12 pr-2 flex items-center hover:text-blue-600 text-blue-500 transition-colors"
              aria-label="Get AI Recommendations"
              title="Get AI Recommendations"
            >
              <span className="text-lg">⚡</span>
            </button>
          )}

          {/* Clear Button */}
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 text-gray-400"
              aria-label="Clear search"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </form>

      {/* Search Hint */}
      {searchTerm.length > 0 && searchTerm.length < 3 && (
        <div className="absolute top-full left-0 right-0 mt-1 p-2 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-700">
          Type at least 3 characters to search
        </div>
      )}
    </div>
  );
};

export default SearchBar;
