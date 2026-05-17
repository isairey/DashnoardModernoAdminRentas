import { useState, useEffect, useRef, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiCommand, FiX } from 'react-icons/fi';

const CommandPalette = ({ isOpen, onClose, menuItems = [], basePath = '' }) => {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Filter items based on search
  const filteredItems = menuItems.filter(item =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  // Reset selection when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setSearch('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredItems.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : filteredItems.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredItems[selectedIndex]) {
            navigate(filteredItems[selectedIndex].path);
            onClose();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, navigate, onClose]);

  if (!isOpen) return null;

  return (
    <Fragment>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
        <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
            <FiSearch className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search pages..."
              className="flex-1 text-base text-gray-900 placeholder:text-gray-400 bg-transparent outline-none"
            />
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-80 overflow-y-auto py-2">
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => {
                const Icon = item.icon;
                const isSelected = index === selectedIndex;
                
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                      isSelected ? 'bg-gray-100' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${
                        isSelected ? 'text-gray-900' : 'text-gray-700'
                      }`}>
                        {item.label}
                      </p>
                      <p className="text-xs text-gray-400">{item.path}</p>
                    </div>
                    {isSelected && (
                      <span className="text-xs text-gray-400">↵ to select</span>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-gray-500">No results found for "{search}"</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-[10px] font-medium">↑</kbd>
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-[10px] font-medium">↓</kbd>
                to navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-[10px] font-medium">↵</kbd>
                to select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-[10px] font-medium">esc</kbd>
                to close
              </span>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default CommandPalette;
