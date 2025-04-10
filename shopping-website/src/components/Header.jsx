import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiShoppingCart, FiLogOut } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

const Header = () => {
  const { cart } = useCart();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('cart');
    navigate('/');
  };

  return (
    <header className="header">
      <nav className="nav-container">
        <Link to="/products" className="nav-link">
          <FiHome /> Home
        </Link>
        <Link to="/cart" className="nav-link cart-link">
          <FiShoppingCart />
          Cart
          {cartCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="cart-badge"
            >
              {cartCount}
            </motion.span>
          )}
        </Link>
        <button onClick={handleLogout} className="nav-link logout-btn">
          <FiLogOut /> Logout
        </button>
      </nav>
    </header>
  );
};

export default Header;