import { useState, useEffect } from 'react';
import { Book, SortOptions } from '../types';

const STORAGE_KEY = 'library-books';

// Sample initial data
const initialBooks: Book[] = [
  {
    id: '1',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '9780061120084',
    publishYear: 1960,
    genre: 'Classic',
    coverUrl: 'https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg',
    isCheckedOut: false,
  },
  {
    id: '2',
    title: '1984',
    author: 'George Orwell',
    isbn: '9780451524935',
    publishYear: 1949,
    genre: 'Dystopian',
    coverUrl: 'https://images.pexels.com/photos/1765033/pexels-photo-1765033.jpeg',
    isCheckedOut: true,
    checkedOutBy: 'Jane Smith',
    checkedOutDate: '2023-11-15',
    returnDate: '2023-12-15',
  },
  {
    id: '3',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '9780743273565',
    publishYear: 1925,
    genre: 'Classic',
    coverUrl: 'https://images.pexels.com/photos/3747139/pexels-photo-3747139.jpeg',
    isCheckedOut: false,
  },
];

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Load books from localStorage on initial render
  useEffect(() => {
    const storedBooks = localStorage.getItem(STORAGE_KEY);
    if (storedBooks) {
      setBooks(JSON.parse(storedBooks));
    } else {
      // Use initial sample data if no stored books
      setBooks(initialBooks);
    }
    setLoading(false);
  }, []);
  
  // Save to localStorage whenever books change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    }
  }, [books, loading]);
  
  // Add a new book
  const addBook = (book: Omit<Book, 'id'>) => {
    const newBook: Book = {
      ...book,
      id: Date.now().toString(),
      isCheckedOut: false,
    };
    setBooks(prevBooks => [...prevBooks, newBook]);
    return newBook;
  };
  
  // Update an existing book
  const updateBook = (updatedBook: Book) => {
    setBooks(prevBooks => 
      prevBooks.map(book => 
        book.id === updatedBook.id ? updatedBook : book
      )
    );
    return updatedBook;
  };
  
  // Delete a book
  const deleteBook = (id: string) => {
    setBooks(prevBooks => prevBooks.filter(book => book.id !== id));
  };
  
  // Check out a book
  const checkOutBook = (id: string, borrower: string, returnDate: string) => {
    setBooks(prevBooks => 
      prevBooks.map(book => 
        book.id === id 
          ? {
              ...book,
              isCheckedOut: true,
              checkedOutBy: borrower,
              checkedOutDate: new Date().toISOString().split('T')[0],
              returnDate
            } 
          : book
      )
    );
  };
  
  // Check in a book
  const checkInBook = (id: string) => {
    setBooks(prevBooks => 
      prevBooks.map(book => 
        book.id === id 
          ? {
              ...book,
              isCheckedOut: false,
              checkedOutBy: undefined,
              checkedOutDate: undefined,
              returnDate: undefined
            } 
          : book
      )
    );
  };
  
  // Filter and sort books
  const filterAndSortBooks = (
    query: string,
    sortOptions: SortOptions,
    filterCheckedOut?: boolean
  ) => {
    const queryLower = query.toLowerCase();
    
    return [...books]
      .filter(book => {
        // Apply search query filter
        const matchesQuery = !query || 
          book.title.toLowerCase().includes(queryLower) ||
          book.author.toLowerCase().includes(queryLower) ||
          book.genre?.toLowerCase().includes(queryLower) ||
          book.isbn?.toLowerCase().includes(queryLower);
          
        // Apply checked out filter if specified
        const matchesCheckout = filterCheckedOut === undefined || 
          book.isCheckedOut === filterCheckedOut;
          
        return matchesQuery && matchesCheckout;
      })
      .sort((a, b) => {
        // Dynamic sorting based on field and direction
        const field = sortOptions.field;
        const direction = sortOptions.direction === 'asc' ? 1 : -1;
        
        if (field === 'publishYear') {
          const yearA = a.publishYear || 0;
          const yearB = b.publishYear || 0;
          return (yearA - yearB) * direction;
        }
        
        const valueA = (a[field] || '').toString().toLowerCase();
        const valueB = (b[field] || '').toString().toLowerCase();
        
        if (valueA < valueB) return -1 * direction;
        if (valueA > valueB) return 1 * direction;
        return 0;
      });
  };
  
  // Get statistics
  const getStats = () => {
    const total = books.length;
    const checkedOut = books.filter(book => book.isCheckedOut).length;
    const available = total - checkedOut;
    
    const genreCounts: Record<string, number> = {};
    books.forEach(book => {
      if (book.genre) {
        genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1;
      }
    });
    
    return {
      total,
      checkedOut,
      available,
      genreCounts
    };
  };
  
  return {
    books,
    loading,
    addBook,
    updateBook,
    deleteBook,
    checkOutBook,
    checkInBook,
    filterAndSortBooks,
    getStats
  };
}