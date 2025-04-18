import React from 'react';
import { Link } from 'react-router-dom';
import useProducts from '../../hooks/useProducts';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import ProductCard from '../../components/common/ProductCard';

const Home = () => {
  const { products, loading, error } = useProducts();
  
  // Get featured products (first 4 products)
  const featuredProducts = products.slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Stay cool with our quality cooling solutions
            </h1>
            <p className="mt-6 text-xl">
              Browse our selection of premium fans and air conditioners for any room size and budget.
            </p>
            <div className="mt-8">
              <Link
                to="/products"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50"
              >
                Shop Now
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 md:pl-10">
            <img
              src="https://images.unsplash.com/photo-1586902197503-e71026292412?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
              alt="Modern air conditioner"
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Fans Category */}
          <Link to="/products?category=fan" className="group">
            <div className="relative overflow-hidden rounded-lg h-80">
              <img
                src="https://images.unsplash.com/photo-1601084881623-cdf9a8ea242c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
                alt="Fans"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-2xl font-bold text-white">Fans</h3>
                <p className="text-white mt-1">
                  Energy-efficient fans for all room sizes
                </p>
              </div>
            </div>
          </Link>

          {/* Air Conditioners Category */}
          <Link to="/products?category=air_conditioner" className="group">
            <div className="relative overflow-hidden rounded-lg h-80">
              <img
                src="https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2132&q=80"
                alt="Air Conditioners"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-2xl font-bold text-white">Air Conditioners</h3>
                <p className="text-white mt-1">
                  Powerful cooling for ultimate comfort
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Featured Products</h2>
          
          {loading ? (
            <Loading />
          ) : error ? (
            <ErrorMessage message={error} />
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No products available at the moment. Please check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
          
          <div className="mt-12 text-center">
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              View All Products
            </Link>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Quality */}
          <div className="text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-md bg-blue-500 text-white">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mt-6 text-xl font-medium text-gray-900">Premium Quality</h3>
            <p className="mt-2 text-base text-gray-600">
              We offer only the best cooling products from trusted brands with verified quality.
            </p>
          </div>

          {/* Delivery */}
          <div className="text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-md bg-blue-500 text-white">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <h3 className="mt-6 text-xl font-medium text-gray-900">Fast Delivery</h3>
            <p className="mt-2 text-base text-gray-600">
              Quick and reliable delivery service to ensure your cooling needs are met promptly.
            </p>
          </div>

          {/* Customer Support */}
          <div className="text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-md bg-blue-500 text-white">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
            </div>
            <h3 className="mt-6 text-xl font-medium text-gray-900">24/7 Customer Support</h3>
            <p className="mt-2 text-base text-gray-600">
              Our customer service team is available around the clock to assist you with any queries.
            </p>
          </div>
        </div>
      </div>

      {/* Customer Testimonials */}
      <div className="bg-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-800 font-bold">JD</span>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">John Doe</h4>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "The Arctic Breeze Fan I bought exceeded my expectations. It's quiet, energy-efficient, and keeps my room perfectly cool during hot summer days."
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-800 font-bold">JS</span>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Jane Smith</h4>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "I recently purchased the FrostTech Split AC and I'm extremely satisfied with its performance. The installation was smooth and the cooling is top-notch."
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-800 font-bold">RJ</span>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Robert Johnson</h4>
                  <div className="flex text-yellow-400">
                    {[...Array(4)].map((_, i) => (
                      <svg key={i} className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <svg className="h-5 w-5 text-gray-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Fast delivery and excellent customer service. The CoolWave Ceiling Fan is beautiful and works perfectly. Would definitely shop here again."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-blue-700 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold mb-4">Ready to Upgrade Your Cooling System?</h2>
          <p className="text-xl mb-8">Browse our selection of premium cooling solutions today.</p>
          <Link
            to="/products"
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-blue-700 bg-white hover:bg-blue-50"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;