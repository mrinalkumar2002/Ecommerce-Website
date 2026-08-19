import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './Notfound.css'

function Notfound() {
  const navigate = useNavigate()

  return (
    <div className='error'>
      <div className='error-code'>404</div>
      <h2>Page Not Found</h2>
      <p className='error-desc'>The page you're looking for doesn't exist or has been moved.</p>

      <div className='error-actions'>
        <button className='error-btn-primary' onClick={() => navigate('/')}>
          🏠 Back to Home
        </button>
        <button className='error-btn-secondary' onClick={() => navigate('/productlist')}>
          🛍️ Browse Products
        </button>
      </div>

      <div className='error-quick-links'>
        <span>Quick links:</span>
        <Link to="/cart">Cart</Link>
        <Link to="/orders">Orders</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/login">Login</Link>
      </div>
    </div>
  )
}
export default Notfound
