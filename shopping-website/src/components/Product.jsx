import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Products = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Simple check if token exists
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Products Page</h1>
      <p>You've successfully logged in!</p>
    </div>
  );
};

export default Products;