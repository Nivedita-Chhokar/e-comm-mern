// customer-app/src/components/layout/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = {
    shop: [
      { name: 'Fans', path: '/products?category=fan' },
      { name: 'Air Conditioners', path: '/products?category=air_conditioner' },
      { name: 'All Products', path: '/products' },
    ],
    account: [
      { name: 'My Account', path: '/profile' },
      { name: 'Order History', path: '/orders' },
      { name: 'Cart', path: '/cart' },
    ],
    support: [
      { name: 'Shipping Policy', path: '/shipping' },
      { name: 'Returns & Exchanges', path: '/returns' },
      { name: 'Privacy Policy', path: '/privacy' },
    ],
  };

  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Cool Air Shop</h2>
            <p className="text-gray-300 text-sm">
              Your one-stop shop for high-quality fans and air conditioners.
              Stay cool with our premium selection of cooling appliances.
            </p>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Shop</h3>
            <ul className="space-y-2">
              {footerLinks.shop.map((link, index) => (
                <li key={index}>
                  <Link to={link.path} className="text-gray-300 hover:text-white text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Account</h3>
            <ul className="space-y-2">
              {footerLinks.account.map((link, index) => (
                <li key={index}>
                  <Link to={link.path} className="text-gray-300 hover:text-white text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <Link to={link.path} className="text-gray-300 hover:text-white text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700">
          <p className="text-gray-400 text-sm text-center">
            &copy; {currentYear} Cool Air Shop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;