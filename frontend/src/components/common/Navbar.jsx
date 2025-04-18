// src/components/common/Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';

const Navbar = () => {
  const { currentUser, logout, isAdmin, isRider } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const cartCount = getCartCount();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-blue-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-white font-bold text-xl">
                Fans & ACs
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
              {/* Always visible links */}
              <Link to="/" className="text-white hover:bg-blue-700 px-3 py-2 rounded-md">
                Home
              </Link>
              <Link to="/products" className="text-white hover:bg-blue-700 px-3 py-2 rounded-md">
                Products
              </Link>

              {/* Admin links */}
              {currentUser && isAdmin() && (
                <>
                  <Link to="/admin/dashboard" className="text-white hover:bg-blue-700 px-3 py-2 rounded-md">
                    Dashboard
                  </Link>
                  <Link to="/admin/orders" className="text-white hover:bg-blue-700 px-3 py-2 rounded-md">
                    Orders
                  </Link>
                  <Link to="/admin/users" className="text-white hover:bg-blue-700 px-3 py-2 rounded-md">
                    Users
                  </Link>
                </>
              )}

              {/* Rider links */}
              {currentUser && isRider() && (
                <>
                  <Link to="/rider/dashboard" className="text-white hover:bg-blue-700 px-3 py-2 rounded-md">
                    Dashboard
                  </Link>
                  <Link to="/rider/orders" className="text-white hover:bg-blue-700 px-3 py-2 rounded-md">
                    Orders
                  </Link>
                </>
              )}

              {/* Customer links (when authenticated) */}
              {currentUser && !isAdmin() && !isRider() && (
                <Link to="/orders" className="text-white hover:bg-blue-700 px-3 py-2 rounded-md">
                  My Orders
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center">
            {/* Cart icon (only visible for customers or non-authenticated users) */}
            {(!currentUser || (!isAdmin() && !isRider())) && (
              <Link to="/cart" className="text-white hover:bg-blue-700 px-3 py-2 rounded-md mr-2 relative">
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Cart
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </span>
              </Link>
            )}

            {/* Authentication buttons */}
            {currentUser ? (
              <div className="flex items-center">
                <div className="hidden md:flex items-center">
                  <img
                    className="h-8 w-8 rounded-full mr-2"
                    src={currentUser.photoURL || "https://via.placeholder.com/40"}
                    alt="Profile"
                  />
                  <span className="text-white">{currentUser.displayName}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-4 text-white hover:bg-blue-700 px-3 py-2 rounded-md"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-white hover:bg-blue-700 px-3 py-2 rounded-md"
              >
                Login
              </Link>
            )}

            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden ml-4">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-700 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="text-white block hover:bg-blue-700 px-3 py-2 rounded-md"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              to="/products"
              className="text-white block hover:bg-blue-700 px-3 py-2 rounded-md"
              onClick={toggleMenu}
            >
              Products
            </Link>

            {!currentUser && (
              <Link
                to="/login"
                className="text-white block hover:bg-blue-700 px-3 py-2 rounded-md"
                onClick={toggleMenu}
              >
                Login
              </Link>
            )}

            {currentUser && isAdmin() && (
              <>
                <Link
                  to="/admin/dashboard"
                  className="text-white block hover:bg-blue-700 px-3 py-2 rounded-md"
                  onClick={toggleMenu}
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/orders"
                  className="text-white block hover:bg-blue-700 px-3 py-2 rounded-md"
                  onClick={toggleMenu}
                >
                  Orders
                </Link>
                <Link
                  to="/admin/users"
                  className="text-white block hover:bg-blue-700 px-3 py-2 rounded-md"
                  onClick={toggleMenu}
                >
                  Users
                </Link>
              </>
            )}

            {currentUser && isRider() && (
              <>
                <Link
                  to="/rider/dashboard"
                  className="text-white block hover:bg-blue-700 px-3 py-2 rounded-md"
                  onClick={toggleMenu}
                >
                  Dashboard
                </Link>
                <Link
                  to="/rider/orders"
                  className="text-white block hover:bg-blue-700 px-3 py-2 rounded-md"
                  onClick={toggleMenu}
                >
                  Orders
                </Link>
              </>
            )}

            {currentUser && !isAdmin() && !isRider() && (
              <>
                <Link
                  to="/orders"
                  className="text-white block hover:bg-blue-700 px-3 py-2 rounded-md"
                  onClick={toggleMenu}
                >
                  My Orders
                </Link>
                <Link
                  to="/cart"
                  className="text-white block hover:bg-blue-700 px-3 py-2 rounded-md"
                  onClick={toggleMenu}
                >
                  Cart
                </Link>
              </>
            )}

            {currentUser && (
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="text-white block hover:bg-blue-700 px-3 py-2 rounded-md w-full text-left"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}