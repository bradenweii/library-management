import React, { useState } from 'react';
import { Book } from '../types';
import { Edit, Trash2, UserCheck, UserX, Clock } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
  onCheckOut: (id: string) => void;
  onCheckIn: (id: string) => void;
}

const BookCard: React.FC<BookCardProps> = ({ 
  book, 
  onEdit, 
  onDelete, 
  onCheckOut,
  onCheckIn
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  
  // Format date to be more readable
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };
  
  // Calculate days until return if checked out
  const getDaysUntilReturn = () => {
    if (!book.returnDate) return null;
    
    const returnDate = new Date(book.returnDate);
    const today = new Date();
    
    // Reset time part for accurate day calculation
    returnDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    const diffTime = returnDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  const daysUntilReturn = getDaysUntilReturn();
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-200">
      <div className="h-36 bg-gray-200 relative overflow-hidden">
        {book.coverUrl ? (
          <img 
            src={book.coverUrl} 
            alt={`${book.title} cover`} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-indigo-100 to-indigo-200">
            <span className="text-gray-500 text-lg font-medium">No Cover</span>
          </div>
        )}
        
        {/* Status badge */}
        <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
          book.isCheckedOut 
            ? 'bg-amber-100 text-amber-800' 
            : 'bg-emerald-100 text-emerald-800'
        }`}>
          {book.isCheckedOut ? 'Checked Out' : 'Available'}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate">{book.title}</h3>
        <p className="text-sm text-gray-600">by {book.author}</p>
        
        <div className="mt-2 space-y-1">
          {book.genre && (
            <p className="text-xs text-gray-500">
              <span className="font-medium">Genre:</span> {book.genre}
            </p>
          )}
          {book.publishYear && (
            <p className="text-xs text-gray-500">
              <span className="font-medium">Published:</span> {book.publishYear}
            </p>
          )}
          {book.isbn && (
            <p className="text-xs text-gray-500">
              <span className="font-medium">ISBN:</span> {book.isbn}
            </p>
          )}
        </div>
        
        {/* Checkout information */}
        {book.isCheckedOut && (
          <div className="mt-3 p-2 bg-gray-50 rounded-md">
            <p className="text-xs font-medium text-gray-700 flex items-center">
              <UserCheck className="w-3 h-3 mr-1" />
              Borrower: {book.checkedOutBy}
            </p>
            {book.checkedOutDate && (
              <p className="text-xs text-gray-600 mt-1">
                Since: {formatDate(book.checkedOutDate)}
              </p>
            )}
            {book.returnDate && (
              <p className={`text-xs mt-1 flex items-center ${
                daysUntilReturn && daysUntilReturn < 0 
                  ? 'text-red-600 font-medium' 
                  : daysUntilReturn && daysUntilReturn <= 3
                    ? 'text-amber-600'
                    : 'text-gray-600'
              }`}>
                <Clock className="w-3 h-3 mr-1" />
                Return: {formatDate(book.returnDate)}
                {daysUntilReturn !== null && (
                  <span className="ml-1">
                    ({daysUntilReturn < 0 
                      ? `${Math.abs(daysUntilReturn)} days overdue` 
                      : daysUntilReturn === 0 
                        ? 'Due today' 
                        : `${daysUntilReturn} days left`})
                  </span>
                )}
              </p>
            )}
          </div>
        )}
        
        {/* Action buttons */}
        <div className="mt-4 flex justify-between">
          <div className="space-x-2">
            <button 
              onClick={() => onEdit(book)}
              className="text-gray-600 hover:text-indigo-600 transition-colors p-1"
              title="Edit book"
            >
              <Edit className="w-4 h-4" />
            </button>
            
            {!showConfirmDelete ? (
              <button 
                onClick={() => setShowConfirmDelete(true)}
                className="text-gray-600 hover:text-red-600 transition-colors p-1"
                title="Delete book"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            ) : (
              <div className="inline-flex items-center">
                <button 
                  onClick={() => {
                    onDelete(book.id);
                    setShowConfirmDelete(false);
                  }}
                  className="text-red-600 hover:text-red-800 transition-colors p-1"
                  title="Confirm delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setShowConfirmDelete(false)}
                  className="text-gray-600 ml-1 text-xs"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          
          <div>
            {book.isCheckedOut ? (
              <button 
                onClick={() => onCheckIn(book.id)}
                className="flex items-center space-x-1 text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-1 px-2 rounded transition-colors"
              >
                <UserX className="w-3 h-3" />
                <span>Return</span>
              </button>
            ) : (
              <button 
                onClick={() => onCheckOut(book.id)}
                className="flex items-center space-x-1 text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-1 px-2 rounded transition-colors"
              >
                <UserCheck className="w-3 h-3" />
                <span>Borrow</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;