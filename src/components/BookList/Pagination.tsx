import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  hasNextPage,
  hasPrevPage,
  onPageChange,
  loading = false,
}) => {
  if (totalPages <= 1) {
    return null;
  }

  const getVisiblePages = () => {
    const visiblePages: (number | string)[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than or equal to max visible
      for (let i = 1; i <= totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      // Always show first page
      visiblePages.push(1);
      
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust range if we're near the beginning or end
      if (currentPage <= 3) {
        endPage = Math.min(totalPages - 1, 4);
      } else if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3);
      }
      
      // Add ellipsis if there's a gap after first page
      if (startPage > 2) {
        visiblePages.push('...');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        visiblePages.push(i);
      }
      
      // Add ellipsis if there's a gap before last page
      if (endPage < totalPages - 1) {
        visiblePages.push('...');
      }
      
      // Always show last page (if it's not already included)
      if (totalPages > 1) {
        visiblePages.push(totalPages);
      }
    }
    
    return visiblePages;
  };

  const handlePageClick = (page: number | string) => {
    if (typeof page === 'number' && page !== currentPage && !loading) {
      onPageChange(page);
    }
  };

  const handlePrevious = () => {
    if (hasPrevPage && !loading) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (hasNextPage && !loading) {
      onPageChange(currentPage + 1);
    }
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col items-center space-y-4 mt-8">
      {/* Results info */}
      <div className="text-sm text-gray-700">
        Showing <span className="font-medium">{startItem}</span> to{' '}
        <span className="font-medium">{endItem}</span> of{' '}
        <span className="font-medium">{totalItems}</span> results
      </div>

      {/* Pagination controls */}
      <nav className="flex items-center space-x-1" aria-label="Pagination">
        {/* Previous button */}
        <button
          onClick={handlePrevious}
          disabled={!hasPrevPage || loading}
          className={`px-3 py-2 text-sm font-medium rounded-md ${
            !hasPrevPage || loading
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
          } transition-colors duration-200`}
          aria-label="Previous page"
        >
          Previous
        </button>

        {/* Page numbers */}
        <div className="flex items-center space-x-1">
          {getVisiblePages().map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-3 py-2 text-sm text-gray-500"
                >
                  ...
                </span>
              );
            }

            const pageNumber = page as number;
            const isCurrentPage = pageNumber === currentPage;

            return (
              <button
                key={pageNumber}
                onClick={() => handlePageClick(pageNumber)}
                disabled={loading}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  isCurrentPage
                    ? 'bg-blue-600 text-white cursor-default'
                    : loading
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
                aria-label={`Page ${pageNumber}`}
                aria-current={isCurrentPage ? 'page' : undefined}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>

        {/* Next button */}
        <button
          onClick={handleNext}
          disabled={!hasNextPage || loading}
          className={`px-3 py-2 text-sm font-medium rounded-md ${
            !hasNextPage || loading
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
          } transition-colors duration-200`}
          aria-label="Next page"
        >
          Next
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
