import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMinusCircle, HiPlusCircle, HiTrash } from 'react-icons/hi';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleQuantityChange = (productId, change) => {
    const item = cart.find(item => item.id === productId);
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity > 0) {
        updateQuantity(productId, newQuantity);
      } else {
        removeFromCart(productId);
      }
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  const handlePlaceOrder = () => {
    setShowConfirmation(true);
    clearCart();
    setTimeout(() => {
      setShowConfirmation(false);
    }, 4000);
  };

  return (
    <div className="cart-container">
      {cart.length === 0 ? (
        <div className="empty-cart">Your cart is empty</div>
      ) : (
        <>
          <div className="cart-items">
            {cart.map(item => (
              <motion.div
                key={item.id}
                layout
                className="cart-item"
              >
                <img src={item.image} alt={item.title} />
                <div className="item-details">
                  <h3>{item.title}</h3>
                  <p className="item-price">₹{item.price.toFixed(2)}</p>
                  <p className="item-total">
                    Total: ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                  <div className="quantity-controls">
                    <button 
                      className="quantity-btn minus"
                      onClick={() => handleQuantityChange(item.id, -1)}
                    >
                      <HiMinusCircle size={24} />
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button 
                      className="quantity-btn plus"
                      onClick={() => handleQuantityChange(item.id, 1)}
                    >
                      <HiPlusCircle size={24} />
                    </button>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <HiTrash size={24} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="cart-summary">
            <div className="cart-total">
              <span>Total:</span>
              <span>₹{calculateTotal().toFixed(2)}</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="place-order-btn"
              onClick={handlePlaceOrder}
            >
              Place Your Order
            </motion.button>
          </div>
          <AnimatePresence>
            {showConfirmation && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="order-confirmation"
              >
                Order placed successfully!
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

export default Cart;