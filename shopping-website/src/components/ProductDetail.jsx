import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiArrowLeft, FiStar, FiTruck, FiBox } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const EXCHANGE_RATE = 83;

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      const response = await fetch(`https://fakestoreapi.com/products/${id}`);
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      const productWithINR = {
        ...product,
        price: product.price * EXCHANGE_RATE
      };
      addToCart(productWithINR);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="product-detail-content"
        >
          <button 
            className="back-button"
            onClick={() => navigate('/products')}
          >
            <FiArrowLeft /> Back to Products
          </button>

          <div className="product-detail-grid">
            <div className="product-image-section">
              <motion.img 
                src={product.image} 
                alt={product.title}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
            </div>

            <div className="product-info-section">
              <h1>{product.title}</h1>
              
              <div className="product-meta">
                <span className="category">{product.category}</span>
                <div className="rating">
                  <FiStar className="star-icon" />
                  <span>{product.rating.rate}</span>
                  <span className="rating-count">({product.rating.count} reviews)</span>
                </div>
              </div>

              <p className="description">{product.description}</p>

              <div className="price-section">
                <div className="price">
                  <span className="currency">₹</span>
                  <span className="amount">{(product.price * EXCHANGE_RATE).toFixed(2)}</span>
                </div>
                <motion.button
                  className="add-to-cart-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddToCart}
                >
                  <FiShoppingCart />
                  Add to Cart
                </motion.button>
              </div>

              <div className="product-features">
                <h3>Product Details</h3>
                <ul>
                  <li>
                    <FiBox /> Category: {product.category}
                  </li>
                  <li>
                    <FiStar /> Rating: {product.rating.rate}/5
                  </li>
                  <li>
                    <FiTruck /> Fast Delivery Available
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProductDetail;