export interface Book {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  publishYear?: number;
  genre?: string;
  coverUrl?: string;
  isCheckedOut: boolean;
  checkedOutBy?: string;
  checkedOutDate?: string;
  returnDate?: string;
}

export type SortField = 'title' | 'author' | 'publishYear';
export type SortDirection = 'asc' | 'desc';

export interface SortOptions {
  field: SortField;
  direction: SortDirection;
}