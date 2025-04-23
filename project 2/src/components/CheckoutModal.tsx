import React, { useState } from 'react';
import { X, CalendarIcon } from 'lucide-react';
import { Book } from '../types';

interface CheckoutModalProps {
  book: Book;
  onCheckOut: (id: string, borrower: string, returnDate: string) => void;
  onClose: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ book, onCheckOut, onClose }) => {
  const [borrower, setBorrower] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [errors, setErrors] = useState({ borrower: '', returnDate: '' });
  
  // Set default return date to 2 weeks from today
  React.useEffect(() => {
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);
    setReturnDate(twoWeeksFromNow.toISOString().split('T')[0]);
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = { borrower: '', returnDate: '' };
    let hasError = false;
    
    if (!borrower.trim()) {
      newErrors.borrower = 'Borrower name is required';
      hasError = true;
    }
    
    if (!returnDate) {
      newErrors.returnDate = 'Return date is required';
      hasError = true;
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(returnDate);
      selectedDate.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.returnDate = 'Return date cannot be in the past';
        hasError = true;
      }
    }
    
    setErrors(newErrors);
    
    if (!hasError) {
      onCheckOut(book.id, borrower, returnDate);
      onClose();
    }
  };
  
  // Calculate minimum date (today) for the date picker
  const today = new Date().toISOString().split('T')[0];
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden animate-fadeIn">
        <div className="flex justify-between items-center border-b px-4 py-3">
          <h3 className="text-lg font-medium text-gray-900">Check Out Book</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4">
          <div className="flex items-center mb-4">
            <div className="h-16 w-12 bg-gray-200 rounded overflow-hidden mr-3">
              {book.coverUrl ? (
                <img 
                  src={book.coverUrl} 
                  alt={`${book.title} cover`} 
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gray-300">
                  <span className="text-xs text-gray-500">No Cover</span>
                </div>
              )}
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{book.title}</h4>
              <p className="text-sm text-gray-600">by {book.author}</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Borrower Name *
              </label>
              <input
                type="text"
                value={borrower}
                onChange={(e) => {
                  setBorrower(e.target.value);
                  if (e.target.value.trim()) {
                    setErrors({ ...errors, borrower: '' });
                  }
                }}
                placeholder="Enter borrower's name"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500
                  ${errors.borrower ? 'border-red-300' : 'border-gray-300'}`}
              />
              {errors.borrower && (
                <p className="mt-1 text-sm text-red-600">{errors.borrower}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Return Date *
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={returnDate}
                  min={today}
                  onChange={(e) => {
                    setReturnDate(e.target.value);
                    if (e.target.value) {
                      setErrors({ ...errors, returnDate: '' });
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500
                    ${errors.returnDate ? 'border-red-300' : 'border-gray-300'}`}
                />
                <CalendarIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              {errors.returnDate && (
                <p className="mt-1 text-sm text-red-600">{errors.returnDate}</p>
              )}
            </div>
            
            <div className="pt-2 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Check Out
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;