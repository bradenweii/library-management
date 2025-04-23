import React, { useState, useEffect } from 'react';
import { Book } from '../types';
import { X } from 'lucide-react';

interface BookFormProps {
  book?: Book;
  onSave: (book: Omit<Book, 'id'> | Book) => void;
  onCancel: () => void;
}

const initialFormState: Omit<Book, 'id'> = {
  title: '',
  author: '',
  isbn: '',
  publishYear: undefined,
  genre: '',
  coverUrl: '',
  isCheckedOut: false,
};

const BookForm: React.FC<BookFormProps> = ({ book, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Book, 'id'> | Book>(
    book || initialFormState
  );
  const [errors, setErrors] = useState<Partial<Record<keyof Book, string>>>({});
  
  // Reset form when book prop changes
  useEffect(() => {
    setFormData(book || initialFormState);
    setErrors({});
  }, [book]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    // Handle number inputs
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: value ? parseInt(value, 10) : undefined,
      });
      return;
    }
    
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when field is edited
    if (errors[name as keyof Book]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };
  
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof Book, string>> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }
    
    // Validate ISBN if provided (basic check)
    if (formData.isbn && !/^(?:\d[- ]?){9}[\dXx]$|^(?:\d[- ]?){13}$/.test(formData.isbn)) {
      newErrors.isbn = 'ISBN must be 10 or 13 digits';
    }
    
    // Validate year if provided
    if (formData.publishYear !== undefined) {
      const currentYear = new Date().getFullYear();
      if (formData.publishYear < 0 || formData.publishYear > currentYear) {
        newErrors.publishYear = `Year must be between 0 and ${currentYear}`;
      }
    }
    
    // Validate cover URL if provided
    if (formData.coverUrl && !formData.coverUrl.match(/^(https?:\/\/)/)) {
      newErrors.coverUrl = 'Cover URL must start with http:// or https://';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSave(formData);
    }
  };
  
  const genreOptions = [
    'Fiction',
    'Non-Fiction',
    'Science Fiction',
    'Fantasy',
    'Mystery',
    'Thriller',
    'Romance',
    'Historical',
    'Biography',
    'Self-Help',
    'Children',
    'Science',
    'Technology',
    'Classic',
    'Other'
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {book ? 'Edit Book' : 'Add New Book'}
        </h2>
        <button 
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 
              ${errors.title ? 'border-red-300' : 'border-gray-300'}`}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Author *
          </label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 
              ${errors.author ? 'border-red-300' : 'border-gray-300'}`}
          />
          {errors.author && (
            <p className="mt-1 text-sm text-red-600">{errors.author}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ISBN
            </label>
            <input
              type="text"
              name="isbn"
              value={formData.isbn || ''}
              onChange={handleChange}
              placeholder="e.g., 9780123456789"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 
                ${errors.isbn ? 'border-red-300' : 'border-gray-300'}`}
            />
            {errors.isbn && (
              <p className="mt-1 text-sm text-red-600">{errors.isbn}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Publication Year
            </label>
            <input
              type="number"
              name="publishYear"
              value={formData.publishYear || ''}
              onChange={handleChange}
              placeholder="e.g., 2023"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 
                ${errors.publishYear ? 'border-red-300' : 'border-gray-300'}`}
            />
            {errors.publishYear && (
              <p className="mt-1 text-sm text-red-600">{errors.publishYear}</p>
            )}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Genre
          </label>
          <select
            name="genre"
            value={formData.genre || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select a genre</option>
            {genreOptions.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cover Image URL
          </label>
          <input
            type="text"
            name="coverUrl"
            value={formData.coverUrl || ''}
            onChange={handleChange}
            placeholder="https://example.com/book-cover.jpg"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 
              ${errors.coverUrl ? 'border-red-300' : 'border-gray-300'}`}
          />
          {errors.coverUrl && (
            <p className="mt-1 text-sm text-red-600">{errors.coverUrl}</p>
          )}
          
          {formData.coverUrl && (
            <div className="mt-2 h-32 w-24 bg-gray-100 rounded overflow-hidden">
              <img 
                src={formData.coverUrl} 
                alt="Book cover preview" 
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1907785/pexels-photo-1907785.jpeg';
                }}
              />
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {book ? 'Update Book' : 'Add Book'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookForm;