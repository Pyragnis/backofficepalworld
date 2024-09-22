import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="mt-6 flex justify-center flex-wrap space-x-1">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="px-3 py-1 mx-1 bg-gray-200 text-gray-600 rounded-lg disabled:opacity-50"
      >
        Précédent
      </button>

      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index + 1}
          onClick={() => onPageChange(index + 1)}
          className={`px-3 py-1 mx-1 border rounded-lg ${
            currentPage === index + 1 ? 'bg-sky-600 text-white' : 'bg-gray-200 text-gray-700'
          } hover:bg-sky-500 hover:text-white transition-colors duration-300`}
        >
          {index + 1}
        </button>
      ))}

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="px-3 py-1 mx-1 bg-gray-200 text-gray-600 rounded-lg disabled:opacity-50"
      >
        Suivant
      </button>
    </div>
  );
};

export default Pagination;
