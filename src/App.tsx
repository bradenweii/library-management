import React, { useState } from 'react';
import Navbar from './components/Navbar';
import BookList from './components/BookList';
import BookForm from './components/BookForm';
import StatsView from './components/StatsView';
import { Book } from './types';
import { useBooks } from './hooks/useBooks';

function App() {
  const { 
    books, 
    loading, 
    addBook, 
    updateBook, 
    deleteBook, 
    checkOutBook, 
    checkInBook, 
    filterAndSortBooks,
    getStats
  } = useBooks();
  
  const [activeView, setActiveView] = useState('books');
  const [editingBook, setEditingBook] = useState<Book | undefined>(undefined);

  const handleAddBook = (book: Omit<Book, 'id'>) => {
    addBook(book);
    setActiveView('books');
  };

  const handleUpdateBook = (book: Book) => {
    updateBook(book);
    setEditingBook(undefined);
    setActiveView('books');
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setActiveView('add');
  };

  const handleCancelEdit = () => {
    setEditingBook(undefined);
    setActiveView('books');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-3"></div>
          <p className="text-gray-600">Loading library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar activeView={activeView} onChangeView={setActiveView} />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        {activeView === 'books' && (
          <BookList
            books={books}
            onEditBook={handleEditBook}
            onDeleteBook={deleteBook}
            onCheckOutBook={checkOutBook}
            onCheckInBook={checkInBook}
            filterAndSort={filterAndSortBooks}
          />
        )}
        
        {activeView === 'add' && (
          <BookForm
            book={editingBook}
            onSave={editingBook ? handleUpdateBook : handleAddBook}
            onCancel={handleCancelEdit}
          />
        )}
        
        {activeView === 'stats' && (
          <StatsView stats={getStats()} />
        )}
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-gray-500">
            Library Management System &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;