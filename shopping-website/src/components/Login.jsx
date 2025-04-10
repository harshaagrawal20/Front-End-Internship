import { useState, useRef, useEffect } from 'react';
import { FiUser, FiLock, FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ProductListing from './ProductListing';  // Make sure this path is correct
import { loginUser } from '../utils/auth';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showTestCreds, setShowTestCreds] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [error, setError] = useState('');
  const formRef = useRef();
  const navigate = useNavigate();
  
  // Custom particle effect hook
  const triggerBurst = useParticleBurst(formRef);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const success = await loginUser(credentials);

    if (success) {
      navigate('/products');
    } else {
      setError('Invalid credentials');
    }
    setIsLoading(false);
  };

  // Dynamic gradient based on input focus
  useEffect(() => {
    const updateGradient = () => {
      const angle = activeField === 'username' ? 135 : activeField === 'password' ? 45 : 90;
      document.documentElement.style.setProperty('--gradient-angle', `${angle}deg`);
    };
    updateGradient();
  }, [activeField]);

  return (
    <div className="galaxy-login-container" style={{ backgroundColor: '#0f172a' }}>
      {/* New responsive changes */}
      <div className="responsive-wrapper">
        {/* Animated background elements */}
        <div className="galaxy-stars"></div>
        <div className="galaxy-twinkles"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="login-content"
        >
          {/* Cosmic header */}
          <div className="cosmic-header">
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="cosmic-title"
            >
              Welcome to the <span className="text-gradient">Zyntra</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="cosmic-subtitle"
            >
              Journey begins with a single sign-in
            </motion.p>
          </div>

          {/* Interactive login card */}
          <motion.div 
            ref={formRef}
            whileHover={{ scale: 1.01 }}
            className="cosmic-card"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username field with floating label */}
              <div className="input-field">
                <input
                  type="text"
                  id="username"
                  value={credentials.username}
                  onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                  onFocus={() => setActiveField('username')}
                  onBlur={() => setActiveField(null)}
                  className="cosmic-input"
                  required
                />
                <motion.label 
                  htmlFor="username"
                  animate={{
                    y: credentials.username ? -24 : 0,
                    scale: credentials.username ? 0.8 : 1,
                    color: credentials.username ? '#6366f1' : '#9ca3af'
                  }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="input-label"
                >
                  <FiUser className="label-icon" />
                  Username
                </motion.label>
                <div className="input-underline"></div>
              </div>

              {/* Password field with toggle */}
              <div className="input-field">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  onFocus={() => setActiveField('password')}
                  onBlur={() => setActiveField(null)}
                  className="cosmic-input"
                  required
                />
                <motion.label 
                  htmlFor="password"
                  animate={{
                    y: credentials.password ? -24 : 0,
                    scale: credentials.password ? 0.8 : 1,
                    color: credentials.password ? '#6366f1' : '#9ca3af'
                  }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="input-label"
                >
                  <FiLock className="label-icon" />
                  Password
                </motion.label>
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
                <div className="input-underline"></div>
              </div>

              {/* Animated submit button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileTap={{ scale: 0.95 }}
                whileHover={{ boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)' }}
                className="cosmic-button"
              >
                <span className="button-text">
                  {isLoading ? 'Warp Speed...' : 'Begin Journey'}
                </span>
                <motion.div
                  animate={{ x: isLoading ? 5 : 0 }}
                  transition={{ repeat: Infinity, repeatType: 'reverse', duration: 0.8 }}
                >
                  <FiArrowRight className="button-icon" />
                </motion.div>
                {isLoading && (
                  <motion.div 
                    className="button-loader"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  />
                )}
              </motion.button>
            </form>

            {/* Interactive test credentials */}
            <div className="test-creds-container">
              <button 
                onClick={() => setShowTestCreds(!showTestCreds)}
                className="test-creds-toggle"
              >
                <span>Need credentials?</span>
                <motion.div
                  animate={{ rotate: showTestCreds ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.div>
              </button>

              <AnimatePresence>
                {showTestCreds && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="test-creds-dropdown"
                  >
                    <div className="test-creds-content">
                      <div className="cred-item">
                        <span>Username:</span>
                        <code>mor_2314</code>
                      </div>
                      <div className="cred-item">
                        <span>Password:</span>
                        <code>83r5^_</code>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Footer with animated particles */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="cosmic-footer"
          >
            By continuing, you agree to our <a href="#" className="footer-link">Terms</a> and <a href="#" className="footer-link">Privacy Policy</a>
          </motion.p>
        </motion.div>

        {/* Custom CSS for the galaxy effects */}
        <style jsx global>{`
          :root {
            --gradient-angle: 90deg;
            --primary: #6366f1;
            --primary-dark: #4f46e5;
            --space-dark: #0f172a;
            --space-light: #1e293b;
            --star-color: rgba(255, 255, 255, 0.8);
          }
          
          .galaxy-login-container {
            min-height: 100vh;
            width: 100vw;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
          }
          
          .galaxy-stars {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: 
              radial-gradient(1px 1px at 20px 30px, var(--star-color), rgba(0,0,0,0)),
              radial-gradient(1px 1px at 40px 70px, var(--star-color), rgba(0,0,0,0)),
              radial-gradient(1px 1px at 90px 40px, var(--star-color), rgba(0,0,0,0)),
              radial-gradient(1px 1px at 130px 80px, var(--star-color), rgba(0,0,0,0)),
              radial-gradient(1px 1px at 160px 120px, var(--star-color), rgba(0,0,0,0));
            background-size: 200px 200px;
            animation: twinkle 10s infinite alternate;
          }
          
          .galaxy-twinkles {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: 
              radial-gradient(1px 1px at 60px 150px, var(--star-color), rgba(0,0,0,0)),
              radial-gradient(1px 1px at 100px 90px, var(--star-color), rgba(0,0,0,0)),
              radial-gradient(1px 1px at 150px 60px, var(--star-color), rgba(0,0,0,0)),
              radial-gradient(1px 1px at 180px 150px, var(--star-color), rgba(0,0,0,0));
            background-size: 200px 200px;
            animation: twinkle 7s infinite alternate-reverse;
          }
          
          @keyframes twinkle {
            0% { opacity: 0.2; }
            100% { opacity: 0.8; }
          }
          
          .login-content {
            width: 100%;
            max-width: 420px;
            z-index: 10;
            padding: 2rem 1rem;
            margin: auto;
          }
          
          .cosmic-header {
            text-align: center;
            margin-bottom: 2.5rem;
          }
          
          .cosmic-title {
            font-size: 2.25rem;
            font-weight: 800;
            color: white;
            margin-bottom: 0.5rem;
            line-height: 1.2;
          }
          
          .text-gradient {
            background: linear-gradient(90deg, #818cf8, #c4b5fd);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            animation: gradient-shift 8s ease infinite;
            background-size: 200% 200%;
          }
          
          @keyframes gradient-shift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          .cosmic-subtitle {
            color: #94a3b8;
            font-size: 1.125rem;
          }
          
          .cosmic-card {
            background: rgba(15, 23, 42, 0.7);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 1.5rem;
            padding: 1.5rem;  /* Reduced padding for mobile */
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          }
          
          .input-field {
            position: relative;
            margin-bottom: 1.5rem;
          }
          
          .cosmic-input {
            width: 100%;
            padding: 1rem 0;
            background: transparent;
            border: none;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            color: white;
            font-size: 1rem;
            transition: all 0.3s ease;
          }
          
          .cosmic-input:focus {
            outline: none;
            border-bottom-color: var(--primary);
          }
          
          .input-label {
            position: absolute;
            top: 1rem;
            left: 0;
            color: #94a3b8;
            pointer-events: none;
            display: flex;
            align-items: center;
            font-size: 1rem;
            transition: all 0.3s ease;
          }
          
          .label-icon {
            margin-right: 0.5rem;
          }
          
          .input-underline {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0;
            height: 2px;
            background: var(--primary);
            transition: width 0.4s ease;
          }
          
          .cosmic-input:focus ~ .input-underline {
            width: 100%;
          }
          
          .password-toggle {
            position: absolute;
            right: 0;
            top: 1rem;
            background: transparent;
            border: none;
            color: #94a3b8;
            cursor: pointer;
            transition: color 0.2s ease;
          }
          
          .password-toggle:hover {
            color: var(--primary);
          }
          
          .cosmic-button {
            width: 100%;
            padding: 1rem;
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
            color: white;
            border: none;
            border-radius: 0.75rem;
            font-size: 1rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            margin-top: 1.5rem;
          }
          
          .button-text {
            margin-right: 0.75rem;
          }
          
          .button-icon {
            font-size: 1.25rem;
          }
          
          .button-loader {
            position: absolute;
            right: 1rem;
            width: 1.25rem;
            height: 1.25rem;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-top-color: white;
            border-radius: 50%;
          }
          
          .test-creds-container {
            margin-top: 2rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            padding-top: 1.5rem;
          }
          
          .test-creds-toggle {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            background: transparent;
            border: none;
            color: #94a3b8;
            font-size: 0.875rem;
            cursor: pointer;
            transition: color 0.2s ease;
          }
          
          .test-creds-toggle:hover {
            color: var(--primary);
          }
          
          .test-creds-toggle svg {
            margin-left: 0.5rem;
          }
          
          .test-creds-dropdown {
            overflow: hidden;
            margin-top: 1rem;
          }
          
          .test-creds-content {
            background: rgba(30, 41, 59, 0.5);
            border-radius: 0.5rem;
            padding: 1rem;
          }
          
          .cred-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.5rem;
            font-size: 0.875rem;
          }
          
          .cred-item:last-child {
            margin-bottom: 0;
          }
          
          .cred-item span {
            color: #94a3b8;
          }
          
          .cred-item code {
            background: rgba(99, 102, 241, 0.1);
            color: var(--primary);
            padding: 0.25rem 0.5rem;
            border-radius: 0.25rem;
            font-family: monospace;
          }
          
          .cosmic-footer {
            text-align: center;
            color: #64748b;
            font-size: 0.75rem;
            margin-top: 2rem;
          }
          
          .footer-link {
            color: #a5b4fc;
            text-decoration: none;
            transition: color 0.2s ease;
          }
          
          .footer-link:hover {
            color: white;
            text-decoration: underline;
          }

          .responsive-wrapper {
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
          }

          @media (max-width: 768px) {
            .responsive-wrapper {
              padding: 0 0.5rem;
            }
          }

          @media (max-width: 640px) {
            .cosmic-title {
              font-size: 1.75rem;  /* Smaller font size for mobile */
            }
            
            .cosmic-subtitle {
              font-size: 1rem;
            }
            
            .cosmic-card {
              padding: 1.25rem;
            }
            
            .input-field {
              margin-bottom: 1rem;
            }
            
            .cosmic-input {
              font-size: 0.875rem;
            }
            
            .input-label {
              font-size: 0.875rem;
            }
          }
          
          @media (min-width: 641px) and (max-width: 1024px) {
            .cosmic-card {
              padding: 2rem;
            }
            
            .login-content {
              max-width: 480px;
            }
          }
          
          @media (max-height: 700px) {
            .cosmic-header {
              margin-bottom: 1.5rem;
            }
            
            .test-creds-container {
              margin-top: 1rem;
              padding-top: 1rem;
            }
            
            .cosmic-footer {
              margin-top: 1rem;
            }
          }
          
          @media (prefers-reduced-motion: reduce) {
            .galaxy-stars,
            .galaxy-twinkles {
              animation: none;
            }
            
            .text-gradient {
              animation: none;
            }
            
            .cosmic-button {
              transition: none;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

// Custom hook for particle burst effect
const useParticleBurst = (elementRef) => {
  const triggerBurst = () => {
    if (!elementRef.current) return;
    
    const colors = ['#6366f1', '#8b5cf6', '#a5b4fc', '#c4b5fd'];
    const particles = 15;
    const angle = 90;
    const spread = 45;
    const size = 6;
    const duration = 1000;
    const speed = 1;
    
    for (let i = 0; i < particles; i++) {
      const particle = document.createElement('div');
      particle.style.position = 'absolute';
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      particle.style.borderRadius = '50%';
      particle.style.pointerEvents = 'none';
      
      const rect = elementRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const particleAngle = angle + (Math.random() * spread - spread / 2);
      const radians = particleAngle * (Math.PI / 180);
      const distance = Math.random() * 100 * speed;
      
      const startX = centerX;
      const startY = centerY;
      const endX = startX + Math.cos(radians) * distance;
      const endY = startY + Math.sin(radians) * distance;
      
      particle.style.left = `${startX}px`;
      particle.style.top = `${startY}px`;
      particle.style.opacity = '1';
      particle.style.transform = 'scale(1)';
      
      document.body.appendChild(particle);
      
      const animation = particle.animate([
        { 
          transform: 'scale(1)',
          opacity: 1,
          left: `${startX}px`,
          top: `${startY}px`
        },
        { 
          transform: 'scale(0.5)',
          opacity: 0,
          left: `${endX}px`,
          top: `${endY}px`
        }
      ], {
        duration: duration,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
      });
      
      animation.onfinish = () => {
        particle.remove();
      };
    }
  };
  
  return triggerBurst;
};

export default Login;

// In your router configuration:
//<Route path="/products" element={<ProductListing />} />