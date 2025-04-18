// customer-app/src/components/layout/Header.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../common/context/AuthContext';
import Button from '../../../../common/components/Button';
import CartIcon from '../cart/CartIcon';

const Header = () => {
  const { currentUser, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { text: 'Home', path: '/' },
    { text: 'Fans', path: '/products?category=fan' },
    { text: 'Air Conditioners', path: '/products?category=air_conditioner' },
    { text: 'All Products', path: '/products' }
  ];

  // Add profile and orders links for logged-in users
  const userLinks = currentUser ? [
    { text: 'My Orders', path: '/orders' },
    { text: 'Profile', path: '/profile' }
  ] : [];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-blue-600">
                Cool Air Shop
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:ml-6 md:flex md:space-x-8">
              {navLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium border-transparent hover:border-blue-500 text-gray-500 hover:text-gray-900"
                >
                  {link.text}
                </Link>
              ))}
            </nav>
          </div>

          {/* Cart, User Menu, Auth Buttons */}
          <div className="flex items-center">
            {/* Cart Icon */}
            <div className="mr-4">
              <CartIcon />
            </div>

            {/* User Menu (Desktop) */}
            <div className="hidden md:flex md:items-center">
              {currentUser ? (
                <div className="relative group">
                  <button className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    <span className="mr-2">
                      {currentUser.displayName || currentUser.email}
                    </span>
                    <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                    {userLinks.map((link, index) => (
                      <Link
                        key={index}
                        to={link.path}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {link.text}
                      </Link>
                    ))}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      disabled={loading}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleLogin}
                >
                  Sign In
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                aria-expanded="false"
                onClick={toggleMobileMenu}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                to={link.path}
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.text}
              </Link>
            ))}
            {userLinks.map((link, index) => (
              <Link
                key={index}
                to={link.path}
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.text}
              </Link>
            ))}
            {currentUser ? (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                disabled={loading}
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="block pl-3 pr-4 py-2 border-l-4 border-blue-500 text-base font-medium text-blue-700 bg-blue-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;