import React from 'react';
import { BarChart2, BookOpen, UserCheck, BookMarked } from 'lucide-react';

interface StatsProps {
  stats: {
    total: number;
    checkedOut: number;
    available: number;
    genreCounts: Record<string, number>;
  };
}

const StatsView: React.FC<StatsProps> = ({ stats }) => {
  // Format genre data for display
  const genreData = Object.entries(stats.genreCounts)
    .sort((a, b) => b[1] - a[1]) // Sort by count descending
    .slice(0, 5); // Take top 5
  
  // Find the max count for scaling
  const maxCount = genreData.length > 0 
    ? genreData[0][1] 
    : 0;
  
  // Calculate percentages
  const percentCheckedOut = stats.total > 0 
    ? Math.round((stats.checkedOut / stats.total) * 100) 
    : 0;
  
  const percentAvailable = stats.total > 0 
    ? Math.round((stats.available / stats.total) * 100) 
    : 0;
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 flex items-center">
        <BarChart2 className="h-5 w-5 mr-2 text-indigo-600" />
        Library Statistics
      </h2>
      
      {/* Summary stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-indigo-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 mr-4">
              <BookOpen className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Books</p>
              <p className="text-2xl font-semibold text-gray-800">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-emerald-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-emerald-100 mr-4">
              <BookMarked className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Available</p>
              <p className="text-2xl font-semibold text-gray-800">
                {stats.available} <span className="text-sm text-gray-500">({percentAvailable}%)</span>
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-amber-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-amber-100 mr-4">
              <UserCheck className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Checked Out</p>
              <p className="text-2xl font-semibold text-gray-800">
                {stats.checkedOut} <span className="text-sm text-gray-500">({percentCheckedOut}%)</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Status graph */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-base font-medium text-gray-700 mb-3">Status Distribution</h3>
        <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
          <div 
            className="bg-emerald-500 h-4 rounded-full" 
            style={{ width: `${percentAvailable}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <span className="w-3 h-3 inline-block bg-emerald-500 rounded-full mr-1"></span>
            Available ({percentAvailable}%)
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 inline-block bg-gray-300 rounded-full mr-1"></span>
            Checked Out ({percentCheckedOut}%)
          </div>
        </div>
      </div>
      
      {/* Genre visualization */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-base font-medium text-gray-700 mb-4">Top Genres</h3>
        {genreData.length > 0 ? (
          <div className="space-y-3">
            {genreData.map(([genre, count]) => (
              <div key={genre}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{genre}</span>
                  <span className="text-gray-500">{count} books</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-indigo-600 h-2.5 rounded-full" 
                    style={{ width: `${Math.max(5, (count / maxCount) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No genre data available</p>
        )}
      </div>
      
      {/* Usage tips */}
      <div className="bg-indigo-50 rounded-lg p-4">
        <h3 className="text-base font-medium text-indigo-800 mb-2">Library Insights</h3>
        <ul className="text-sm text-indigo-700 space-y-1">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>
              {stats.checkedOut > stats.available 
                ? "Most of your books are currently out on loan."
                : "Most of your books are currently available."}
            </span>
          </li>
          {genreData.length > 0 && (
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>
                Your collection is strongest in {genreData[0][0]} with {genreData[0][1]} books.
              </span>
            </li>
          )}
          {stats.total < 10 && (
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>
                Your library is still growing. Add more books to see detailed statistics.
              </span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default StatsView;