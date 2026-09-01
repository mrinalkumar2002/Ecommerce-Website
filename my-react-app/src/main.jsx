import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './i18n';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store.js';

// Clean any old corrupt translation cache entries
try {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('pvx_trans_') || key.startsWith('pvx_gt_trans_')) {
      const val = localStorage.getItem(key);
      if (val && (val.includes('MYMEMORY') || val.includes('WARNING:'))) {
        localStorage.removeItem(key);
      }
    }
  });
} catch {}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);

