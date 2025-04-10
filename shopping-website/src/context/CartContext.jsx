import { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CartContext = createContext();
const EXCHANGE_RATE = 83;

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      try {
        console.log('Adding item:', action.payload); // Debug log
        const existingItem = state.items.find(item => item.id === action.payload.id);
        const priceInINR = parseFloat(action.payload.price) * EXCHANGE_RATE;

        if (existingItem) {
          const updatedItems = state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
          console.log('Updated cart:', updatedItems); // Debug log
          return { ...state, items: updatedItems };
        }

        const newItem = {
          ...action.payload,
          price: priceInINR,
          quantity: 1
        };
        console.log('New item:', newItem); // Debug log
        return {
          ...state,
          items: [...state.items, newItem]
        };
      } catch (error) {
        console.error('Error in ADD_ITEM:', error);
        return state;
      }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };

    case 'CLEAR_CART':
      return { ...state, items: [] };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: []
  });
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      dispatch({ type: 'SET_CART', payload: JSON.parse(savedCart) });
    }
  }, []);

  useEffect(() => {
    if (state.items.length > 0) {
      localStorage.setItem('cart', JSON.stringify(state.items));
    }
  }, [state.items]);

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 2000);
  };

  const addToCart = (product) => {
    try {
      console.log('addToCart called with:', product); // Debug log
      dispatch({ type: 'ADD_ITEM', payload: product });
      showNotification('Item added to cart!');
    } catch (error) {
      console.error('Error in addToCart:', error);
    }
  };

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
    showNotification('Item removed from cart!', 'error');
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    showNotification('Cart cleared');
  };

  const cartTotal = state.items.reduce((sum, item) => 
    sum + (item.price * item.quantity), 0
  );

  return (
    <CartContext.Provider value={{
      cart: state.items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal
    }}>
      {children}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`notification ${notification.type}`}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};