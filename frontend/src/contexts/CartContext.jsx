import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);
  
  // Add item to cart
  const addToCart = (product, size, color, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        item => 
          item.productId === product._id && 
          item.size === size && 
          item.color === color
      );
      
      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        // Add new item
        return [...prevItems, {
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.imageURLs && product.imageURLs.length > 0 
            ? product.imageURLs[0] 
            : 'https://via.placeholder.com/100',
          size,
          color,
          quantity,
          category: product.category
        }];
      }
    });
  };
  
  // Remove item from cart
  const removeFromCart = (index) => {
    setCartItems(prevItems => prevItems.filter((_, i) => i !== index));
  };
  
  // Update quantity of item in cart
  const updateQuantity = (index, quantity) => {
    setCartItems(prevItems => {
      const updatedItems = [...prevItems];
      updatedItems[index].quantity = quantity;
      return updatedItems;
    });
  };
  
  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };
  
  // Calculate cart total
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };
  
  // Get count of items in cart
  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };
  
  // Value to be provided by the context
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
  };
  
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};