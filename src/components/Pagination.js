import React from 'react';

function Pagination({ currentPage, totalPages, onPageChange }) {
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="mt-4">
      <ul className="flex justify-end">
        {pageNumbers.map(number => (
          <li key={number} className="mx-1">
            <button
              onClick={() => onPageChange(number)}
              className={`px-3 py-1 rounded ${
                currentPage === number
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Pagination;
