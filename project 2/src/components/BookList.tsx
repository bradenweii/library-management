import React, { useState, useEffect } from 'react';
import { Book, SortOptions } from '../types';
import BookCard from './BookCard';
import CheckoutModal from './CheckoutModal';
import { Search, ArrowUpDown, Filter, RefreshCw } from 'lucide-react';

interface BookListProps {
  books: Book[];
  onEditBook: (book: Book) => void;
  onDeleteBook: (id: string) => void;
  onCheckOutBook: (id: string, borrower: string, returnDate: string) => void;
  onCheckInBook: (id: string) => void;
  filterAndSort: (query: string, sortOptions: SortOptions, filterCheckedOut?: boolean) => Book[];
}

const BookList: React.FC<BookListProps> = ({
  books,
  onEditBook,
  onDeleteBook,
  onCheckOutBook,
  onCheckInBook,
  filterAndSort
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOptions, setSortOptions] = useState<SortOptions>({ field: 'title', direction: 'asc' });
  const [filterCheckedOut, setFilterCheckedOut] = useState<boolean | undefined>(undefined);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(books);
  const [checkoutBook, setCheckoutBook] = useState<Book | null>(null);
  const [showSortOptions, setShowSortOptions] = useState(false);
  
  // Update filtered books when dependencies change
  useEffect(() => {
    setFilteredBooks(filterAndSort(searchQuery, sortOptions, filterCheckedOut));
  }, [books, searchQuery, sortOptions, filterCheckedOut, filterAndSort]);
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Handle sort field change
  const handleSortFieldChange = (field: SortOptions['field']) => {
    setSortOptions(prev => ({
      field,
      direction: prev.field === field 
        ? (prev.direction === 'asc' ? 'desc' : 'asc')
        : 'asc'
    }));
    setShowSortOptions(false);
  };
  
  // Handle filter change
  const handleFilterChange = (value: boolean | undefined) => {
    setFilterCheckedOut(value);
  };
  
  // Reset all filters and sort
  const resetFilters = () => {
    setSearchQuery('');
    setSortOptions({ field: 'title', direction: 'asc' });
    setFilterCheckedOut(undefined);
  };
  
  // Open checkout modal
  const handleCheckOut = (bookId: string) => {
    const book = books.find(b => b.id === bookId);
    if (book) {
      setCheckoutBook(book);
    }
  };
  
  return (
    <div>
      {/* Search and filter toolbar */}
      <div className="mb-6 bg-white rounded-lg shadow-sm p-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search input */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search books by title, author, or genre..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div className="flex gap-2">
            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortOptions(!showSortOptions)}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <ArrowUpDown className="h-4 w-4 mr-1 text-gray-500" />
                <span className="text-sm text-gray-700">Sort</span>
              </button>
              
              {showSortOptions && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <div className="p-2">
                    <button
                      onClick={() => handleSortFieldChange('title')}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 flex items-center justify-between ${
                        sortOptions.field === 'title' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'
                      }`}
                    >
                      <span>Title</span>
                      {sortOptions.field === 'title' && (
                        <span>{sortOptions.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </button>
                    <button
                      onClick={() => handleSortFieldChange('author')}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 flex items-center justify-between ${
                        sortOptions.field === 'author' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'
                      }`}
                    >
                      <span>Author</span>
                      {sortOptions.field === 'author' && (
                        <span>{sortOptions.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </button>
                    <button
                      onClick={() => handleSortFieldChange('publishYear')}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 flex items-center justify-between ${
                        sortOptions.field === 'publishYear' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'
                      }`}
                    >
                      <span>Year</span>
                      {sortOptions.field === 'publishYear' && (
                        <span>{sortOptions.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Filter dropdown */}
            <div className="relative inline-block">
              <button
                onClick={() => setFilterCheckedOut(filterCheckedOut === undefined ? false : filterCheckedOut === false ? true : undefined)}
                className={`flex items-center px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  filterCheckedOut !== undefined
                    ? 'bg-indigo-100 border-indigo-300 text-indigo-800'
                    : 'bg-white border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Filter className="h-4 w-4 mr-1" />
                <span className="text-sm">
                  {filterCheckedOut === undefined 
                    ? 'All Books' 
                    : filterCheckedOut 
                      ? 'Checked Out Only' 
                      : 'Available Only'}
                </span>
              </button>
            </div>
            
            {/* Reset button - only show if filters are applied */}
            {(searchQuery || sortOptions.field !== 'title' || sortOptions.direction !== 'asc' || filterCheckedOut !== undefined) && (
              <button
                onClick={resetFilters}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <RefreshCw className="h-4 w-4 mr-1 text-gray-500" />
                <span className="text-sm text-gray-700">Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Results count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'}
          {searchQuery && <span> for "{searchQuery}"</span>}
        </p>
      </div>
      
      {/* Book grid */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map(book => (
            <BookCard
              key={book.id}
              book={book}
              onEdit={onEditBook}
              onDelete={onDeleteBook}
              onCheckOut={handleCheckOut}
              onCheckIn={onCheckInBook}
            />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-500">No books found. Try adjusting your search or filters.</p>
        </div>
      )}
      
      {/* Checkout modal */}
      {checkoutBook && (
        <CheckoutModal
          book={checkoutBook}
          onCheckOut={onCheckOutBook}
          onClose={() => setCheckoutBook(null)}
        />
      )}
    </div>
  );
};

export default BookList;