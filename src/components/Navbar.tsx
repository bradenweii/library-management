import React from 'react';
import { BookOpen, PlusCircle, Settings, BarChart2 } from 'lucide-react';

interface NavbarProps {
  activeView: string;
  onChangeView: (view: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeView, onChangeView }) => {
  const navItems = [
    { id: 'books', label: 'Books', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'add', label: 'Add Book', icon: <PlusCircle className="w-5 h-5" /> },
    { id: 'stats', label: 'Statistics', icon: <BarChart2 className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> }
  ];

  return (
    <nav className="bg-indigo-700 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center py-4">
            <BookOpen className="h-8 w-8 mr-2" />
            <h1 className="text-xl font-bold">LibraryManager</h1>
          </div>
          
          <div className="hidden md:flex space-x-4">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => onChangeView(item.id)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                  ${activeView === item.id 
                    ? 'bg-indigo-800 text-white' 
                    : 'text-indigo-100 hover:bg-indigo-600'}`}
              >
                <div className="flex items-center space-x-1">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Mobile navigation */}
      <div className="md:hidden">
        <div className="flex justify-around py-2 bg-indigo-800">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`p-2 rounded-md transition-colors duration-200
                ${activeView === item.id 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-indigo-100'}`}
            >
              <div className="flex flex-col items-center">
                {item.icon}
                <span className="text-xs mt-1">{item.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;