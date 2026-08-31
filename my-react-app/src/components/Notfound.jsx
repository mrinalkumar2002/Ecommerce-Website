import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './Notfound.css'
import { useTranslation } from 'react-i18next'

function Notfound() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <div className='error'>
      <div className='error-code'>404</div>
      <h2>{t('notfound.title')}</h2>
      <p className='error-desc'>{t('notfound.desc')}</p>

      <div className='error-actions'>
        <button className='error-btn-primary' onClick={() => navigate('/')}>
          {t('notfound.backToHome')}
        </button>
        <button className='error-btn-secondary' onClick={() => navigate('/productlist')}>
          {t('notfound.browseProducts')}
        </button>
      </div>

      <div className='error-quick-links'>
        <span>{t('notfound.quickLinks')}</span>
        <Link to="/cart">{t('notfound.cart')}</Link>
        <Link to="/orders">{t('notfound.orders')}</Link>
        <Link to="/profile">{t('notfound.profile')}</Link>
        <Link to="/login">{t('notfound.login')}</Link>
      </div>
    </div>
  )
}
export default Notfound
