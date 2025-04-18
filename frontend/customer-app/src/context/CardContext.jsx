// customer-app/src/context/CartContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
};

// Cart context
const CartContext = createContext(initialState);

// Action types
const ADD_TO_CART = 'ADD_TO_CART';
const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
const UPDATE_QUANTITY = 'UPDATE_QUANTITY';
const CLEAR_CART = 'CLEAR_CART';

// Reducer function
const cartReducer = (state, action) => {
  switch (action.type) {
    case ADD_TO_CART: {
      const { product, quantity, size, color } = action.payload;
      
      // Check if item with same product, size and color already exists
      const existingItemIndex = state.items.findIndex(
        (item) => item.productId === product._id && 
                  item.size === size && 
                  item.color === color
      );
      
      let updatedItems;
      
      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += quantity;
      } else {
        // Item doesn't exist, add new item
        updatedItems = [
          ...state.items,
          {
            productId: product._id,
            name: product.name,
            price: product.price,
            image: product.imageURLs && product.imageURLs.length > 0 ? product.imageURLs[0] : null,
            quantity,
            size,
            color,
          },
        ];
      }
      
      // Calculate new totals
      const totalQuantity = updatedItems.reduce((total, item) => total + item.quantity, 0);
      const totalAmount = updatedItems.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      return {
        ...state,
        items: updatedItems,
        totalQuantity,
        totalAmount,
      };
    }
    
    case REMOVE_FROM_CART: {
      const { productId, size, color } = action.payload;
      
      // Filter out the item to remove
      const updatedItems = state.items.filter(
        (item) => 
          !(item.productId === productId && 
            item.size === size && 
            item.color === color)
      );
      
      // Calculate new totals
      const totalQuantity = updatedItems.reduce((total, item) => total + item.quantity, 0);
      const totalAmount = updatedItems.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      return {
        ...state,
        items: updatedItems,
        totalQuantity,
        totalAmount,
      };
    }
    
    case UPDATE_QUANTITY: {
      const { productId, size, color, quantity } = action.payload;
      
      // Find item to update
      const existingItemIndex = state.items.findIndex(
        (item) => item.productId === productId && 
                  item.size === size && 
                  item.color === color
      );
      
      if (existingItemIndex >= 0) {
        // Create new array
        const updatedItems = [...state.items];
        
        // Update quantity
        updatedItems[existingItemIndex].quantity = quantity;
        
        // Calculate new totals
        const totalQuantity = updatedItems.reduce((total, item) => total + item.quantity, 0);
        const totalAmount = updatedItems.reduce((total, item) => total + (item.price * item.quantity), 0);
        
        return {
          ...state,
          items: updatedItems,
          totalQuantity,
          totalAmount,
        };
      }
      
      return state;
    }
    
    case CLEAR_CART:
      return initialState;
      
    default:
      return state;
  }
};

// Cart provider
export const CartProvider = ({ children }) => {
  // Get cart from localStorage if available
  const getInitialState = () => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : initialState;
  };
  
  const [state, dispatch] = useReducer(cartReducer, null, getInitialState);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);
  
  // Add item to cart
  const addToCart = (product, quantity, size, color) => {
    dispatch({
      type: ADD_TO_CART,
      payload: { product, quantity, size, color },
    });
  };
  
  // Remove item from cart
  const removeFromCart = (productId, size, color) => {
    dispatch({
      type: REMOVE_FROM_CART,
      payload: { productId, size, color },
    });
  };
  
  // Update item quantity
  const updateQuantity = (productId, size, color, quantity) => {
    dispatch({
      type: UPDATE_QUANTITY,
      payload: { productId, size, color, quantity },
    });
  };
  
  // Clear cart
  const clearCart = () => {
    dispatch({ type: CLEAR_CART });
  };
  
  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook to use cart context
export const useCart = () => {
  return useContext(CartContext);
};

export default CartContext;