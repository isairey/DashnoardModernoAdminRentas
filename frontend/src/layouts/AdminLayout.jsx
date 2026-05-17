import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../slices/authSlice';
import CommandPalette from '../components/CommandPalette';
import {
  FiHome,
  FiUsers,
  FiPackage,
  FiShoppingCart,
  FiFileText,
  FiSettings,
  FiMenu,
  FiX,
  FiLogOut,
  FiBarChart2,
  FiUser,
  FiSearch,
} from 'react-icons/fi';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  // Keyboard shortcut for command palette (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    { path: '/admin', icon: FiHome, label: 'Dashboard', exact: true },
    { path: '/admin/users', icon: FiUsers, label: 'Users' },
    { path: '/admin/products', icon: FiPackage, label: 'Products' },
    { path: '/admin/orders', icon: FiShoppingCart, label: 'Orders' },
    { path: '/admin/invoices', icon: FiFileText, label: 'Invoices' },
    { path: '/admin/analytics', icon: FiBarChart2, label: 'Analytics' },
    { path: '/admin/profile', icon: FiUser, label: 'My Profile' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } w-64 bg-white border-r border-gray-200`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">RentalHub</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-500"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex flex-col h-[calc(100vh-4rem)]">
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {/* Main Menu Label */}
            <p className="px-3 mb-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
              Main Menu
            </p>
            
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact 
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path) && item.path !== '/admin';
              const isExactDashboard = item.exact && location.pathname === item.path;
              const shouldHighlight = item.exact ? isExactDashboard : isActive;
              
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative
                    ${shouldHighlight 
                      ? 'bg-gray-900 text-white' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                <span className="text-gray-600 font-semibold">
                  {user?.name?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'Admin'}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email || 'admin@example.com'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full mt-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <FiLogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : ''}`}>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            {/* Left: Menu toggle */}
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
              >
                <FiMenu className="w-5 h-5" />
              </button>
            </div>

            {/* Right: Search & User Avatar */}
            <div className="flex items-center gap-3">
              {/* Search Bar - Opens Command Palette */}
              <button
                onClick={() => setCommandPaletteOpen(true)}
                className="hidden md:flex items-center gap-3 w-56 h-9 pl-3 pr-3 text-sm bg-gray-50 border border-gray-200 rounded-lg 
                  text-gray-400 hover:bg-gray-100 hover:border-gray-300 transition-all"
              >
                <FiSearch className="w-4 h-4" />
                <span className="flex-1 text-left">Search...</span>
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-medium text-gray-500">⌘K</kbd>
              </button>

              <Link to="/admin/profile" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-600 font-semibold text-sm">
                  {user?.name?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
            </Link>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        menuItems={menuItems}
      />
    </div>
  );
};

export default AdminLayout;
