// src/components/common/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Fans & ACs</h2>
            <p className="text-gray-300">
              Your one-stop shop for quality cooling solutions. We offer a wide range of fans and air conditioners to keep you comfortable in any season.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 hover:text-white">Products</Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-300 hover:text-white">Cart</Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Contact Us</h2>
            <address className="text-gray-300 not-italic">
              <p>123 Cooling Street</p>
              <p>Climate City, CC 12345</p>
              <p>Email: info@fansandacs.com</p>
              <p>Phone: (123) 456-7890</p>
            </address>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Fans & ACs. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;